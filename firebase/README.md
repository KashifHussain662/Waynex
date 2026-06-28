# Waynex Firebase Database

This folder contains the production Firebase database setup for Waynex.

## Deploy

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Seed Demo Data

Seeding uses Firebase Admin SDK, so it needs admin credentials. Create a service account JSON from Firebase Console:

```text
Project settings -> Service accounts -> Generate new private key
```

Then set:

```bash
GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\service-account.json
```

The app Firebase project values can stay in `.env`. The seed script also accepts these optional env values:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Then run:

```bash
npm run firebase:seed
```

Demo logins created by the seed script all use the same password: `Waynex@12345`.

```text
traveler@waynex.app
kashif.demo@waynex.app
ayesha.demo@waynex.app
zain.demo@waynex.app
```

## Road Report Expiration

Road reports include an `expiresAt` field and are indexed for active-report queries.
Enable Firestore TTL in the Firebase console for:

```text
Collection group: roadReports
TTL field: expiresAt
```

The `settings/production.reportExpiryHours` document controls default client-side expiry durations by report type.

## Storage Folders

Media is organized under:

```text
profile-images/
post-images/
stories/
trip-images/
chat/
memories/
voice/
videos/
```
