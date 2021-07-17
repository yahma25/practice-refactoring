import { Invoice, Play, Plays, Performance } from './Types';

export function statement(invoice: Invoice, plays: Plays): string {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  const playFor = (performance: Performance): Play => {
    return plays[performance.playID];
  };

  for (let perf of invoice.performances) {
    // 한 번의 공연에 대한 요금을 계산
    let thisAmount: number = amountFor(perf, playFor(perf));

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' === playFor(perf).type)
      volumeCredits += Math.floor(perf.audience / 5);

    // 청구 내역을 출력한다.
    result += `${playFor(perf).name}: ${format(thisAmount / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

/**
 * 개수 구하기
 * [point]
 * - 값이 바뀌지 않는 변수는 매개변수로 전달
 */
function amountFor(performance: Performance, play: Play): number {
  let result = 0; // 명확한 이름으로 변경. thisAmount -> result

  switch (play.type) {
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
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }

  return result;
}
