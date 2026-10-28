import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService, CartState, ModifiedCart, UserService } from '@my-shopping-app/shared-services';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [RouterLinkActive,RouterLink,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private authService:AuthenticationService=inject(AuthenticationService);
  private userService:UserService=inject(UserService);
  private cartStateService:CartState=inject(CartState);

  isAuthenticated=toSignal(this.authService.retreiveAuthenticatedState(),{initialValue:false});
  user=toSignal(this.userService.getUser(),{initialValue:null});
  cartDetail:Signal<ModifiedCart>=toSignal(this.cartStateService.getCart(),{initialValue:{userId:0,products:[],subtotal:0,discount:0}})

  logout(){
    this.userService.setUser(null)
    this.authService.updateAuthenticatedState(false);
  }


}
