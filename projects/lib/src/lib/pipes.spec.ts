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
  IsSuccessPipe,
  GetSuccessPipe,
  GetInProgressPipe,
  GetFailureErrorPipe,
  GetFailureValuePipe
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
      pipeForTrue: NotAsked.of(),
      pipeForFalse: InProgress.of(null)
    },
    {
      PipeClass: IsInProgressPipe,
      pipeForTrue: InProgress.of(null),
      pipeForFalse: NotAsked.of()
    },
    {
      PipeClass: IsFailurePipe,
      pipeForTrue: Failure.of('Ouch', ''),
      pipeForFalse: InProgress.of(null)
    },
    {
      PipeClass: IsSuccessPipe,
      pipeForTrue: Success.of('ok'),
      pipeForFalse: Failure.of('grrrr', '')
    },
    {
      PipeClass: HasValuePipe,
      pipeForTrue: Success.of('ok'),
      pipeForFalse: Failure.of('grrrr')
    },
    {
      PipeClass: HasValuePipe,
      pipeForTrue: Failure.of('failed', 'value'),
      pipeForFalse: Failure.of(false, null)
    },
    {
      PipeClass: HasValuePipe,
      pipeForTrue: InProgress.of('ok'),
      pipeForFalse: InProgress.of(null)
    },
    {
      PipeClass: HasValuePipe,
      pipeForTrue: InProgress.of('ok'),
      pipeForFalse: InProgress.of(undefined)
    },
    {
      PipeClass: HasValuePipe,
      pipeForTrue: InProgress.of(false),
      pipeForFalse: NotAsked.of()
    }
  ] as {
    PipeClass: new () => PipeTransform;
    pipeForTrue: AnyRemoteData;
    pipeForFalse: AnyRemoteData;
  }[]).forEach(({ PipeClass, pipeForTrue, pipeForFalse }) => {
    const pipeInstance = new PipeClass();
    describe(`${pipeInstance.constructor.name}`, () => {
      it(`should return true when value is ${pipeForTrue.constructor.name}`, () => {
        expect(pipeInstance.transform(pipeForTrue)).toBe(true);
      });
      it(`should return false when value is not ${pipeForTrue.constructor.name}`, () => {
        expect(pipeInstance.transform(pipeForFalse)).toBe(false);
      });
      it(`should return false when value is null or undefined`, () => {
        expect(pipeInstance.transform(undefined)).toBe(false);
        expect(pipeInstance.transform(null)).toBe(false);
      });
      it(`should throw when value is not a RemoteData`, () => {
        expect(() => pipeInstance.transform(new Error('Ouch!'))).toThrow();
      });
    });
  });
});

describe('Value Pipes', () => {
  it(`should return undefined when value is null or undefined`, () => {
    expect(new GetRemoteDataValuePipe().transform(null)).toBe(undefined);
    expect(new GetRemoteDataValuePipe().transform(undefined)).toBe(undefined);
  });

  it(`should throw when value is not a RemoteData`, () => {
    expect(() =>
      new GetRemoteDataValuePipe().transform(new Error('ouch!') as any)
    ).toThrow();
  });

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
  it('should return false value is undefined or null', () => {
    expect(new AnyIsInProgressPipe(cd).transform(undefined)).toBe(false);
    expect(new AnyIsInProgressPipe(cd).transform(null)).toBe(false);
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
  it('should return false value is undefined or null', () => {
    expect(new AnyIsNotAskedPipe(cd).transform(undefined)).toBe(false);
    expect(new AnyIsNotAskedPipe(cd).transform(null)).toBe(false);
  });
});

describe('GetSuccessPipe', () => {
  it(`should return the value when it's a Success`, () => {
    expect(new GetSuccessPipe().transform(Success.of('hola'))).toBe('hola');
  });
  it(`should throw when it's not a Remotedata`, () => {
    expect(() => new GetSuccessPipe().transform(true as any)).toThrow();
  });
  it(`should return the default value when it's not a Success`, () => {
    const failure = Failure.of<string>('ouch!');
    expect(new GetSuccessPipe().transform(failure, 'adios')).toBe('adios');
  });
  it(`should return the default value when it's a null or undefined`, () => {
    expect(new GetSuccessPipe().transform(undefined, 'adios')).toBe('adios');
    expect(new GetSuccessPipe().transform(null, 'adios')).toBe('adios');
  });
});

describe('GetInProgressPipe', () => {
  it(`should return the value when it's an InProgress`, () => {
    expect(new GetInProgressPipe().transform(InProgress.of('hola'))).toBe(
      'hola'
    );
  });
  it(`should throw when it's not a Remotedata`, () => {
    expect(() => new GetInProgressPipe().transform(true as any)).toThrow();
  });
  it(`should return the default value when it's not an InProgress`, () => {
    const failure = Failure.of<string>('ouch!');
    expect(new GetInProgressPipe().transform(failure, 'adios')).toBe('adios');
  });
  it(`should return the default value when it's a null or undefined`, () => {
    expect(new GetInProgressPipe().transform(undefined, 'adios')).toBe('adios');
    expect(new GetInProgressPipe().transform(null, 'adios')).toBe('adios');
  });
});

describe('GetFailureErrorPipe', () => {
  it(`should return the error when it's a Failure`, () => {
    expect(new GetFailureErrorPipe().transform(Failure.of('hola'))).toBe(
      'hola'
    );
  });
  it(`should throw when it's not a Remotedata`, () => {
    expect(() => new GetFailureErrorPipe().transform(true as any)).toThrow();
  });
  it(`should return undefined when it's not a Failure`, () => {
    expect(new GetFailureErrorPipe().transform(NotAsked.of())).toBe(undefined);
  });
  it(`should return undefined when it's a null or undefined`, () => {
    expect(new GetFailureErrorPipe().transform(undefined)).toBe(undefined);
    expect(new GetFailureErrorPipe().transform(null)).toBe(undefined);
  });
});

describe('GetFailureValuePipe', () => {
  it(`should return the error when it's a Failure`, () => {
    const failure = Failure.of('err', 'hola');
    expect(new GetFailureValuePipe().transform(failure)).toBe('hola');
  });
  it(`should throw when it's not a Remotedata`, () => {
    expect(() => new GetFailureValuePipe().transform(true as any)).toThrow();
  });
  it(`should return undefined when it's not a Failure`, () => {
    expect(new GetFailureValuePipe().transform(NotAsked.of())).toBe(undefined);
  });
  it(`should return undefined when it's a null or undefined`, () => {
    expect(new GetFailureValuePipe().transform(undefined)).toBe(undefined);
    expect(new GetFailureValuePipe().transform(null)).toBe(undefined);
  });
});
