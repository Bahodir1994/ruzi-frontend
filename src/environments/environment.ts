import keycloakConfig from "./keycloak.config";

export const environment = {
  production: false,
  apiUrl: "/api",
  keycloak: keycloakConfig,
  baseUrl: 'http://localhost:9050',
  wsUrl: 'http://192.168.224.18:9050'
};
