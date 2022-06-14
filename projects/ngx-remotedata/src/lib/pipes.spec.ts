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
  failure,
  inProgress,
  notAsked,
  RemoteData,
  success
} from './remote-data';

describe('pipes', () => {
  describe('Boolean Pipes', () => {
    ([
      {
        PipeClass: IsNotAskedPipe,
        pipeForTrue: notAsked(),
        pipeForFalse: inProgress(null)
      },
      {
        PipeClass: IsInProgressPipe,
        pipeForTrue: inProgress(null),
        pipeForFalse: notAsked()
      },
      {
        PipeClass: IsFailurePipe,
        pipeForTrue: failure('Ouch', ''),
        pipeForFalse: inProgress(null)
      },
      {
        PipeClass: IsSuccessPipe,
        pipeForTrue: success('ok'),
        pipeForFalse: failure('grrrr', '')
      },
      {
        PipeClass: HasValuePipe,
        pipeForTrue: success('ok'),
        pipeForFalse: failure('grrrr')
      },
      {
        PipeClass: HasValuePipe,
        pipeForTrue: failure('failed', 'value'),
        pipeForFalse: failure(false, null)
      },
      {
        PipeClass: HasValuePipe,
        pipeForTrue: inProgress('ok'),
        pipeForFalse: inProgress(null)
      },
      {
        PipeClass: HasValuePipe,
        pipeForTrue: inProgress('ok'),
        pipeForFalse: inProgress(undefined)
      },
      {
        PipeClass: HasValuePipe,
        pipeForTrue: inProgress(false),
        pipeForFalse: notAsked()
      }
    ] as {
      PipeClass: new () => PipeTransform;
      pipeForTrue: RemoteData<any, any>;
      pipeForFalse: RemoteData<any, any>;
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
        rd: inProgress(false),
        value: false,
        hasValue: true
      },
      {
        PipeClass: GetRemoteDataValuePipe,
        HasValuePipeClass: HasValuePipe,
        rd: inProgress(),
        value: undefined,
        hasValue: false
      },
      {
        PipeClass: GetRemoteDataValuePipe,
        HasValuePipeClass: HasValuePipe,
        rd: success('value'),
        value: 'value',
        hasValue: true
      },
      {
        PipeClass: GetRemoteDataValuePipe,
        HasValuePipeClass: HasValuePipe,
        rd: failure('error', 'value'),
        value: 'value',
        hasValue: true
      },
      {
        PipeClass: GetRemoteDataValuePipe,
        HasValuePipeClass: HasValuePipe,
        rd: failure('error'),
        value: undefined,
        hasValue: false
      }
    ] as {
      PipeClass: new () => PipeTransform;
      HasValuePipeClass: new () => PipeTransform;
      rd: RemoteData<any, any>;
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
          of(notAsked()),
          of(inProgress())
        ])
      ).toBe(true);
    });
    it('should return false when none is InProgress', () => {
      expect(
        new AnyIsInProgressPipe(cd).transform([
          of(notAsked()),
          of(failure('grr'))
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
          of(notAsked()),
          of(failure('grr'))
        ])
      ).toBe(true);
    });
    it('should return false when none is NotAsked', () => {
      expect(
        new AnyIsNotAskedPipe(cd).transform([
          of(success('ok')),
          of(failure('grr'))
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
      expect(new GetSuccessPipe().transform(success('hola'))).toBe('hola');
    });
    it(`should throw when it's not a Remotedata`, () => {
      expect(() => new GetSuccessPipe().transform(true as any)).toThrow();
    });
    it(`should return the default value when it's not a Success`, () => {
      const expected = new GetSuccessPipe().transform(
        failure('ouch!'),
        'adios'
      );
      expect(expected).toBe('adios');
    });
    it(`should return the default value when it's a null or undefined`, () => {
      expect(new GetSuccessPipe().transform(undefined, 'adios')).toBe('adios');
      expect(new GetSuccessPipe().transform(null, 'adios')).toBe('adios');
    });
  });

  describe('GetInProgressPipe', () => {
    it(`should return the value when it's an InProgress`, () => {
      expect(new GetInProgressPipe().transform(inProgress('hola'))).toBe(
        'hola'
      );
    });
    it(`should throw when it's not a Remotedata`, () => {
      expect(() => new GetInProgressPipe().transform(true as any)).toThrow();
    });
    it(`should return the default value when it's not an InProgress`, () => {
      const pipe = new GetInProgressPipe();
      const expected = pipe.transform(failure('ouch!'), 'adios');
      expect(expected).toBe('adios');
    });
    it(`should return the default value when it's a null or undefined`, () => {
      expect(new GetInProgressPipe().transform(undefined, 'adios')).toBe(
        'adios'
      );
      expect(new GetInProgressPipe().transform(null, 'adios')).toBe('adios');
    });
  });

  describe('GetFailureErrorPipe', () => {
    it(`should return the error when it's a Failure`, () => {
      expect(new GetFailureErrorPipe().transform(failure('hola'))).toBe('hola');
    });
    it(`should throw when it's not a Remotedata`, () => {
      expect(() => new GetFailureErrorPipe().transform(true as any)).toThrow();
    });
    it(`should return undefined when it's not a Failure`, () => {
      expect(new GetFailureErrorPipe().transform(notAsked())).toBe(undefined);
    });
    it(`should return undefined when it's a null or undefined`, () => {
      expect(new GetFailureErrorPipe().transform(undefined)).toBe(undefined);
      expect(new GetFailureErrorPipe().transform(null)).toBe(undefined);
    });
  });

  describe('GetFailureValuePipe', () => {
    it(`should return the error when it's a Failure`, () => {
      expect(new GetFailureValuePipe().transform(failure('err', 'hola'))).toBe(
        'hola'
      );
    });
    it(`should throw when it's not a Remotedata`, () => {
      expect(() => new GetFailureValuePipe().transform(true as any)).toThrow();
    });
    it(`should return undefined when it's not a Failure`, () => {
      expect(new GetFailureValuePipe().transform(notAsked())).toBe(undefined);
    });
    it(`should return undefined when it's a null or undefined`, () => {
      expect(new GetFailureValuePipe().transform(undefined)).toBe(undefined);
      expect(new GetFailureValuePipe().transform(null)).toBe(undefined);
    });
  });
});
