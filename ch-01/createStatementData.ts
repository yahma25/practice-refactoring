import { Performance, EnrichPerformance, Invoice, Play, Plays } from './Types';

export interface StatementData {
  customer: string;
  performances: EnrichPerformance[];
  play?: Play;
  totalAmount: number;
  totalVolumeCredits: number;
}

export function createStatementData(
  invoice: Invoice,
  plays: Plays,
): StatementData {
  const result: StatementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
    totalAmount: 0,
    totalVolumeCredits: 0,
  };
  result.totalAmount = totalAmount(result.performances);
  result.totalVolumeCredits = totalVolumeCredits(result.performances);

  return result;

  // 불변성을 지키기 위해 얕은 복제
  function enrichPerformance(performance: Performance): EnrichPerformance {
    const result: EnrichPerformance = Object.assign(
      {},
      performance as EnrichPerformance,
    );
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;

    function playFor(performance: Performance): Play {
      return plays[performance.playID];
    }

    /**
     * 개수 구하기
     * [point]
     * - 값이 바뀌지 않는 변수는 매개변수로 전달
     */
    function amountFor(performance: EnrichPerformance): number {
      let result = 0; // 명확한 이름으로 변경. thisAmount -> result

      switch (performance.play.type) {
        case 'tragedy':
          result = 40000;
          if (performance.audience > 30) {
            result += 1000 * (performance.audience - 30);
          }
          break;

        case 'comedy':
          result = 30000;
          if (performance.audience > 20) {
            result += 10000 + 500 * (performance.audience - 20);
          }
          result += 300 * performance.audience;
          break;

        default:
          throw new Error(`알 수 없는 장르: ${performance.play.type}`);
      }

      return result;
    }

    function volumeCreditsFor(performance: EnrichPerformance): number {
      let result: number = 0;

      result += Math.max(performance.audience - 30, 0);
      if ('comedy' === performance.play.type) {
        result += Math.floor(performance.audience / 5);
      }

      return result;
    }
  }

  function totalAmount(performances: EnrichPerformance[]): number {
    return performances.reduce((result, perf) => result + perf.amount, 0);
  }

  function totalVolumeCredits(performances: EnrichPerformance[]): number {
    return performances.reduce(
      (result, perf) => result + perf.volumeCredits,
      0,
    );
  }
}
