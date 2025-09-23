import {KeycloakConfig} from 'keycloak-js'

const isExternal = window.location.hostname.startsWith('10.190.');

const keycloakConfig: KeycloakConfig = {
  url: isExternal
    ? 'http://10.190.0.118:4500'   // внешний доступ
    : 'http://localhost:8080', // внутренний доступ
  realm: "ruzi-realm",
  clientId: "ruzi"
};

export default keycloakConfig;
