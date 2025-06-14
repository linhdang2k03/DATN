import { Component, Input } from '@angular/core';

import { LocalService } from '../../services/local.service';
import { UserHomeComponent } from '../user/user-home/user-home.component';
import { AdminHomeComponent } from '../admin/admin-home/admin-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    UserHomeComponent,
    AdminHomeComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private localStore: LocalService) {}

  role = +this.localStore.get('role')!;
}
