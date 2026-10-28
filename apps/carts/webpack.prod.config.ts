import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config';
import { sharedMappings } from './federation-shared';

/**
 * DTS Plugin is disabled in Nx Workspaces as Nx already provides Typing support for Module Federation
 * The DTS Plugin can be enabled by setting dts: true
 * Learn more about the DTS Plugin here: https://module-federation.io/configure/dts.html
 */
export default withModuleFederation({
  ...config,
   shared: (libraryName, defaultConfig) => {
        // If the library is in our central map, apply those rules
        if (sharedMappings[libraryName]) {
          return sharedMappings[libraryName];
        }
        
        // Otherwise let Nx handle defaults
        return defaultConfig;
      },
  /*
   * Remote overrides for production.
   * Each entry is a pair of a unique name and the URL where it is deployed.
   *
   * e.g.
   * remotes: [
   *   ['app1', 'https://app1.example.com'],
   *   ['app2', 'https://app2.example.com'],
   * ]
   */
}, { dts: false });
