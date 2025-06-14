import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { LocalService } from './local.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthLogService implements CanActivate {

  constructor(private localStore: LocalService,
    private sessionStore: SessionService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if(this.sessionStore.get('isLogged') == 'true') {
      this.router.navigate(['home']);
      return false;
    } else {
      this.localStore.clear();
      return true;
    }
  }
}