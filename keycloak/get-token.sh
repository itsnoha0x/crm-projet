#!/bin/bash
# Usage: ./get-token.sh [admin|user|staff]
PROFILE=${1:-user}

case $PROFILE in
  admin) USERNAME="admin-luxstay"; PASSWORD="Admin1234!" ;;
  staff) USERNAME="staff.hotel"; PASSWORD="Staff1234!" ;;
  *) USERNAME="youssef.elfassi"; PASSWORD="User1234!" ;;
esac

TOKEN=$(curl -s -X POST \
  "http://localhost:9090/realms/crm-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=crm-frontend" \
  -d "username=$USERNAME" \
  -d "password=$PASSWORD" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

echo "=== Token JWT pour $PROFILE ==="
echo "$TOKEN"
echo ""
echo "=== Header Authorization ==="
echo "Bearer $TOKEN"
