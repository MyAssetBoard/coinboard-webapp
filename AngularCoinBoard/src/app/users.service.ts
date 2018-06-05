import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

export interface User {
        username: string;
        password: string;
        useremail: string;
}

@Injectable({
        providedIn: 'root'
})

export class UsersService {

        constructor(private http: HttpClient) { }

        getUsers(): Observable<User> {
                return this.http.get<User[]>('https://localhost:3000/api/users');
        }

        getAUth(username: string, password: string): Observable<User> {
                return this.http.get<User>('https://localhost:3000/api/user');
        }
}
