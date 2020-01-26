import { NgModule } from '@angular/core';
import {
  IsNotAskedPipe,
  IsInProgressPipe,
  IsFailurePipe,
  IsSuccessPipe,
  HasValuePipe,
  GetSuccessPipe,
  GetFailurePipe,
  GetInProgressPipe,
  GetSuccessOrInProgressValuePipe,
  AnyIsInProgressPipe
} from './pipes';

const declarations = [
  IsNotAskedPipe,
  IsInProgressPipe,
  IsFailurePipe,
  IsSuccessPipe,
  HasValuePipe,
  GetSuccessPipe,
  GetFailurePipe,
  GetInProgressPipe,
  GetSuccessOrInProgressValuePipe,
  AnyIsInProgressPipe
];

@NgModule({
  declarations,
  imports: [],
  exports: declarations
})
export class RemoteDataModule {}
