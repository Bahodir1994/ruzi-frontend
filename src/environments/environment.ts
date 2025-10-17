import keycloakConfig from "./keycloak.config";

const { protocol, hostname } = window.location;
const apiPort = 9050;
const wsProtocol = protocol === "https:" ? "wss:" : "ws:";

export const environment = {
  production: false,
  apiUrl: "/api",
  keycloak: keycloakConfig,
  baseUrl: 'http://localhost:9050',
  wsUrl: 'http://192.168.224.18:9050'
};
