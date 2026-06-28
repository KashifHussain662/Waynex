# Waynex

Navigate. Connect. Explore.

Waynex is a premium travel ecosystem built with Expo, React Native, TypeScript, React Navigation, Zustand, and TanStack Query.

## Project Structure

```text
index.ts             Expo app entry

src/
  assets/
  components/
    Button/
    Input/
    Card/
  screens/
    Auth/
    Home/
    Product/
    Profile/
  navigation/
  services/
  hooks/
  utils/
  constants/
  theme/
  store/
  types/
```

## Development

```bash
npm install
npx expo start
```

Main app work should happen inside `src/`. This project uses a direct Expo entry instead of Expo Router, so there is no `app/` folder.
