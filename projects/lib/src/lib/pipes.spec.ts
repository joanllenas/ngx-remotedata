import { ChangeDetectorRef, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import {
  AnyIsInProgressPipe,
  AnyIsNotAskedPipe,
  GetRemoteDataValuePipe,
  HasValuePipe,
  IsFailurePipe,
  IsInProgressPipe,
  IsNotAskedPipe,
  IsSuccessPipe
} from './pipes';
import {
  AnyRemoteData,
  Failure,
  InProgress,
  NotAsked,
  Success
} from './remote-data';

describe('Boolean Pipes', () => {
  ([
    {
      PipeClass: IsNotAskedPipe,
      rd: NotAsked.of(),
      rdBad: InProgress.of(null)
    },
    {
      PipeClass: IsInProgressPipe,
      rd: InProgress.of(null),
      rdBad: NotAsked.of()
    },
    {
      PipeClass: IsFailurePipe,
      rd: Failure.of('Ouch', ''),
      rdBad: InProgress.of(null)
    },
    {
      PipeClass: IsSuccessPipe,
      rd: Success.of('ok'),
      rdBad: Failure.of('grrrr', '')
    },
    {
      PipeClass: HasValuePipe,
      rd: Success.of('ok'),
      rdBad: Failure.of('grrrr')
    },
    {
      PipeClass: HasValuePipe,
      rd: Failure.of('failed', 'value'),
      rdBad: Failure.of(false, null)
    },
    {
      PipeClass: HasValuePipe,
      rd: InProgress.of('ok'),
      rdBad: InProgress.of(null)
    },
    {
      PipeClass: HasValuePipe,
      rd: InProgress.of('ok'),
      rdBad: InProgress.of(undefined)
    },
    {
      PipeClass: HasValuePipe,
      rd: InProgress.of(false),
      rdBad: NotAsked.of()
    }
  ] as {
    PipeClass: new () => PipeTransform;
    rd: AnyRemoteData;
    rdBad: AnyRemoteData;
  }[]).forEach(({ PipeClass, rd, rdBad }) => {
    const pipeInstance = new PipeClass();
    describe(`${pipeInstance.constructor.name}`, () => {
      it(`should return true when value is ${rd.constructor.name}`, () => {
        expect(pipeInstance.transform(rd)).toBe(true);
      });
      it(`should return false when value is not ${rd.constructor.name}`, () => {
        expect(pipeInstance.transform(rdBad)).toBe(false);
      });
      it(`should throw when value is not a RemoteData`, () => {
        expect(() => pipeInstance.transform(new Error('Ouch!'))).toThrow();
      });
    });
  });
});

describe('Value Pipes', () => {
  ([
    {
      PipeClass: GetRemoteDataValuePipe,
      HasValuePipeClass: HasValuePipe,
      rd: InProgress.of(false),
      value: false,
      hasValue: true
    },
    {
      PipeClass: GetRemoteDataValuePipe,
      HasValuePipeClass: HasValuePipe,
      rd: InProgress.of(),
      value: undefined,
      hasValue: false
    },
    {
      PipeClass: GetRemoteDataValuePipe,
      HasValuePipeClass: HasValuePipe,
      rd: Success.of('value'),
      value: 'value',
      hasValue: true
    },
    {
      PipeClass: GetRemoteDataValuePipe,
      HasValuePipeClass: HasValuePipe,
      rd: Failure.of('error', 'value'),
      value: 'value',
      hasValue: true
    },
    {
      PipeClass: GetRemoteDataValuePipe,
      HasValuePipeClass: HasValuePipe,
      rd: Failure.of('error'),
      value: undefined,
      hasValue: false
    }
  ] as {
    PipeClass: new () => PipeTransform;
    HasValuePipeClass: new () => PipeTransform;
    rd: AnyRemoteData;
    value: any;
    hasValue: boolean;
  }[]).forEach(({ PipeClass, HasValuePipeClass, rd, value, hasValue }) => {
    const pipeInstance = new PipeClass();
    const hasValuePipeInstance = new HasValuePipeClass();
    describe(`${pipeInstance.constructor.name}`, () => {
      it(`hasValue should return ${hasValue} when instance is ${rd.constructor.name}`, () => {
        expect(hasValuePipeInstance.transform(rd)).toBe(hasValue);
      });
      it(`should return ${value} when instance is ${rd.constructor.name}`, () => {
        expect(pipeInstance.transform(rd)).toBe(value);
      });
    });
  });
});

// Mock Change Detector
const MyChangeDetector = class extends ChangeDetectorRef {
  markForCheck(): void {}
  detach(): void {}
  detectChanges(): void {}
  checkNoChanges(): void {}
  reattach(): void {}
};

describe('AnyIsInProgressPipe', () => {
  let cd: ChangeDetectorRef;
  beforeEach(() => {
    cd = new MyChangeDetector();
  });
  it('should return true when any is InProgress', () => {
    expect(
      new AnyIsInProgressPipe(cd).transform([
        of(NotAsked.of()),
        of(InProgress.of())
      ])
    ).toBe(true);
  });
  it('should return false when none is InProgress', () => {
    expect(
      new AnyIsInProgressPipe(cd).transform([
        of(NotAsked.of()),
        of(Failure.of('grr'))
      ])
    ).toBe(false);
  });
});

describe('AnyIsNotAskedPipe', () => {
  let cd: ChangeDetectorRef;
  beforeEach(() => {
    cd = new MyChangeDetector();
  });
  it('should return true when any is NotAsked', () => {
    expect(
      new AnyIsNotAskedPipe(cd).transform([
        of(NotAsked.of()),
        of(Failure.of('grr'))
      ])
    ).toBe(true);
  });
  it('should return false when none is NotAsked', () => {
    expect(
      new AnyIsNotAskedPipe(cd).transform([
        of(Success.of('ok')),
        of(Failure.of('grr'))
      ])
    ).toBe(false);
  });
});
