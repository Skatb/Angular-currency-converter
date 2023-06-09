import { Component, OnInit } from '@angular/core';
import { CurrencyService } from './Service/currency.service';

interface ExchangeRates {
  [key: string]: {
    [key: string]: number;
  };
}

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent implements OnInit {
  amount1: number = 0;
  currency1: string = 'UAH';
  convertedAmount1To2: number = 0;

  amount2: number = 0;
  currency2: string = 'USD';
  convertedAmount2To1: number = 0;

  public exchangeRates: ExchangeRates = {
    UAH: {
      USD: 0,
      EUR: 0
    },
    USD: {
      UAH: 0,
      EUR: 0
    },
    EUR: {
      UAH: 0,
      USD: 0
    }
  };

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.currencyService.getExchangeRates().subscribe((data: any) => {
      data.forEach((currency: any) => {
        if (currency.currencyCodeA === 980 && currency.currencyCodeB === 840) {
          this.exchangeRates['UAH']['USD'] = currency.rateBuy;
          this.exchangeRates['USD']['UAH'] = 1 / currency.rateSell;
        } else if (currency.currencyCodeA === 840 && currency.currencyCodeB === 980) {
          this.exchangeRates['USD']['UAH'] = currency.rateBuy;
          this.exchangeRates['UAH']['USD'] = 1 / currency.rateSell;
        } else if (currency.currencyCodeA === 980 && currency.currencyCodeB === 978) {
          this.exchangeRates['UAH']['EUR'] = currency.rateBuy;
          this.exchangeRates['EUR']['UAH'] = 1 / currency.rateSell;
        } else if (currency.currencyCodeA === 978 && currency.currencyCodeB === 980) {
          this.exchangeRates['EUR']['UAH'] = currency.rateBuy;
          this.exchangeRates['UAH']['EUR'] = 1 / currency.rateSell;
        }
      });
      this.convertCurrency(1);
      this.convertCurrency(2);
    });
  }

  convertCurrency(direction: number): void {
    if (direction === 1) {
      if (this.currency1 === this.currency2) {
        this.convertedAmount1To2 = this.amount1;
        this.amount2 = this.amount1;
      } else if (this.currency1 === 'USD' && this.currency2 === 'EUR') {
        this.convertUSDtoEUR();
      } else if (this.currency1 === 'EUR' && this.currency2 === 'USD') {
        this.convertEURtoUSD();
      } else {
        const rate = this.exchangeRates[this.currency1][this.currency2];
        this.convertedAmount1To2 = this.amount1 * rate;
        this.amount2 = +this.convertedAmount1To2.toFixed(3);
      }
    } else if (direction === 2) {
      if (this.currency2 === this.currency1) {
        this.convertedAmount2To1 = this.amount2;
        this.amount1 = this.amount2;
      } else if (this.currency2 === 'USD' && this.currency1 === 'EUR') {
        this.convertUSDtoEUR();
      } else if (this.currency2 === 'EUR' && this.currency1 === 'USD') {
        this.convertEURtoUSD();
      } else {
        const rate = this.exchangeRates[this.currency2][this.currency1];
        this.convertedAmount2To1 = this.amount2 * rate;
        this.amount1 = +this.convertedAmount2To1.toFixed(3);
      }
    }
  }
  
  convertUSDtoEUR(): void {
    this.convertedAmount1To2 = this.amount1 * this.exchangeRates['USD']['UAH'] * this.exchangeRates['UAH']['EUR'];
    this.amount2 = +this.convertedAmount1To2.toFixed(3);
  }
  
  convertEURtoUSD(): void {
    this.convertedAmount1To2 = this.amount1 * this.exchangeRates['EUR']['UAH'] * this.exchangeRates['UAH']['USD'];
    this.amount2 = +this.convertedAmount1To2.toFixed(3);
  }
}