import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {path: '', loadChildren: () => import('../app/remote-entry/entry.routes').then(m => m.remoteRoutes)},];
