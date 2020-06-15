import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private _url = '/assets/data/userData.json';
  constructor(private httpClient: HttpClient) { }

  // tslint:disable-next-line: variable-name
  private _url = 'http://localhost:3000/users';
  getUserss(): Observable<User[]> {
    return this.httpClient.get<User[]>(this._url);
  }

  public createNewSection(body) {
    return this.httpClient.post(this._url, body, {
      observe: 'response'
    });
  }

  public updateUser(usrs: User, id): Observable<any> {
    return this.httpClient.put(this._url + '/' + id, usrs, {
      observe: 'response'
    });
  }

  public deleteTrenchUrl(id: string): Observable<any> {
    return this.httpClient.delete(this._url + '/' + id, {
      observe: 'response'
    });
  }

}
