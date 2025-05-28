import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RestService } from '../rest.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rest: RestService) { }

  ngOnInit() {
    if (this.rest.currentUser) {
      this.router.navigate(['/']);
    }
    
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

 get f() {
  return this.loginForm ? this.loginForm.controls : {};
}

  onSubmit() {
    this.submitted = true;

    if (this.loginForm!.invalid) {
      return;
    }

    this.loading = true;
    this.rest.login(this.f['username'].value, this.f['password'].value)
      .pipe(first())
      .subscribe(
        data => {
          this.rest.updateCurrentUser();
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.loading = false;
        });
  }
}
