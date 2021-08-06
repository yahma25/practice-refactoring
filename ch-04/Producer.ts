'use-strict';

import { Province } from './Province';

export class Producer {
  private _cost: number;

  private _name: string;

  private _production: number;

  constructor(private province: Province, data: Producer) {
    this._cost = data.cost;
    this._name = data.name;
    this._production = data.production || 0;
  }

  get name(): string {
    return this._name;
  }

  get cost(): number {
    return this._cost;
  }

  set cost(arg: number | string) {
    this._cost = typeof arg === 'string' ? parseInt(arg) : arg;
  }

  get production(): number {
    return this._production;
  }

  set production(amountStr: number | string) {
    const amount: number =
      typeof amountStr === 'string' ? parseInt(amountStr) : amountStr;
    const newProduction: number = Number.isNaN(amount) ? 0 : amount;
    this.province.totalProduction += newProduction - this._production;
    this._production = newProduction;
  }
}
