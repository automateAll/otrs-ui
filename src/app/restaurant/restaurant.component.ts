import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { RestService } from '../rest.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FormsModule } from '@angular/forms'; // required for ngModel
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule, RouterModule,BsDatepickerModule,TimepickerModule,FormsModule,FontAwesomeModule],
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})

export class RestaurantComponent implements OnInit {
  faCalendar = faCalendar;
  datepickerModel: Date | undefined;
  bookingDate: Date = new Date();
  tm: Date;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  id$: any;
  restaurant$: any = [];
  bookingInfo: any;
  bookingResponse: any = [];



  constructor(private router: Router, private route: ActivatedRoute,
    private restService: RestService) {
    this.route.params.subscribe(params => this.id$ = params['id']);
    this.route.params.subscribe(params => this.bookingInfo = params['bookingInfo']);
    // if (!this.bookingInfo) {
    //   this.bookingInfo.restaurant = this.restaurant$;
    //   this.bookingInfo.date = this.bookingDate;
    //   this.bookingInfo.time = this.tm;
    // }
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.maxDate.setDate(this.maxDate.getDate() + 180);
    this.bookingDate.setDate(this.bookingDate.getDate() + 1);
    this.tm = this.bookingDate;
    this.tm.setHours(13, 0);
    this.bookingInfo = {
      id: '',
      restaurantId: '',
      restaurant: this.restaurant$,
      userId: '',
      name: '',
      date: this.bookingDate,
      time: this.tm
    };
  }

  ngOnInit() {
    this.getRestaurant(this.id$);
  }

  getRestaurant(id: string) {
    this.restService.getRestaurant(id).subscribe(
      data => { this.restaurant$ = data; console.log(this.restaurant$); }
    )
  }

  book() {
    this.bookingInfo.id = crypto.randomUUID();
    this.bookingInfo.restaurantId = this.restaurant$.id;
    this.bookingInfo.userId = "test";//this.restService.currentUser;
    this.bookingInfo.name = "Roger";
    this.bookingInfo.date = this.bookingDate.toISOString().split('T')[0];
    this.bookingInfo.time = this.tm.toTimeString().split(' ')[0];
    console.log('reserving table...');
    console.log('Payload being sent:', this.bookingInfo);
    this.restService.performBooking(this.bookingInfo).subscribe(
      data => {
        this.bookingResponse = data; console.log('data' + JSON.stringify(data));
        console.log("Booking confirmed with id --> " + this.bookingResponse.id);
      }
    )
    alert("Booking Confirmed!!!\nRedirecting back to home page.");
    this.router.navigate(['/']);
  }

}
