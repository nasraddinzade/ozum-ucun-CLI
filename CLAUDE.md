# Özüm üçün — RN CLI version (notes for Claude)

Pure React Native CLI rewrite (no Expo) of the Özüm üçün app.

## User preferences (IMPORTANT)
- Always perform ALL GitHub operations on the user's behalf (commit/push/branch).
- The user prefers to be told what was done, not asked to do it.
- **Do NOT build an APK unless the user explicitly asks ("сделай apk").**
  After code changes, just verify on the Android emulator (install, drive the
  flow, screenshot). Skip `assembleRelease`/APK packaging until requested.

## Repo
- GitHub: https://github.com/nasraddinzade/ozum-ucun-CLI (origin, branch main)
- git user: ramin98 / nasraddinzade@gmail.com

## Stack
- React Native 0.85.3, React 19.2.3, TypeScript, new architecture
- @op-engineering/op-sqlite (16.x) — local DB, via thin adapter in src/database
- @notifee/react-native — local notifications
- react-native-bootsplash — splash
- react-navigation v6, zustand, reanimated 4 (+ react-native-worklets), svg,
  safe-area-context, screens, i18next (az/en/ru)

## Build / signing (only when asked)
- Release signing reads android/keystore.properties (GITIGNORED) — must contain
  storeFile/keyAlias/storePassword/keyPassword. Keystore: ozumucun-release.keystore
  (password OzumUcun2024!, alias ozumucun) — also gitignored.
- ABI splits enabled: arm64-v8a (~30MB) + armeabi-v7a (~24MB), no universal APK.
- Build: cd android && ./gradlew assembleRelease -x lint -x lintVitalAnalyzeRelease -x lintVitalRelease

## Emulator verify loop
- Start AVD (e.g. Pixel_7), `adb install -r <apk>` or `npx react-native run-android`,
  drive with `adb shell input tap`, screenshot via `adb shell screencap -p /sdcard/s.png` + pull.
