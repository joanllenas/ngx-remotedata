import { NgModule } from '@angular/core';
import {
  IsNotAskedPipe,
  IsInProgressPipe,
  IsFailurePipe,
  IsSuccessPipe,
  GetSuccessPipe,
  GetFailurePipe,
  GetInProgressPipe,
  AnyIsInProgressPipe
} from './pipes';

const declarations = [
  IsNotAskedPipe,
  IsInProgressPipe,
  IsFailurePipe,
  IsSuccessPipe,
  GetSuccessPipe,
  GetFailurePipe,
  GetInProgressPipe,
  AnyIsInProgressPipe
];

@NgModule({
  declarations,
  imports: [],
  exports: declarations
})
export class RemoteDataModule {}
