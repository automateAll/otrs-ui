import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { RouterModule, ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})

export class RestaurantsComponent implements OnInit{

  searchValue: string = '';
  restaurants$: any = [];

  constructor(
    private restService: RestService
    ,private router: Router
    ,private route: ActivatedRoute) { }
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
    const name: string = params['name'] ?? '';
    if (name) {
      this.searchValue = name;
      this.restService.searchRestaurants(name).subscribe(
        data => this.restaurants$ = data
      );
    }
  });
  }

   getRestaurants() {
    this.restService.getRestaurants().subscribe(
      data => this.restaurants$ = data
    )
  }

  searchRestaurants(value: string) {
    this.searchValue = value;

    this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { name: value },
    queryParamsHandling: 'merge'
  });

    this.restService.searchRestaurants(value).subscribe(
      data => this.restaurants$ = data
    )
  }
}
