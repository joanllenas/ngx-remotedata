import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RemoteDataModule } from '../../projects/lib/src/lib/lib.module';
import { MeowService } from './services/meow.service';
import { REDUCER_TOKEN, getReducers } from './examples/ngrx/store/reducers';
import { NgrxComponent } from './examples/ngrx/ngrx.component';
import { PosComponent } from './examples/pos/pos.component';
import { PosService } from './examples/pos/pos.service';
import { MeowEffects } from './examples/ngrx/store/effects';
import { BasicsComponent } from './examples/basics/basics.component';
import {
  NotAsked,
  InProgress,
  Failure,
  Success,
  RemoteDataTags,
  RemoteData
} from '../../projects/lib/src/lib/remote-data';
import { localStorageSync } from './examples/ngrx/store/local-store-sync';

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({
    rehydrate: true,
    storageKey: 'myAppStorage',
    keys: {
      meow: {
        serialize: (rd: RemoteData<any>) => rd,
        deserialize: (json: { tag: string; err: any; val: any }) => {
          const rd = [
            {
              matcher: (tag: string) => tag === RemoteDataTags.NotAsked,
              mapper: () => NotAsked.of()
            },
            {
              matcher: (tag: string) => tag === RemoteDataTags.InProgress,
              mapper: () => InProgress.of(json.val)
            },
            {
              matcher: (tag: string) => tag === RemoteDataTags.Failure,
              mapper: () => Failure.of(json.err, json.val)
            },
            {
              matcher: (tag: string) => tag === RemoteDataTags.Success,
              mapper: () => Success.of(json.val)
            }
          ]
            .filter(matchMap => matchMap.matcher(json.tag))
            .map(matchMap => matchMap.mapper())
            .pop();
          return rd || NotAsked.of();
        }
      }
    }
  })(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [AppComponent, PosComponent, NgrxComponent, BasicsComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RemoteDataModule,
    StoreModule.forRoot(REDUCER_TOKEN, {
      metaReducers
    }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([MeowEffects])
  ],
  providers: [
    MeowService,
    PosService,
    { provide: REDUCER_TOKEN, useFactory: getReducers }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
