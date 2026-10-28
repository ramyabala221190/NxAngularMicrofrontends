# Getting started

1. Initialise new workspace
npx create-nx-workspace@latest my-shopping-app --preset=apps

cd my-shopping-app

2. Ensure your workspace has the @nx/angular plugin installed:   

npx nx add @nx/angular

3. This command scaffolds a shell application inside the apps/ directory configured as a Module Federation Host, along with products, carts remote apps, automatically wiring up the routing and configuration files (module-federation.config.ts).

npx nx g @nx/angular:host apps/shell --remotes=products,carts

Ensure you select Eslint when it prompts you to. This is very imp to set the boundaries.

4. npm install -D @swc/core @swc-node/register
Gives Nx the exact ultra-fast Rust compiler it is asking for 


# Restricting sharing and import scope using tags in the project.json

apps/shell/project.json ➡️ Add "tags": ["scope:host"]
apps/products/project.json ➡️ Add "tags": ["scope:mfe"]
apps/carts/project.json ➡️ Add "tags": ["scope:mfe"]

Giving both microfrontends the exact same tag (scope:mfe) is a deliberate design choice that simplifies your configuration. It treats them as members of the same architectural "class" or role, which allows you to write one rule that protects all of them at once.Here is why this approach works beautifully for production apps:1. The Rule Block is Self-IsolatingWhen you tell Nx that a project with scope:mfe can only depend on libraries tagged with scope:shared, you are implicitly creating a barrier between the microfrontends themselves.Because mfe1 has the tag scope:mfe, and the rule says it can only look at scope:shared, mfe1 is completely blocked from importing anything from mfe2 (since mfe2 is tagged as scope:mfe, not scope:shared).

Open your root eslint.config.mjs file in the root of the project, look for the @nx/enforce-module-boundaries rule block, 
and update the depConstraints field as below.

"@nx/enforce-module-boundaries": [
  "error",
  {
    "depConstraints": [
      {
        "sourceTag": "scope:host",
        "onlyDependOnLibsWithTags": ["scope:mfe", "scope:shared"]
      },
      {
        "sourceTag": "scope:mfe",
        "onlyDependOnLibsWithTags": ["scope:shared"] // ❌ Cannot depend on other 'scope:mfe'
      }
    ]
  }
]

To keep your architectural boundaries perfect, code dependencies should only move downwards or sideways through designated channels, never backwards:
scope:host ➡️ can depend on ➡️ scope:mfe (To handle top-level routing configurations and orchestration).
scope:host ➡️ can depend on ➡️ scope:shared (To read user context, global states, or auth details).
scope:mfe ❌ CANNOT depend on ❌ scope:host (A microfrontend should be a standalone engine; it should never look up into 
its parent orchestrator).
scope:mfe ❌ CANNOT depend on ❌ other scope:mfe (Complete isolation between parallel features).
scope:mfe 

# Handling CORS errors

```
Access to script at 'http://localhost:4201/remoteEntry.mjs' from origin 'http://localhost:4200' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
runtime.js:1  GET http://localhost:4201/remoteEntry.mjs net::ERR_FAILED 200 (OK)
(index):1 Access to script at 'http://localhost:4202/remoteEntry.mjs' from origin 'http://localhost:4200' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
runtime.js:2  GET http://localhost:4202/remoteEntry.mjs net::ERR_FAILED 200 (OK)
```

To avoid these errors when app loads in the browser, we need to add CORS headers in each of the mfe apps.

Go to the project.json serve section and under the options,add the below "headers" field to allow
the shell app to access the mfe apps.

```
 "headers": {
          "Access-Control-Allow-Origin": "http://localhost:4200",
          "Access-Control-Allow-Methods": "GET"
        }
```

# Making the mfe accessible to the shell

Once you have resolved the CORS errors, next you might get an error as below, when you try to load
the mfe from the shell app via router.

```
_pending_tasks-chunk.mjs:2695 ERROR Error: Cannot find module '1713'
while loading "./Routes" from 1713

```

In the public folder the shell app, create a module-federation.manifest.json file. This file
can have any name. But ensure that the names of the files in the below json is always
mf-manifest.json.

```
{
    "products":"http://localhost:4201/mf-manifest.json",
    "carts":"http://localhost:4202/mf-manifest.json"
}
```
Update main.ts of the shell app as below

```
import { registerRemotes } from '@module-federation/enhanced/runtime';

fetch('/module-federation.manifest.json')
  .then((res) => res.json())
  .then((remotes: Record<string, string>) =>
    Object.entries(remotes).map(([name, entry]) => ({ name, entry }))
  )
  .then((remotes) => registerRemotes(remotes))
  .then(() => import('./bootstrap').catch((err) => console.error(err)));


```

At the moment, webpack is statically building our application, telling it at build time where our Remotes are. That is because they are specified in the module-federation.config.ts file.

Open the module-federation.config.ts file in the shell app and set the remotes property to be an empty array. It should change from

`remotes: ['products','carts',]`

to

`remotes: []`

Next, we need to change how our application attempts to load the Remote when it is routed to. Open the app.routes.ts file in the shell app and apply the following changes:

```
 import { loadRemote } from '@module-federation/enhanced/runtime';
import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
    path: 'carts',
    loadChildren: () =>
      loadRemote<typeof import('carts/Routes')>('carts/Routes').then(
        (m) => m!.remoteRoutes
      ),
    },
    {
    path: 'products',
    loadChildren: () =>
      loadRemote<typeof import('products/Routes')>('products/Routes').then(
        (m) => m!.remoteRoutes
      ),
    },
    {
      path: '',
      component: NxWelcome
    },];


```

# Next lets install bootstrap and jquery

Installed both the usual way and updated the project.json of all 3 apps to add the additional
scripts and styles.

# Adding new components/services in the shell app.

npx nx g @nx/angular:component  apps/shell/src/app/header/header

npx nx g @nx/angular:component  apps/shell/src/app/login/login




# Adding library for shared styles

npx nx g @nx/angular:library apps/shared-styles --publishable=false

npx nx g @nx/angular:component apps/shared-styles/src/lib/shared-components/quantity/quantity

npx nx g @nx/angular:component apps/shared-styles/src/lib/shared-components/accordion/accordion

Ensure in the project.json, you update the tags to ["scope:shared"]

I have added some css in the shared-styles.css and going to import it in the
styles.scss of the shell app as below. This way, it will be accessible to all MFE's as well.

```
/* You can add global styles to this file, and also import other style files */
@import '../../shared-styles/src/lib/shared-styles/shared-styles.css';
```

# Adding library for shared services

npx nx g @nx/angular:library apps/shared-services --publishable=false

Ensure in the project.json, you update the tags to ["scope:shared"]

npx nx g @nx/angular:service services/authentication --project=shared-services

npx nx g @nx/angular:guard guards/auth --project=shared-services

npx nx g @nx/angular:service services/cart-state --project=shared-services

npx nx g @nx/angular:service services/product-state --project=shared-services

npx nx g @nx/angular:service services/user --project=shared-services

# Importing from shared lib

In the tsconfig.base.json, the below paths are v imp
Apart from the css, the shared services are accessed via "@my-shopping-app/shared-services"
in all 3 apps: shell,products and carts.
css is accessed in styles.scss via the full path.

```
"paths": {
      "products/Routes": [
        "./apps/products/src/app/remote-entry/entry.routes.ts"
      ],
      "carts/Routes": [
        "./apps/carts/src/app/remote-entry/entry.routes.ts"
      ],
      "@my-shopping-app/shared-styles": [
        "./apps/shared-styles/src/index.ts"
      ],
      "@my-shopping-app/shared-services": [
        "./apps/shared-services/src/index.ts"
      ]
    }
```

# Adding components/services in mfe

npx nx g @nx/angular:service services/product --project=products

npx nx g @nx/angular:pipe apps/products/src/app/pipes/rating-progress


npx nx g @nx/angular:component apps/products/src/app/product-list/productList


npx nx g @nx/angular:component apps/carts/src/app/cart-detail/cart-detail

# Updating version in all shared libraries i.e shared-styles and shared-services.

Add a package.json file inside the shared-styles and shared-services. There will be no package.json.
You need to manually add it. There will only be a project.json when the lib gets generated.

Ensure you have added a field "version" and set it to an initial value "1.0.0" in the package.json
of the shared libs: shared-styles and shared-services.
```
{
  "name": "@my-shopping-app/shared-styles",
  "version": "1.0.0"
}
```

This is required to ensure that the shell app and the 2 mfe's share the same version of the shared libs.

I have added a federation-shared.ts file in the shell,products and carts mfe.
In this file, we are making a list of the libs or packages, which we are explicitly sharing.
Note: angular npm packages are shared by default, so you need not bother about it.
We are importing the federation-shared.ts in  webpack.prod.config.ts within the shared field for each
of the apps- shell, products and carts.

#  Module federation manifest for different environments.

When developing/testing locally, I want the shell app running on localhost:4200 to connect to carts mfe
running on localhost:4202 and products mfe running on localhost:4201.

Hence the manifest file in the public folder of the shell app will be 

```
{
    "products":"http://localhost:4201/mf-manifest.json",
    "carts":"http://localhost:4202/mf-manifest.json"
}
```
Also recall that i had to add the below headers in the project.json of the carts and products mfe to
prevent CORS errors from these mfe's when shell tried to connect to them.

```
 "headers": {
          "Access-Control-Allow-Origin": "http://localhost:4200",
          "Access-Control-Allow-Methods": "GET"
        }
```
Keeping both these points in mind, we have designed the below flow once the apps are deployed.

User ---> Master Nginx proxy server ---> Shell app(/), Carts mfe(/carts) and Products MFE(/products)

The user will always hit the master nginx server running on some port, here i have set it as 8086.
User cannot access the shell or the 2 mfe's directly. This is because we have not exposed the ports in 
the compose file. The shell and the 2 mfe's will be accessible only within the docker network.

The shell app will not directly access the 2 mfe's. Any call made from the shell app will first
go to the master nginx, which will proxy the request to the correct mfe. This way we have avoided
CORS errors post deployment to higher environments without adding any headers.

Also note that the shell app and the 2 mfe's are also getting served by a nginx server in seperate
docker containers. So the master-nginx, shell and the 2 mfe's have their own docker containers running
the nginx server. Just the purpose is different. In case of master-nginx, the nginx server is functioning
as proxy server and for the rest, it is functioning simply as web server, serving the files from the
usr/share/nginx/html folder.

How do i ensure that the shell app redirects all calls to master-nginx in higher environments and
directly to the mfe's in local run ?

Thats we have added another manifest file: module-federation.manifest.prod.json in the public folder
of the shell app. Master nginx will redirect all /products requests to products mfe and all /carts requests to carts mfe.

```
{
    "products":"/products/mf-manifest.json",
    "carts":"/carts/mf-manifest.json"
}
```
As we know that we are fetching the contents of the module-federation.manifest.json file in the main.ts
of the shell app. We dont want to touch the main.ts. We just need to update the contents of 
module-federation.manifest.json with module-federation.manifest.prod.json when apps are deployed.

```
import { registerRemotes } from '@module-federation/enhanced/runtime';

fetch('/module-federation.manifest.json')
  .then((res) => res.json())
  .then((remotes: Record<string, string>) =>
    Object.entries(remotes).map(([name, entry]) => ({ name, entry }))
  )
  .then((remotes) => registerRemotes(remotes))
  .then(() => import('./bootstrap').catch((err) => console.error(err)));

```

For this reason in the startup.envsh file executed in the root Dockerfile, we are doing the copy
as you see below, before the nginx server serving the shell app starts.

```
#!/bin/bash
echo "Starting container."
cp /usr/share/nginx/html/shell/module-federation.manifest.prod.json /usr/share/nginx/html/shell/module-federation.manifest.json
nginx -g 'daemon off;'
```

# Where are you coping the nginx config file ?

If you are using any environment variables in your nginx.config, then always copy it to 
/etc/nginx/templates/default.conf.template to ensure they are automatically substituted.
Even if not using, best to copy it here so that it supports future use of env variables.

```
COPY apps/carts/nginx.config /etc/nginx/templates/default.conf.template

```

# MIME type issues

In order to ensure that there are no MIME type issues when nginx is trying to fetch files, we have
added below block in app_nginx.config
```
  types {
        application/javascript js mjs;
        application/json json;
        text/css css;
        text/html html;
    }
```
And the below in proxy_nginx.config
```
  # 🛠️ CRITICAL: Explicitly map modern JS modules so they aren't served as octet-stream
    types {
        text/html                             html htm shtml;
        text/css                              css;
        application/javascript                js mjs;
        application/json                      json;
    }

```

# Css issues with ng-content

When we are projecting html from productDetail.html into <lib-accordion>, the styles defined
for those html in the productDetail.css wont apply.
That is the reason, we have enclosed those html within a  <div class="product-detail-accordion"></div>
Next, all the css for those html tags will come under the below. ng-deep ensures that the styles sink
through <lib-accordion> into the targetted tags.
```
::ng-deep div.product-detail-accordion {


}
```

