import { Component } from '@angular/core';

import { MustSignComponent } from '../../../components/modals/must-sign/must-sign.component';

@Component({
  selector: 'app-must-log',
  standalone: true,
  imports: [
    MustSignComponent
  ],
  templateUrl: './must-log.component.html',
  styleUrl: './must-log.component.css'
})
export class MustLogComponent {

}
