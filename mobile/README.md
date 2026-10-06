# NectArray Android app

A native app (Expo, React Native) for the whole website: Home, Services, Academy, Blog and Contact.

It has no copy of its own. All text comes from the website's content modules through `GET /api/app/content` and `GET /api/app/blog/<slug>`, both built when the site deploys. Changing a line in `src/lib/content` changes it in the app after the next website deploy, with no new Play Store release. The contact form posts to the same `/api/contact` the website uses.

## Run it on your phone

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

Sign-in does **not** work inside Expo Go. Expo Go cannot receive `nectarray://` links, and the live site refuses to send codes anywhere else. To test sign-in, install the test APK (`npm run build:apk`).

## Checks

```
npm run lint
npm run typecheck
```

## Build and publish

Builds run in Expo's cloud (EAS). Android Studio is not needed.

1. Create a free account at https://expo.dev, then run `npx eas-cli@latest login` and `npx eas-cli@latest init` (once).
2. **Test APK:** run `npm run build:apk` and install the APK link it prints on any Android phone.
3. **Store build:** run `npm run build:store`. This produces the `.aab` the Play Store takes. EAS creates and keeps the signing key.
4. **Play Console:** create a developer account ($25, one time) and create an app named NectArray with the package `com.nectarray.app`. Upload the first `.aab` by hand to **Testing > Internal testing**.
5. After that, `npm run submit:store` uploads new builds to the internal track. It needs a Google service-account key; see https://docs.expo.dev/submit/android/.

New personal developer accounts must run a closed test with at least 12 testers for 14 days before production access opens. Organisation accounts do not need to.

Before each release, raise `version` in `app.json`. EAS raises the Android `versionCode` itself.
