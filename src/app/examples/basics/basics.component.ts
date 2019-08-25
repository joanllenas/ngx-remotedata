import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  RemoteData,
  NotAsked,
  InProgress,
  Success,
  Failure
} from '../../../../projects/lib/src/public_api';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'basics',
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
    const map: { [key: string]: RemoteData<string> } = {
      notAsked: NotAsked.of(),
      inProgress: InProgress.of(''),
      success: Success.of('Ok ' + Math.round(1000 * Math.random()).toString()),
      failure: Failure.of('Ouch!')
    };
    this.testData$ = new BehaviorSubject(NotAsked.of());
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
    this.inProgress1$ = new BehaviorSubject(NotAsked.of());
    this.inProgress2$ = new BehaviorSubject(NotAsked.of());
    this.inProgress3$ = new BehaviorSubject(NotAsked.of());
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
          ? this.inProgress1$.next(InProgress.of(''))
          : this.inProgress1$.next(NotAsked.of());
      }),
      check2.valueChanges.subscribe((checked: boolean) => {
        checked
          ? this.inProgress2$.next(InProgress.of(''))
          : this.inProgress2$.next(NotAsked.of());
      }),
      check3.valueChanges.subscribe((checked: boolean) => {
        checked
          ? this.inProgress3$.next(InProgress.of(''))
          : this.inProgress3$.next(NotAsked.of());
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
