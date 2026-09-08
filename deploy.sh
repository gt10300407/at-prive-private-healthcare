#!/usr/bin/env bash
set -euo pipefail

HOST="220.73.160.56"
USER="atprive"
PORT="22"
SERVICE="atinc-cafe24-deploy"

cd "$(git rev-parse --show-toplevel)"

echo "======================================"
echo " at PRIVÉ → Cafe24 Production Deploy"
echo "======================================"

if [ "$(git branch --show-current)" != "main" ]; then
  echo "❌ main 브랜치가 아님"
  exit 1
fi

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "❌ 커밋되지 않은 변경사항이 있음"
  git status --short
  exit 1
fi

git fetch origin main

LOCAL_SHA="$(git rev-parse HEAD)"
REMOTE_SHA="$(git rev-parse origin/main)"

if [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
  if git merge-base --is-ancestor origin/main HEAD; then
    git push origin HEAD:main
  elif git merge-base --is-ancestor HEAD origin/main; then
    git pull --ff-only origin main
  else
    echo "❌ 로컬과 GitHub main이 갈라져 있음"
    exit 1
  fi
fi

SHA="$(git rev-parse HEAD)"
SHORT_SHA="$(git rev-parse --short HEAD)"

PW="$(security find-generic-password \
  -a "$USER" \
  -s "$SERVICE" \
  -w 2>/dev/null || true)"

if [ -z "$PW" ]; then
  echo "❌ Mac 키체인에 Cafe24 비밀번호가 없음"
  exit 1
fi

export SSHPASS="$PW"

echo "▶ Cafe24 배포: $SHORT_SHA"

git archive \
  --format=tar \
  HEAD \
  index.html \
  medical-notice.html \
  partners.html \
  privacy.html \
  private-services.html \
  program.html \
  programs.html \
  assets \
  data \
| sshpass -e ssh \
    -o PreferredAuthentications=password \
    -o PubkeyAuthentication=no \
    -o StrictHostKeyChecking=accept-new \
    -p "$PORT" \
    "$USER@$HOST" \
    "set -e
     cd /atprive/www
     tar -xf -
     printf '%s\n' '$SHA' > .deploy-version
     find . -name '._*' -delete
     echo '✅ Cafe24 파일 배포 완료'"

unset SSHPASS
unset PW

HTTP_CODE="$(
  curl -sS \
    -o /dev/null \
    -w "%{http_code}" \
    --max-time 15 \
    "https://atinc.co.kr/?deploy=$SHORT_SHA"
)"

if [ "$HTTP_CODE" != "200" ]; then
  echo "❌ 사이트 응답 이상: HTTP $HTTP_CODE"
  exit 1
fi

echo "======================================"
echo "✅ PRODUCTION DEPLOY SUCCESS"
echo "Commit : $SHORT_SHA"
echo "URL    : https://atinc.co.kr"
echo "HTTP   : $HTTP_CODE"
echo "======================================"
