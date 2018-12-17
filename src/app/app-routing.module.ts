import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgrxComponent } from './examples/ngrx/ngrx.component';
import { PosComponent } from './examples/pos/pos.component';
import { BasicsComponent } from './examples/basics/basics.component';

const routes: Routes = [
  { path: '', redirectTo: 'basics', pathMatch: 'full' },
  { path: 'basics', component: BasicsComponent },
  { path: 'pos', component: PosComponent },
  { path: 'ngrx', component: NgrxComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
