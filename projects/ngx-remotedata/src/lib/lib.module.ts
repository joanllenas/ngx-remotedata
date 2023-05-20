import { NgModule } from '@angular/core';
import {
  IsNotAskedPipe,
  IsInProgressPipe,
  IsFailurePipe,
  IsSuccessPipe,
  GetSuccessPipe,
  GetFailureErrorPipe,
  AnyIsInProgressPipe,
  AnyIsNotAskedPipe,
} from './pipes';

const declarations = [
  IsNotAskedPipe,
  IsInProgressPipe,
  IsFailurePipe,
  IsSuccessPipe,
  GetSuccessPipe,
  GetFailureErrorPipe,
  AnyIsInProgressPipe,
  AnyIsNotAskedPipe,
];

@NgModule({
  declarations,
  imports: [],
  exports: declarations,
})
export class RemoteDataModule {}
