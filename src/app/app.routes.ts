import { Routes } from '@angular/router';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: RestaurantsComponent }, // Home page
    { path: 'login', component: LoginComponent },  // Login page
    {
        path: 'restaurants/:id',
        component: RestaurantComponent,
        canActivate: [AuthGuard],
        data: { prerender: false  }  // 👈 This disables prerendering
  },
    { path: '**', redirectTo: '' },  // Login page
];
