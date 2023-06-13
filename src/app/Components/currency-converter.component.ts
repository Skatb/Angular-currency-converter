import { Component, OnInit } from '@angular/core';
import { CurrencyService, Currency } from '../service/currency.service';

type CurrencyCode = 'UAH' | 'USD' | 'EUR';

interface ExchangeRates {
  [key: string]: {
    [key: string]: number;
  }
}

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})

export class CurrencyConverterComponent implements OnInit {
  amount1: number = 0;
  currency1: CurrencyCode = 'UAH';

  amount2: number = 0;
  currency2: CurrencyCode = 'USD';

  public currencies: CurrencyCode[] = ['UAH', 'USD', 'EUR'];
  public exchangeRates: ExchangeRates = {};

  lastUpdated: 'amount1' | 'amount2' = 'amount1';

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.currencyService.getExchangeRates().subscribe((data: Currency[]) => {
      this.updateExchangeRates(data);
      this.updateAmounts(this.lastUpdated);
    });
  }

  updateExchangeRates(data: Currency[]): void {
    const conversionMap: { [key: number]: CurrencyCode } = {
      980: 'UAH',
      840: 'USD',
      978: 'EUR'
    }

    data.forEach((currency: Currency) => {
      const currencyCodeA = conversionMap[currency.currencyCodeA]
      const currencyCodeB = conversionMap[currency.currencyCodeB]
      const rateBuy = currency.rateBuy;
      const rateSell = currency.rateSell

      if (!this.exchangeRates[currencyCodeA]) {
        this.exchangeRates[currencyCodeA] = {}
      }
      if (!this.exchangeRates[currencyCodeB]) {
        this.exchangeRates[currencyCodeB] = {}
      }

      this.exchangeRates[currencyCodeA][currencyCodeB] = rateBuy
      this.exchangeRates[currencyCodeB][currencyCodeA] = 1 / rateSell
    })
  }

  convertCurrency(): void {
    if (this.lastUpdated === 'amount1') {
      if (this.currency1 === this.currency2) {
        this.amount2 = this.amount1;
      } else {
        let rate = this.exchangeRates[this.currency1][this.currency2];
        this.amount2 = parseFloat((this.amount1 * rate).toFixed(2));
      }
    } else {
      if (this.currency2 === this.currency1) {
        this.amount1 = this.amount2;
      } else {
        let rate = this.exchangeRates[this.currency2][this.currency1];
        this.amount1 = parseFloat((this.amount2 * rate).toFixed(2));
      }
    }
  }

  updateAmounts(inputNumber: 'amount1' | 'amount2'): void {
    this.lastUpdated = inputNumber;
    this.convertCurrency();
  }
}

