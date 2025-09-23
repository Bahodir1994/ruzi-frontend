import {KeycloakOptions, KeycloakService} from "keycloak-angular";
import {environment} from "../../../environments/environment";

export function initializer(keycloak: KeycloakService): () => Promise<boolean> {

  const options: KeycloakOptions = {
    config: environment.keycloak,
    loadUserProfileAtStartUp: true,
    initOptions: {
      onLoad: 'check-sso', // Включает авто-проверку сессии
      silentCheckSsoRedirectUri: '/silent-check-sso.html',
      checkLoginIframe: true,
    }
  };

  return () => keycloak.init(options);
}
