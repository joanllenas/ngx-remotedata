import {
  IsNotAskedPipe,
  IsInProgressPipe,
  IsFailurePipe,
  IsSuccessPipe
} from './pipes';
import { PipeTransform } from '@angular/core';
import {
  NotAsked,
  InProgress,
  Failure,
  Success,
  AnyRemoteData
} from './remote-data';

describe('Pipes', () => {
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
