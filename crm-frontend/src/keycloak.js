import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:9090',
  realm: 'crm-realm',
  clientId: 'crm-frontend',
});

export default keycloak;
