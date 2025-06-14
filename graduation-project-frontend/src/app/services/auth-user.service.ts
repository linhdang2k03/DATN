import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService implements CanActivate {

  constructor(private localStore: LocalService, private router: Router) {}

  canActivate(): boolean {
    if(parseInt(this.localStore.get('role')!) < 3) {
      this.router.navigate(['home']);
      return false;
    } else {
      return true;
    }
  }
}