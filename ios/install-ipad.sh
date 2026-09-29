#!/bin/sh
# Builds CS 170 Walkthrough and installs it on the first connected, paired iPad.
# Usage: ios/install-ipad.sh            (plug the iPad in, unlock it, trust this Mac once)
set -e
cd "$(dirname "$0")"

DEVICE=$(xcrun devicectl list devices 2>/dev/null | grep 'iPad' | grep 'available' \
  | grep -oE '[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}' | head -1)
if [ -z "$DEVICE" ]; then
  echo "No available iPad found. Plug it in, unlock it, and tap Trust if asked." >&2
  exit 1
fi
echo "Installing on iPad $DEVICE"

xcodegen generate --quiet
xcodebuild -project CS170Walkthrough.xcodeproj -scheme CS170Walkthrough \
  -configuration Release -destination "id=$DEVICE" -derivedDataPath build/device \
  -allowProvisioningUpdates build | grep -E "error|BUILD" || true

APP=build/device/Build/Products/Release-iphoneos/CS170Walkthrough.app
[ -d "$APP" ] || { echo "Build failed." >&2; exit 1; }
xcrun devicectl device install app --device "$DEVICE" "$APP"
xcrun devicectl device process launch --device "$DEVICE" com.alexdils.cs170walkthrough || true
