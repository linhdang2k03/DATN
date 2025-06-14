import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LocalService } from '../../services/local.service';
import { SessionService } from '../../services/session.service';

import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { MustLogComponent } from '../../pages/auth/must-log/must-log.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MustLogComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  role = +this.localStore.get('role')! || 3;

  constructor(private localStore: LocalService,
    private sessionStore: SessionService
  ) { }

  isLogged = this.sessionStore.get('isLogged');

  ngOnInit() {
    if(this.sessionStore.get('isLogged') == null) {
      this.localStore.clear();
    }
  }
}
