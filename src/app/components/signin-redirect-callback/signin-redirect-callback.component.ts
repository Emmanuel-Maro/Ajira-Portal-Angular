/*
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-signin-callback',
  template: `<div></div>`
})

export class SigninRedirectCallbackComponent implements OnInit {
  constructor(private _authService: AuthService,
              private _router: Router) { }

  ngOnInit() {  console.log('test')
    this._authService.completeLogin().then(user => { console.log('kakaka')
      this._router.navigate(['/'], { replaceUrl: true });
    })
  }
}

*/