import { Invoice, Plays } from './Types';
import { StatementData, createStatementData } from './createStatementData';

export function statement(invoice: Invoice, plays: Plays): string {
  const statementData: StatementData = createStatementData(invoice, plays);
  return renderPlainText(statementData, plays);

  function renderPlainText(data: StatementData, plays: Plays): string {
    let result = `청구 내역 (고객명: ${data.customer})\n`;

    for (let perf of data.performances) {
      // 청구 내역을 출력한다.
      result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
    }

    result += `총액: ${usd(data.totalAmount)}\n`;
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`;

    return result;
  }

  function usd(aNumber: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  }
}
