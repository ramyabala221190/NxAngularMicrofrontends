import { loadRemote } from '@module-federation/enhanced/runtime';
import { Route } from '@angular/router';
import {authGuard}  from '@my-shopping-app/shared-services';

export const appRoutes: Route[] = [
  // {
  //   path: 'home',
  //   component: Home,
  //   canActivate: [authGuard]
  // },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.Login)
  },
  {
    path: 'carts',
    loadChildren: () =>
      loadRemote<typeof import('carts/Routes')>('carts/Routes').then(
        (m) => m!.remoteRoutes
      ),
    canActivate: [authGuard]
  },
  {
    path: 'products',
    loadChildren: () =>
      loadRemote<typeof import('products/Routes')>('products/Routes').then(
        (m) => m!.remoteRoutes
      ),
    canActivate: [authGuard]
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "products"
  }
];
