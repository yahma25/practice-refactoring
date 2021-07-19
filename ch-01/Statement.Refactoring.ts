import { Invoice, Play, Plays, Performance } from './Types';

export function statement(invoice: Invoice, plays: Plays): string {
  let totalAmount = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    // 한 번의 공연에 대한 요금을 계산
    let thisAmount: number = amountFor(perf);

    // 청구 내역을 출력한다.
    result += `${playFor(perf).name}: ${usd(thisAmount)} (${
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${usd(totalAmount)}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n`;
  return result;

  function usd(aNumber: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  }

  /**
   * 개수 구하기
   * [point]
   * - 값이 바뀌지 않는 변수는 매개변수로 전달
   */
  function amountFor(performance: Performance): number {
    let result = 0; // 명확한 이름으로 변경. thisAmount -> result

    switch (playFor(performance).type) {
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
        throw new Error(`알 수 없는 장르: ${playFor(performance).type}`);
    }

    return result;
  }

  function totalVolumeCredits(): number {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
      volumeCredits += volumeCreditsFor(perf);
    }

    return volumeCredits;
  }

  function volumeCreditsFor(performance: Performance): number {
    let volumeCredits: number = 0;

    volumeCredits += Math.max(performance.audience - 30, 0);
    if ('comedy' === playFor(performance).type) {
      volumeCredits += Math.floor(performance.audience / 5);
    }

    return volumeCredits;
  }

  function playFor(performance: Performance): Play {
    return plays[performance.playID];
  }
}
