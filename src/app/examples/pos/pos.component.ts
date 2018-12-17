import { Component } from '@angular/core';
import { PosService } from './pos.service';

@Component({
  selector: 'pos',
  templateUrl: './pos.html'
})
export class PosComponent {
  constructor(public service: PosService) {}

  meow() {
    this.service.meow();
  }

  meowFail() {
    this.service.meowFail();
  }
}
