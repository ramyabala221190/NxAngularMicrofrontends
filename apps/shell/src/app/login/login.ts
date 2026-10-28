import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, UserService } from '@my-shopping-app/shared-services';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  constructor(private authService: AuthenticationService, private route: Router, private activeRoute: ActivatedRoute,
    private userService: UserService
  ) { }

  loginForm = new FormGroup({
    email: new FormControl("emily.johnson@x.dummyjson.com", [Validators.required, Validators.email]),
    password: new FormControl("emilyspass", [Validators.required])
  })

  login() {
    if (this.loginForm.valid) {
      this.userService.login({ email: this.loginForm.get('email')?.value || "", password: this.loginForm.get('password')?.value || "" }).pipe(
        tap(() => {
          this.authService.updateAuthenticatedState(true);
          const redirectUrl: string | null = this.activeRoute.snapshot.queryParamMap.get('returnUrl');
          if (redirectUrl) this.route.navigate([redirectUrl]); else this.route.navigate(['products']);
        }),
        catchError((err)=>{
          console.log(err);
          return EMPTY;
        })
      ).subscribe();

    }

  }

}
