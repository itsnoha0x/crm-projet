#!/bin/bash
set -euo pipefail

KEYCLOAK_URL="http://localhost:9090"
ADMIN_USER="admin"
ADMIN_PASSWORD="admin123"

echo "Waiting for Keycloak readiness..."
until curl -fsS "$KEYCLOAK_URL/health/ready" >/dev/null 2>&1; do
  sleep 2
done

TOKEN=$(curl -s -X POST \
  "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" \
  -d "username=$ADMIN_USER" \
  -d "password=$ADMIN_PASSWORD" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

REALM_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  "$KEYCLOAK_URL/admin/realms/crm-realm")
if [ "$REALM_STATUS" != "200" ]; then
  echo "Realm crm-realm not found (HTTP $REALM_STATUS)"
  exit 1
fi

USERS_JSON=$(curl -s \
  -H "Authorization: Bearer $TOKEN" \
  "$KEYCLOAK_URL/admin/realms/crm-realm/users?max=200")

CLIENTS_JSON=$(curl -s \
  -H "Authorization: Bearer $TOKEN" \
  "$KEYCLOAK_URL/admin/realms/crm-realm/clients?max=200")

USER_COUNT=$(printf "%s" "$USERS_JSON" | python3 -c "import sys,json; users={u.get('username') for u in json.load(sys.stdin)}; required={'admin-luxstay','youssef.elfassi','staff.hotel'}; print(3 if required.issubset(users) else 0)")
CLIENT_COUNT=$(printf "%s" "$CLIENTS_JSON" | python3 -c "import sys,json; clients={c.get('clientId') for c in json.load(sys.stdin)}; required={'crm-frontend','crm-backend'}; print(2 if required.issubset(clients) else 0)")

if [ "$USER_COUNT" != "3" ]; then
  echo "Users missing in crm-realm"
  exit 1
fi

if [ "$CLIENT_COUNT" != "2" ]; then
  echo "Clients missing in crm-realm"
  exit 1
fi

echo "✓ Realm OK"
echo "✓ 3 users OK"
echo "✓ 2 clients OK"
echo ""
echo "Console admin : http://localhost:9090/admin"
echo "Realm config  : http://localhost:9090/realms/crm-realm/.well-known/openid-configuration"
echo "Token endpoint: http://localhost:9090/realms/crm-realm/protocol/openid-connect/token"
