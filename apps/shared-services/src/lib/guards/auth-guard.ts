import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService=inject(AuthenticationService);
  const router=inject(Router);
  return authService.retreiveAuthenticatedState().pipe(
    map((status:boolean)=>{
      if(!status){
         return router.createUrlTree(['login'],{queryParams:{returnUrl:state.url},queryParamsHandling: 'merge'}) //this ensures you are redirected back to the same page prior to login
      }
      return status;
    })
  )

  
};
