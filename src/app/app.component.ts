import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RestService } from './rest.service';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule,CollapseModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed: boolean = false;
  title = 'otrs-ui';

  constructor(protected rest: RestService) {}
}
