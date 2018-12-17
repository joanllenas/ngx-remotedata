import { Component } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  RemoteData,
  NotAsked,
  Loading,
  Success,
  Failure
} from '../../../../projects/lib/src/public_api';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'basics',
  templateUrl: './basics.html'
})
export class BasicsComponent {
  subscriptions: Subscription[] = [];

  testData$: BehaviorSubject<RemoteData<string>>;
  radiogroupForm: FormGroup;

  loading1$: BehaviorSubject<RemoteData<string>>;
  loading2$: BehaviorSubject<RemoteData<string>>;
  loading3$: BehaviorSubject<RemoteData<string>>;
  checkboxForm: FormGroup;

  constructor() {
    // Single observable source example
    const map: { [key: string]: RemoteData<string> } = {
      notAsked: new NotAsked(),
      loading: new Loading(),
      success: new Success('Ok ' + Math.round(1000 * Math.random()).toString()),
      failure: new Failure('Ouch!')
    };
    this.testData$ = new BehaviorSubject(new NotAsked());
    const testDataRadioGroup = new FormControl();
    this.radiogroupForm = new FormGroup({
      testDataRadioGroup
    });
    this.subscriptions.push(
      testDataRadioGroup.valueChanges.subscribe((data: string) => {
        this.testData$.next(map[data]);
      })
    );

    // Multiple observable sources example
    this.loading1$ = new BehaviorSubject(new NotAsked());
    this.loading2$ = new BehaviorSubject(new NotAsked());
    this.loading3$ = new BehaviorSubject(new NotAsked());
    const check1 = new FormControl();
    const check2 = new FormControl();
    const check3 = new FormControl();
    this.checkboxForm = new FormGroup({
      check1,
      check2,
      check3
    });
    this.subscriptions.push(
      check1.valueChanges.subscribe((checked: boolean) => {
        checked
          ? this.loading1$.next(new Loading())
          : this.loading1$.next(new NotAsked());
      }),
      check2.valueChanges.subscribe((checked: boolean) => {
        checked
          ? this.loading2$.next(new Loading())
          : this.loading2$.next(new NotAsked());
      }),
      check3.valueChanges.subscribe((checked: boolean) => {
        checked
          ? this.loading3$.next(new Loading())
          : this.loading3$.next(new NotAsked());
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
