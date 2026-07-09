#!/usr/bin/env bash
# Generic secret / PII red-flag scan for the PUBLIC repo. Runs in CI and locally.
# This intentionally greps only GENERIC red flags — never a personal deny-list
# (a personal deny-list would itself be sensitive and lives only in the private repo).
set -u
ROOT="${1:-.}"
fail=0
hit() { echo "PII/secret red flag ($1):"; echo "$2"; fail=1; }

scan() { # pattern, label
  local out
  out=$(grep -rInE "$1" "$ROOT" \
    --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.vercel \
    --exclude=pii-scan.sh 2>/dev/null)
  [ -n "$out" ] && hit "$2" "$out"
}

scan '[A-Za-z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|icloud)\.com' 'personal email'
scan 'secret_[A-Za-z0-9]{16,}'                                     'Notion secret token'
scan 'ntn_[A-Za-z0-9]{16,}'                                        'Notion token'
scan 'sk-ant-[A-Za-z0-9-]{8,}'                                     'Anthropic API key'
scan 'sk-[A-Za-z0-9]{20,}'                                         'generic API key'
scan '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' 'UUID (possible Notion id)'
scan 'app\.notion\.com|notion\.so/[0-9a-f]{16,}'                   'Notion workspace URL/id'
scan 'Bearer [A-Za-z0-9._-]{16,}'                                  'bearer token'

# Binaries that should never ship
if find "$ROOT" -path "$ROOT/.git" -prune -o \( -name '*.pdf' -o -name '*.docx' -o -name '*.tex' \) -print 2>/dev/null | grep -q .; then
  hit 'binary docs' "$(find "$ROOT" -path "$ROOT/.git" -prune -o \( -name '*.pdf' -o -name '*.docx' -o -name '*.tex' \) -print)"
fi

if [ "$fail" -eq 0 ]; then echo "pii-scan: clean ✅"; fi
exit "$fail"
