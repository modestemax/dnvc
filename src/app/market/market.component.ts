import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {from} from 'rxjs';
import {groupBy, mergeMap, toArray} from 'rxjs/operators';
import {MarketsService} from '../services/markets.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private breakPointObserver: BreakpointObserver,
              private marketsService: MarketsService) { }

  currentMarket: string;
  serverAdress = 'https://dnvc-admin.herokuapp.com';
  marketImageUrl = '';
  marketIntroText = '';
  lastUpdate = '';
  filterValue = 'ALL';
  totalItems = 0;
  page = 1;
  stickyMenu = false;
  openedMenu = false;
  isSmallScreen = false;
  isThereAlert = true;
  ready = false;

  severity = {
    Threat: 'red',
    Weak: 'green',
    Opportunity: 'blue'
  };

  filteredAlert: any[] = [];
  content: any[] = [];
  temp: any[];

  filter(item: any, elt?: any): void {
    document.getElementById('top').scrollIntoView({
      behavior: 'smooth'
    });
    document.querySelectorAll('.active-item').forEach((i) => {
      i.classList.remove('active-item');
    });
    this.filterValue = item.toString();
    this.totalItems = 0;
    this.filteredAlert = [];
    this.page = 1;
    if (item === 'ALL') {
      this.content.forEach((element) => {
        element.content.forEach((alert) => {
          this.filteredAlert.push(alert);
        });
        this.totalItems += element.content.length;
      });
    } else {
      this.content.forEach((element) => {
        if (element.alerte === item) {
          element.content.forEach((alert) => {
            this.filteredAlert.push(alert);
          });
          this.totalItems = element.content.length;
        }
      });
    }
    elt.classList.add('active-item');
  }

  ngOnInit(): void {
    const url = this.activatedRoute.snapshot.paramMap.get('zone');
    this.currentMarket = url;
    this.getMarketProperties(url);

    this.breakPointObserver.observe(['(max-width: 765px)']).subscribe(result => {
      if (result.matches) {
        this.isSmallScreen = true;
      } else {
        this.isSmallScreen = false;
      }
    });
  }

  getMarketProperties(url: string): void {
    this.ready = false;
    this.isThereAlert = true;
    this.marketsService.getSingleMarketFromServer(url).subscribe((data) => {
      if (data.length === 0) {
        this.isThereAlert = false;
      } else {
        this.isThereAlert = true;
      }

      this.temp = data;
      from(this.temp)
        .pipe(
          groupBy(element => element.themes_de_veille.Nom),
          mergeMap(group => group.pipe(toArray()))
        )
        .subscribe(
          (val) => {
            const tempContent = [];
            val.forEach((elt) => {
              if (this.marketImageUrl === '' || this.marketIntroText === '') {
                for (let i = 0; i < elt.Marches.length; i++) {
                  if (elt.Marches[i].Nom === url) {
                    this.marketImageUrl = this.serverAdress + elt.Marches[i].Logo_Large[0].url;
                    this.marketIntroText = elt.Marches[i].Intro;
                    this.lastUpdate = elt.Marches[i].updated_at.split('T')[0];
                    break;
                  }
                }
              }
              tempContent.push(
                {
                  color: this.severity[elt.Type],
                  date: elt.DatePublication,
                  author: elt.Emetteur !== null ? elt.Emetteur.NomStructure : elt.Emetteur,
                  title: elt.Title,
                  text: elt.Resume,
                  sourceType: elt.SourceFile.length === 0 ? 'url' : 'document',
                  source: elt.SourceFile.length === 0 ? elt.sourceUrl : this.serverAdress + elt.SourceFile[0].url,
                  markets: elt.Marches
                }
              );
            });
            this.content.push(
              {
                alerte: val[0].themes_de_veille.Nom,
                content: tempContent
              });
          },
          (error) => {},
          () => {
            this.ready = true;
            const all = document.getElementById('all');
            this.filter('ALL', all);
          });
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event): void {
    if (window.pageYOffset >= 1120) {
      this.stickyMenu = true;
    } else {
      this.stickyMenu = false;
    }
  }

  open(): void {
    this.openedMenu = !this.openedMenu;
  }

}
