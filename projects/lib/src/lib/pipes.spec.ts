import {
  IsNotAskedPipe,
  IsInProgressPipe,
  IsFailurePipe,
  IsSuccessPipe,
  HasValuePipe,
  GetSuccessOrInProgressValuePipe
} from './pipes';
import { PipeTransform } from '@angular/core';
import {
  NotAsked,
  InProgress,
  Failure,
  Success,
  AnyRemoteData
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
      rd: Failure.of('Ouch'),
      rdBad: InProgress.of(null)
    },
    {
      PipeClass: IsSuccessPipe,
      rd: Success.of('ok'),
      rdBad: Failure.of('grrrr')
    },
    {
      PipeClass: HasValuePipe,
      rd: Success.of('ok'),
      rdBad: Failure.of('grrrr')
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
  describe('Value Pipes', () => {
    ([
      {
        PipeClass: GetSuccessOrInProgressValuePipe,
        rd: InProgress.of(false),
        value: false
      },
      {
        PipeClass: GetSuccessOrInProgressValuePipe,
        rd: Success.of('tryit'),
        value: 'tryit'
      }
    ] as {
      PipeClass: new () => PipeTransform;
      rd: AnyRemoteData;
      value: any;
    }[]).forEach(({ PipeClass, rd, value }) => {
      const pipeInstance = new PipeClass();
      describe(`${pipeInstance.constructor.name}`, () => {
        it(`should return ${value} when instance is ${rd.constructor.name}`, () => {
          expect(pipeInstance.transform(rd)).toBe(value);
        });
      });
    });
  });
});
