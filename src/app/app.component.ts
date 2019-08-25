import { Component } from '@angular/core';
import {
  RemoteData,
  NotAsked,
  Success
} from '../../projects/lib/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    type AnObject = 42;

    let a: RemoteData<AnObject>;
    let b: RemoteData<42, string> = NotAsked.of();
    const c = Success.of<AnObject>(42);
    const d = NotAsked.of<AnObject>();

    a = b; // works
    a = c;
    a = d;
    b = d;
  }
}
