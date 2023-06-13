import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Currency {
  currencyCodeA: number;
  currencyCodeB: number;
  rateBuy: number;
  rateSell: number;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'https://api.monobank.ua/bank/currency';

  constructor(private http: HttpClient) {}

  getExchangeRates(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.apiUrl);
  }
}