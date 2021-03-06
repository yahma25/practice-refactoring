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
    const calculator: PerformanceCalculator = createPerformanceCalculator(
      performance,
      playFor(performance),
    );

    const result: EnrichPerformance = Object.assign(
      {},
      performance as EnrichPerformance,
    );
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;

    return result;

    function playFor(performance: Performance): Play {
      return plays[performance.playID];
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

/**
 * 팩토리 패턴을 사용하여 타입에 맞는 계산을 수행하는 서브 클래스 생성
 */
function createPerformanceCalculator(
  performance: Performance,
  play: Play,
): PerformanceCalculator {
  switch (play.type) {
    case 'tragedy':
      return new TragedyCalculator(performance, play);
    case 'comedy':
      return new ComedyCalculator(performance, play);
  }
}

/**
 * 조건부 로직을 다향성을 이용하여 처리하기 위해 계산 역할을 수행
 */
class PerformanceCalculator {
  constructor(
    protected readonly performance: Performance,
    public readonly play: Play,
  ) {}

  /**
   * 개수 구하기
   * [point]
   * - 값이 바뀌지 않는 변수는 매개변수로 전달
   */
  get amount(): number {
    throw new Error('서브 클래스를 처리하도록 설계됨');
  }

  get volumeCredits(): number {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount(): number {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount(): number {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;

    return result;
  }

  get volumeCredits(): number {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}
