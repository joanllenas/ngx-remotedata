import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';

export interface CatImage {
  file: string;
}

@Injectable()
export class MeowService {
  constructor(private http: HttpClient) {}

  meow() {
    return this.http
      .get<CatImage>('https://aws.random.cat/meow')
      .pipe(delay(1000 + Math.random() * 4000));
  }
}
