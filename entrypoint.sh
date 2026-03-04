#!/bin/sh
# ─────────────────────────────────────────────────────────────
# AetherOS — Docker Entrypoint
# Injects runtime environment variables into the built React app.
# This allows changing config without rebuilding the Docker image.
#
# Usage: Set env vars on `docker run`:
#   docker run -e REACT_APP_ANTHROPIC_API_KEY=sk-ant-... aetheros-dashboard
# ─────────────────────────────────────────────────────────────

set -e

echo "[AetherOS] Injecting runtime environment variables..."

# Target directory
TARGET_DIR=/usr/share/nginx/html

# Find all JS files in the build output
for file in "$TARGET_DIR"/static/js/*.js; do
  if [ -f "$file" ]; then
    # Replace placeholder with actual runtime value
    if [ -n "$REACT_APP_ANTHROPIC_API_KEY" ]; then
      sed -i "s|__REACT_APP_ANTHROPIC_API_KEY__|$REACT_APP_ANTHROPIC_API_KEY|g" "$file"
    fi

    if [ -n "$REACT_APP_VERSION" ]; then
      sed -i "s|__REACT_APP_VERSION__|$REACT_APP_VERSION|g" "$file"
    fi
  fi
done

echo "[AetherOS] Environment injection complete."
echo "[AetherOS] Starting Nginx..."
