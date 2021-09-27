import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrls: ['./industry.component.scss']
})
export class IndustryComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private scroller: ViewportScroller,
              private breakPointObserver: BreakpointObserver) { }

  currentIndustriy: string;
  filterValue = 'ALL';
  actualDate = new Date().toLocaleDateString();
  totalItems = 0;
  page = 1;
  openedMenu = false;
  isSmallScreen = false;

  filteredAlert: any[] = [];
  content: any[] = [
    {
      alerte: 'Prix',
      content: [{
        color: 'red',
        date: new Date().toLocaleDateString(),
        author: 'Ministère du commerce',
        title: 'Hausse des prix de la banane',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam dignissimos doloribus eligendi minus molestias quia sint tempore? A, quisquam sapiente?',
        source: 'Document/URL',
        markets: ['CEMAC', 'ZLECAF']
        },
        {
          color: 'red',
          date: new Date().toLocaleDateString(),
          author: 'Ministère de l\'agriculture',
          title: 'Mauvaises recoltes dans le secteur de la banane',
          text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam dignissimos doloribus eligendi minus molestias quia sint tempore? A, quisquam sapiente?',
          source: 'Document/URL',
          markets: ['CEMAC', 'ZLECAF']
        }]
      },
    {
      alerte: 'Procédures douanières',
      content: [{
        color: 'green',
        date: new Date().toLocaleDateString(),
        author: 'Ministère de l\'agriculture',
        title: 'Baisse des taxes sur l\'importation',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam dignissimos doloribus eligendi minus molestias quia sint tempore? A, quisquam sapiente?',
        source: 'Document/URL',
        markets: ['CEMAC', 'UE']
        }]
      },
    {
      alerte: 'Règlementations',
      content: [{
        color: 'red',
        date: new Date().toLocaleDateString(),
        author: 'Ministère du commerce',
        title: 'Nouvelles règles concernant l\'importation de la banane',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam dignissimos doloribus eligendi minus molestias quia sint tempore? A, quisquam sapiente?',
        source: 'Document/URL',
        markets: ['CEMAC', 'ZLECAF']
        }]
      },
    {
      alerte: 'Débouchés',
      content: [{
        color: 'green',
        date: new Date().toLocaleDateString(),
        author: 'Ministère du commerce',
        title: 'Le marché de la banane de plus en plus rentable',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam dignissimos doloribus eligendi minus molestias quia sint tempore? A, quisquam sapiente?',
        source: 'Document/URL',
        markets: ['CEMAC', 'CEDEAO']
        }]
      }
  ];



  filter(item: any, elt?: any): void {
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
    const url = this.activatedRoute.snapshot.paramMap.get('industry');
    this.currentIndustriy = url;
    const all = document.getElementById('all');
    this.filter('ALL', all);

    this.breakPointObserver.observe(['(max-width: 765px)']).subscribe(result => {
      if (result.matches) {
        this.isSmallScreen = true;
      } else {
        this.isSmallScreen = false;
      }
    });
  }

  open(): void {
    this.openedMenu = !this.openedMenu;
  }
}
