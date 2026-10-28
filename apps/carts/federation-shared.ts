import { SharedLibraryConfig } from "@nx/module-federation";

export const sharedMappings: Record<string, SharedLibraryConfig> = {
  '@my-shopping-app/shared-services': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '1.0.0'
  },
  '@my-shopping-app/shared-styles': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '1.0.0'
  },
};