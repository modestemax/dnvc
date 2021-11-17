import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketsService {

  serverAdress = 'https://admin.dnvc-cm.org/';
  advancedSearchServerAdress = 'https://dnvc-admin.herokuapp.com/';


  constructor(private httpClient: HttpClient) { }

  getMarketsFromServer(): Observable<any> {
    return this.httpClient.get<any[]>(this.serverAdress + 'marches/reduced', { responseType: 'json' });
  }

  getMarketFromServer(market: string): Observable<any> {
    return this.httpClient.get<any[]>(this.serverAdress + 'marches?_sort=Nom:ASC&_where[0][Nom]=' + market, { responseType: 'json' });
  }

  getSingleMarketFromServer(market: string): Observable<any> {
    return this.httpClient.get<any[]>(this.serverAdress +
      'alertes?_sort=Title:ASC&_locale=en&_where[Marches.Nom]=' + market, { responseType: 'json' });
  }

  getSingleOrGroupOfmarketsFromServer(sector?: any, market?: any, theme?: any, debut?: any, fin?: any): Observable<any> {

    market = market.replace(/ /g, '%20');
    let initialReq = this.advancedSearchServerAdress + 'alertes/adv-search?_where[Marches.Nom]=' + market;


    if (typeof sector !== 'undefined' && sector !== null) {
      sector = sector.replace(/ /g, '%20');
      initialReq += '&_where[Filieres.Name]=' + sector;
    }

    if (typeof theme !== 'undefined' && theme !== null) {
      theme = theme.replace(/ /g, '%20');
      initialReq += '&_where[themes_de_veille.Nom]=' + theme;
    }

    if (typeof debut !== 'undefined' && debut !== null) {
      initialReq += '&_where[DatePublication_gte]=' + debut.toLocaleDateString('en-CA');
    }

    if (typeof fin !== 'undefined' && fin !== null) {
      initialReq += '&_where[DatePublication_lte]=' + fin.toLocaleDateString('en-CA');
    }

    return this.httpClient.get<any[]>(initialReq, {responseType: 'json'});
  }
}
