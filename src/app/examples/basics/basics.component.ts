import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  RemoteData,
  notAsked,
  inProgress,
  success,
  failure
} from 'ngx-remotedata';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-basics',
  templateUrl: './basics.html'
})
export class BasicsComponent implements OnDestroy {
  subscriptions: Subscription[] = [];

  testData$: BehaviorSubject<RemoteData<string>>;
  radiogroupForm: FormGroup;

  inProgress1$: BehaviorSubject<RemoteData<string>>;
  inProgress2$: BehaviorSubject<RemoteData<string>>;
  inProgress3$: BehaviorSubject<RemoteData<string>>;
  checkboxForm: FormGroup;

  constructor() {
    // Single observable source example
    const map: Record<string, RemoteData<string>> = {
      notAsked: notAsked(),
      inProgress: inProgress(),
      success: success('Ok!'),
      failure: failure('Ouch!')
    };
    this.testData$ = new BehaviorSubject(notAsked());
    const testDataRadioGroup = new FormControl();
    this.radiogroupForm = new FormGroup({
      testDataRadioGroup
    });
    this.subscriptions.push(
      testDataRadioGroup.valueChanges.subscribe(data => {
        this.testData$.next(map[data]);
      })
    );

    // Multiple observable sources example
    this.inProgress1$ = new BehaviorSubject(notAsked());
    this.inProgress2$ = new BehaviorSubject(notAsked());
    this.inProgress3$ = new BehaviorSubject(notAsked());
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
          ? this.inProgress1$.next(inProgress())
          : this.inProgress1$.next(notAsked());
      }),
      check2.valueChanges.subscribe((checked: boolean) => {
        checked
          ? this.inProgress2$.next(inProgress())
          : this.inProgress2$.next(notAsked());
      }),
      check3.valueChanges.subscribe((checked: boolean) => {
        checked
          ? this.inProgress3$.next(inProgress())
          : this.inProgress3$.next(notAsked());
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
