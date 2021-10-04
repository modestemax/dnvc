import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {BreakpointObserver} from '@angular/cdk/layout';
import {from} from 'rxjs';
import {groupBy, mergeMap, toArray} from 'rxjs/operators';
import {NotesService} from '../services/notes.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private scroller: ViewportScroller,
              private breakPointObserver: BreakpointObserver,
              private notesService: NotesService) { }

  currentNote: string;
  serverAdress = 'https://dnvc-admin.herokuapp.com';
  noteImageUrl = '';
  noteIntroText = '';
  lastUpdate = '';
  filterValue = 'ALL';
  totalItems = 0;
  page = 1;
  stickyMenu = false;
  openedMenu = false;
  isSmallScreen = false;
  isThereNote = true;
  ready = false;

  severity = {
    Threat: 'red',
    Weak: 'green',
    Opportunity: 'blue'
  };

  filteredNotes: any[] = [];
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
    this.filteredNotes = [];
    this.page = 1;
    if (item === 'ALL') {
      this.content.forEach((element) => {
        element.content.forEach((alert) => {
          this.filteredNotes.push(alert);
        });
        this.totalItems += element.content.length;
      });
    } else {
      this.content.forEach((element) => {
        if (element.note === item) {
          element.content.forEach((note) => {
            this.filteredNotes.push(note);
          });
          this.totalItems = element.content.length;
        }
      });
    }
    elt.classList.add('active-item');
  }

  ngOnInit(): void {
    const url = this.activatedRoute.snapshot.paramMap.get('note');
    this.currentNote = url;
    this.getNoteProperties(url);

    this.breakPointObserver.observe(['(max-width: 765px)']).subscribe(result => {
      if (result.matches) {
        this.isSmallScreen = true;
      } else {
        this.isSmallScreen = false;
      }
    });
  }

  getNoteProperties(url: string): void {
    this.ready = false;
    this.isThereNote = true;
    this.notesService.getSingleNoteFromServer(url).subscribe((data) => {
      if (data.length === 0) {
        this.isThereNote = false;
      } else {
        this.isThereNote = true;
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
              if (this.noteImageUrl === '' || this.noteIntroText === '') {
                for (let i = 0; i < elt.Filieres.length; i++) {
                  if (elt.Filieres[i].Name === url) {
                    this.noteImageUrl = this.serverAdress + elt.Filieres[i].Photo.formats.large.url;
                    this.noteIntroText = elt.Filieres[i].Intro;
                    this.lastUpdate = elt.Filieres[i].updated_at.split('T')[0];
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
                  source: elt.SourceFile.length === 0 ? elt.sourceUrl : elt.sourceFile,
                  markets: elt.Marches
                }
              );
            });
            this.content.push(
              {
                note: val[0].themes_de_veille.Nom,
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

  redirectTo(url: any): void {
    window.open(url, '_blank');
  }
}
