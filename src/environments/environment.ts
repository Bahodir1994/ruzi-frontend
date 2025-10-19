import {KeycloakConfig} from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:8080',
  realm: "ruzi-realm",
  clientId: "ruzi"
};

export const environment = {
  production: false,
  apiUrl: "/api",
  keycloak: keycloakConfig,
  baseUrl: 'http://localhost:9050',
  wsUrl: 'http://192.168.58.1:9050'
};
