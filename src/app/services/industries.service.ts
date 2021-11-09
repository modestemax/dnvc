import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {combineLatest, merge, Observable} from 'rxjs';
import {map, mergeAll} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IndustriesService {

  serverAdress = 'https://admin.dnvc-cm.org/';

  constructor(private httpClient: HttpClient) { }

  getAlertsWhichHasNoSectors(): Observable<any> {
    return this.httpClient.get<any[]>(this.serverAdress + 'alertes?_sort=Title:ASC&_locale=en&_where[hasFilieres]=false', { responseType: 'json' });
  }

  getAlertsWhichHasNoMarkets(): Observable<any> {
    return this.httpClient.get<any[]>(this.serverAdress + 'alertes?_sort=Title:ASC&_locale=en&_where[hasMarches]=false', { responseType: 'json' });
  }

  getAlertsWhichHasNoThemes(): Observable<any> {
    return this.httpClient.get<any[]>(this.serverAdress + 'alertes?_sort=Title:ASC&_locale=en&_where[hasTheme]=false', { responseType: 'json' });
  }

  getSectorsFromServer(): Observable<any> {
    return this.httpClient.get<any[]>(this.serverAdress + 'filieres?_sort=Name:ASC', { responseType: 'json' });
  }

  getSectorFromServer(sector: string): Observable<any> {
    return this.httpClient.get<any[]>(this.serverAdress + 'filieres?_locale=en&_where[0][Name]=' + sector, { responseType: 'json' });
  }

  // getSingleSectorFromServer(sector: string): Observable<any> {
  //   return this.httpClient.get<any[]>(this.serverAdress + 'alertes?_sort=Title:ASC&_locale=en&_where[0][Filieres.Name]=' + sector, { responseType: 'json' });
  // }

  getSingleSectorFromServer(sector: string): Observable<any> {
    const req1 = this.httpClient.get<any[]>(this.serverAdress + 'alertes?_sort=Title:ASC&_locale=en&_where[Filieres.Name]=' + sector, { responseType: 'json' });
    const req2 = this.httpClient.get<any[]>(this.serverAdress + 'alertes?_sort=Title:ASC&_locale=en&_where[hasFilieres]=false', { responseType: 'json' });
    return combineLatest(req1, req2).pipe(
      map(([data1, data2]) => data1.concat(data2))
    );
  }

  getSingleOrGroupOfSectorsFromServer(sector: any, market?: any, theme?: any, debut?: any, fin?: any): Observable<any> {

    let initialReq = this.serverAdress + 'alertes?_sort=Title:ASC&_where[Filieres.Name]=' + sector;

    if (typeof market !== 'undefined' && market !== null) {
      initialReq += '&_where[Marches.Nom]=' + market;
    }

    if (typeof theme !== 'undefined' && theme !== null) {
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

  getSingleOrGroupOfSectorsFromServerHasFalse(sector: any, market?: any, theme?: any, debut?: any, fin?: any): Observable<any> {

    let initialReq = this.serverAdress + 'alertes?_sort=Title:ASC&_where[hasFilieres]=false';

    if (typeof market !== 'undefined' && market !== null) {
      initialReq += '&_where[hasMarches]=false';
    }

    if (typeof theme !== 'undefined' && theme !== null) {
      initialReq += '&_where[hasTheme]=false';
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
