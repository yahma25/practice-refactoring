'use-strict';

import { Producer } from './Producer';

export class Province {
  private _name: string;

  private _producers: Producer[] = [];

  private _totalProduction: number = 0;

  private _demand: number;

  private _price: number;

  constructor(doc: ProvinceData) {
    this._name = doc.name;
    this._demand = doc.demand;
    this._price = doc.price;
    doc.producers.forEach((d) => this.addProducer(new Producer(this, d)));
  }

  get name(): string {
    return this._name;
  }

  get producers(): Producer[] {
    return this._producers.slice();
  }

  get totalProduction(): number {
    return this._totalProduction;
  }

  set totalProduction(arg: number) {
    this._totalProduction = arg;
  }

  get demand(): number {
    return this._demand;
  }

  set demand(arg: number | string) {
    this._demand = typeof arg === 'string' ? parseInt(arg) : arg;
  }

  get price(): number {
    return this._price;
  }

  set price(arg: number | string) {
    this._price = typeof arg === 'string' ? parseInt(arg) : arg;
  }

  get shortfall(): number {
    return this._demand - this.totalProduction;
  }

  get profit(): number {
    return this.demandValue - this.demandCost;
  }

  get demandValue(): number {
    return this.satisfiedDemand * this.price;
  }

  get satisfiedDemand(): number {
    return Math.min(this._demand, this.totalProduction);
  }

  get demandCost(): number {
    let remainingDemand: number = this.demand;
    let result: number = 0;

    this.producers
      .sort((a, b) => a.cost - b.cost)
      .forEach((p) => {
        const contribution: number = Math.min(remainingDemand, p.production);
        remainingDemand -= contribution;
        result += contribution * p.cost;
      });

    return result;
  }

  private addProducer(arg: any): void {
    this._producers.push(arg);
    this._totalProduction += arg.production;
  }
}

export function sampleProvinceData(): ProvinceData {
  return Object.setPrototypeOf(
    {
      name: 'Asia',
      producers: [
        { name: 'Byzantium', cost: 10, production: 9 },
        { name: 'Attalia', cost: 12, production: 10 },
        { name: 'Sinope', cost: 10, production: 6 },
      ],
      demand: 30,
      price: 20,
    },
    ProvinceData,
  );
}

export class ProvinceData {
  constructor(
    public readonly name: string,
    public readonly producers: Producer[],
    public readonly demand: number,
    public readonly price: number,
  ) {}
}
