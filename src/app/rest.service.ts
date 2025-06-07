import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private RESTAURANT_BASE_URL = 'http://localhost:8765/restaurantapi/v1';
  private BOOKING_BASE_URL = 'http://localhost:8765/bookingapi/v1';
  private USER_BASE_URL = 'http://localhost:8765/userapi/v1';
  private AUTH_BASE_URL = 'http://localhost:8765/authapi/';
  private AI_BASE_URL = 'http://localhost:8765/userapi/v1';
  // private loggedIn = new BehaviorSubject<boolean>(false);
  currentUser: any = null;// = new BehaviorSubject<any>({});
  private mockdata: any = [];

  constructor(private http: HttpClient, private router: Router) {
    this.mockdata.push(
      {
        id: "1",
        name: 'Le Meurice',
        address: '228 rue de Rivoli, 75001, Paris'
      });
    this.mockdata.push(
      {
        id: "2",
        name: 'L\'Ambroisie',
        address: '9 place des Vosges, 75004, Paris'
      });
    this.mockdata.push(
      {
        id: "3",
        name: 'Arpège',
        address: '84, rue de Varenne, 75007, Paris'
      });
    this.mockdata.push(
      {
        id: "4",
        name: 'Alain Ducasse au Plaza Athénée',
        address: '25 avenue de Montaigne, 75008, Paris'
      });
    this.mockdata.push(
      {
        id: "5",
        name: 'Pavillon LeDoyen',
        address: '1, avenue Dutuit, 75008, Paris'
      });
    this.mockdata.push(
      {
        id: "6",
        name: 'Pierre Gagnaire',
        address: '6, rue Balzac, 75008, Paris'
      });
    this.mockdata.push(
      {
        id: "7",
        name: 'L\'Astrance',
        address: '4, rue Beethoven, 75016, Paris'
      });
    this.mockdata.push(
      {
        id: "8",
        name: 'Pré Catelan',
        address: 'Bois de Boulogne, 75016, Paris'
      });
    this.mockdata.push(
      {
        id: "9",
        name: 'Guy Savoy',
        address: '18 rue Troyon, 75017, Paris'
      });
    this.mockdata.push(
      {
        id: "10",
        name: 'Le Bristol',
        address: '112, rue du Faubourg St Honoré, 8th arrondissement, Paris'
      });

    const currUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currUser) {
      this.currentUser = currUser;
    }
  }

  getRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.RESTAURANT_BASE_URL}/restaurants/`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Using mock data for fetching restaurants');
        return of(this.mockdata);
      })
    );
  }

  getRestaurant(id: string): Observable<any> {
    let mock = this.mockdata.filter((o: { id: string; }) => o.id === id);
    return this.http
      .get(this.RESTAURANT_BASE_URL + '/restaurants/' + id) // 'https://jsonplaceholder.typicode.com/users'
      .pipe(catchError(
        (error: HttpErrorResponse) => {
          console.log('Using mock data for fetching a restaurant by id');
          return of(mock);
        }
      ));
  }

  searchRestaurants(name: string): Observable<any[]> {
  console.log('Calling backend with name:', name);

  return this.http.get<any[]>(`${this.RESTAURANT_BASE_URL}/restaurants?name=${name}`).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Backend call failed! Using mock data instead.', error);
      const mock = this.mockdata.filter((o: { name: string; }) =>
        o.name.toLowerCase().startsWith(name.toLowerCase())
      );
      return of(mock);
    })
  );
}

  performBooking(bookingData: any): Observable<any> {
    console.log(JSON.stringify(bookingData));
    return this.http.post(`${this.BOOKING_BASE_URL}/booking/`, bookingData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Using mock data for booking');
        return of({
          data: { id: '999' },
          status: 'success',
          statusCode: 201
        });
      })
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.AUTH_BASE_URL}/user`, { username, password }).pipe(
      map((user: { token: any; }) => {
        if (user && user.token) {
          this.currentUser = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Using mock data for login');
        this.currentUser = {
          id: '99',
          name: 'Roger',
          token: 'mock-token'
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return of(this.currentUser);
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.router.navigate(['/']);
  }

  // Workaround to update current user on navbar. Required only for mock currentUser update in error handling block
  updateCurrentUser(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  }
}
