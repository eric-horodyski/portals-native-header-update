import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, BehaviorSubject } from 'rxjs';
import User from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private endpoint = 'https://randomuser.me/api/?results=20';
  private users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  readonly users$: Observable<User[]> = this.users.asObservable();

  constructor(private http: HttpClient) {}

  loadUsers(): Observable<void> {
    return this.http.get<{ results: User[] }>(this.endpoint).pipe(
      map((res) => res.results),
      map((results) => results.map((user) => this.toUser(user))),
      map((users) => this.users.next(users))
    );
  }

  getUserByUuid(uuid: string): User | undefined {
    return this.users.getValue().find((user) => user.uuid === uuid);
  }

  private toUser(user: any): User {
    const {
      name: { first, last },
    } = user;
    const {
      location: { city, state, country },
    } = user;
    const {
      picture: { thumbnail, small, large },
    } = user;
    const {
      login: { uuid },
    } = user;
    return {
      name: { first, last },
      location: { city, state, country },
      picture: { thumbnail, small, large },
      uuid,
    };
  }
}
