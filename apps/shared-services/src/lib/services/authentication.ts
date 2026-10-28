import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn:'root'})
export class AuthenticationService {

    constructor(private router:Router) {}

    private authSub$=new BehaviorSubject<boolean>(false);

    updateAuthenticatedState(state:boolean){
        if(!state){
           this.router.navigate(['login']);
        }
        this.authSub$.next(state);
    }

    retreiveAuthenticatedState(){
        return this.authSub$.asObservable()
    }
}
