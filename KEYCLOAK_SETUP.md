# Keycloak — Configuration automatique LuxStay Rewards

## Demarrage
La configuration du realm est importee automatiquement via `--import-realm`.

```bash
docker-compose up -d keycloak
```

Optionnel: verification automatique

```bash
./keycloak/verify-keycloak.sh
```

## Utilisateurs de test

| Username | Password | Role |
|---|---|---|
| admin-luxstay | Admin1234! | ROLE_ADMIN |
| youssef.elfassi | User1234! | ROLE_USER |
| staff.hotel | Staff1234! | ROLE_STAFF |

## URLs importantes

- Console admin: http://localhost:9090/admin
- OpenID configuration: http://localhost:9090/realms/crm-realm/.well-known/openid-configuration
- Token endpoint: http://localhost:9090/realms/crm-realm/protocol/openid-connect/token

## Tester un token

```bash
curl -s -X POST "http://localhost:9090/realms/crm-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=crm-frontend" \
  -d "username=admin-luxstay" \
  -d "password=Admin1234!"
```

Ou via script utilitaire:

```bash
./keycloak/get-token.sh admin
./keycloak/get-token.sh user
./keycloak/get-token.sh staff
```

## Depannage

- Si le realm n'apparait pas, recreer le conteneur Keycloak pour forcer l'import:

```bash
docker-compose down keycloak
docker-compose up -d keycloak
```

- Verifier que le volume de mapping est bien present dans `docker-compose.yml`:
  `./keycloak/crm-realm-export.json:/opt/keycloak/data/import/crm-realm-export.json`
- Verifier le statut health:
  `curl http://localhost:9090/health/ready`
- Verifier le realm via API admin avec:
  `./keycloak/verify-keycloak.sh`
