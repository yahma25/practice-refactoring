'use-strict';

import { Invoice, Plays } from './Types';
import InvoicesMock from './mock/invoices.json';
import PlaysMock from './mock/plays.json';
import { statement } from './Statement';
import { statement as statementRefactoring } from './Statement.Refactoring';

describe('statement 테스트', () => {
  const invoice: Invoice = Object.assign(InvoicesMock, new Array<Invoice>())[0];
  const plays: Plays = <Plays>PlaysMock;

  const expected = `청구 내역 (고객명: BigCo)
hamlet: $650.00 (55석)
As You Like It: $580.00 (35석)
Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점`;

  test('원본', () => {
    expect(statement(invoice, plays)).toMatch(expected);
  });

  test('리팩터링', () => {
    expect(statementRefactoring(invoice, plays)).toMatch(expected);
  });
});
