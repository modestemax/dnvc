import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dnvc';
  version = '1.0.2';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('fr');
    console.log('DNVC version ' + this.version);
  }
}
