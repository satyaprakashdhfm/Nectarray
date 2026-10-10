# NectArray Android app

A native app (Expo, React Native) for the whole website: Home, Services, Academy, Blog and Contact.

It has no copy of its own. All text comes from the website's content modules through `GET /api/app/content` and `GET /api/app/blog/<slug>`, both built when the site deploys. Changing a line in `src/lib/content` changes it in the app after the next website deploy, with no new Play Store release. The contact form posts to the same `/api/contact` the website uses.

## Install it from GitHub (no Expo Go, no build tools)

On an Android phone, open
https://github.com/satyaprakashdhfm/Nectarray/releases/latest/download/NectArray.apk
in Chrome. The APK downloads. Open it and allow Chrome to "install unknown apps" when Android asks. That link always gives the newest version. Every release is listed at https://github.com/satyaprakashdhfm/Nectarray/releases.

### How the installed app stays up to date

The `Mobile app` GitHub workflow (`.github/workflows/mobile-app.yml`) builds the APK on GitHub itself, with Gradle. There is no Expo account or Expo cloud build.

- **To ship a change** (screens, text, styles, a new package, the icon), raise `version` in `app.json` (for example 1.1.0 to 1.2.0) and push to `main`. The workflow builds the APK (about 15 to 25 minutes) and publishes GitHub release `app-v1.2.0`. The installed app then shows **NectArray 1.2.0 is out > Download**. The new APK installs over the old one, and you stay signed in.
- Pushing `mobile/` changes without raising the version builds nothing; the workflow leaves a note saying so.
- Android's `versionCode` follows the version (1.2.3 becomes 10203), so keep each part under 100.

Website content (services, blog, academy text) never needs a new APK: the app reads it live from the site.

### The signing key

Every APK must be signed with the same key, or Android refuses to install it over the one on the phone. The key is a `release.p12` file kept **off the repo** (it was made on the dev machine in `~/nectarray-android-signing/`). Keep a backup of that folder somewhere safe, such as a password manager. If it is lost, everyone has to uninstall the app before installing the next version.

One-time setup, in GitHub > Settings > Secrets and variables > Actions > New repository secret:

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE` | the contents of `ANDROID_KEYSTORE.txt` (the key file, base64) |
| `ANDROID_KEYSTORE_PASSWORD` | the contents of `ANDROID_KEYSTORE_PASSWORD.txt` |

Then run the workflow once from the Actions tab (**Mobile app > Run workflow**) to publish the first release.

## Run it on your phone (development)

1. Install **Expo Go** from the Play Store.
2. Run:
   ```
   cd mobile
   npm install
   npm start
   ```
3. Scan the QR code in the terminal with Expo Go. Your phone and computer must be on the same Wi-Fi network. If they are not, use `npx expo start --tunnel`.

The app reads from https://nectarray.com by default. To test against a local website instead, run `npm run dev` at the repo root and create `mobile/.env.local` containing:

```
EXPO_PUBLIC_SITE_URL=http://<your computer's Wi-Fi IP>:3000
```

A phone cannot reach `localhost`. Use the IP that `ipconfig` shows.

## Sign-in

The person icon on Home (and "Student sign in" on Academy) opens the Account screen, with separate **Student** and **Admin** sign-ins, the same as the website's two.

- Both use Google through the website's own sign-in route, opened in a Chrome tab. When it finishes, the tab sends the phone back into the app (`nectarray://auth`) with a one-time code. The app swaps that code for a session using a secret it made before the tab opened, so the code is useless to anybody else.
- **Admin** checks the address against the same rules as the website's `/admin`: `ADMIN_EMAILS` on Railway or the user's admin role. It checks at sign-in, again when the code is swapped, and again every time the app starts. An account that isn't allowed gets no session, and the app says which Google account was refused.
- Tokens are kept in the phone's encrypted storage. Sign out deletes the session on the server too.

Sign-in does **not** work inside Expo Go. Expo Go cannot receive `nectarray://` links, and the live site refuses to send codes anywhere else. To test sign-in, install the APK from the GitHub release.

## Checks

```
npm run lint
npm run typecheck
```

## Build and publish

Releases are built by the GitHub workflow above. To build an APK on your own machine instead, you need Android Studio's SDK and Java 17:

```
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

That APK is signed with the debug key, so it will not install over a release from GitHub; use it for testing only.

A Play Store release would need an `.aab` (`./gradlew bundleRelease`) signed with the same key, and a Play Console developer account ($25, one time).
