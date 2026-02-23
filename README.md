# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Remote App Config

The `app_config` table in Supabase lets you toggle auth features and display banners **without an app update**. The app reads these values on launch and caches them for 5 minutes.

### Table structure

| key | value (JSONB) | Effect |
|-----|---------------|--------|
| `login_enabled` | `true` / `false` | Enables or disables the "Log In" button on the welcome screen |
| `signup_enabled` | `true` / `false` | Enables or disables the "Create Account" button on the welcome screen |
| `login_banner` | `null` or `{"text_en": "...", "text_es": "..."}` | Shows an info banner at the top of the login screen |

### How to use

All changes are made directly in the Supabase dashboard (Table Editor or SQL Editor). No app deploy required.

**Disable login:**

```sql
UPDATE app_config SET value = 'false', updated_at = now() WHERE key = 'login_enabled';
```

**Disable signup:**

```sql
UPDATE app_config SET value = 'false', updated_at = now() WHERE key = 'signup_enabled';
```

**Show a maintenance banner on the login screen:**

```sql
UPDATE app_config SET value = '{"text_en": "Scheduled maintenance tonight at 10 PM", "text_es": "Mantenimiento programado esta noche a las 10 PM"}', updated_at = now() WHERE key = 'login_banner';
```

**Remove the banner:**

```sql
UPDATE app_config SET value = 'null', updated_at = now() WHERE key = 'login_banner';
```

**Re-enable everything (defaults):**

```sql
UPDATE app_config SET value = 'true', updated_at = now() WHERE key = 'login_enabled';
UPDATE app_config SET value = 'true', updated_at = now() WHERE key = 'signup_enabled';
UPDATE app_config SET value = 'null', updated_at = now() WHERE key = 'login_banner';
```

### How it works in the app

1. `src/hooks/use-app-config.ts` fetches all rows from `app_config` via TanStack Query (5 min stale time)
2. **Welcome screen** (`app/(auth)/welcome.tsx`) disables the Log In / Create Account buttons when the respective flag is `false`. While the config is loading, buttons stay enabled (optimistic).
3. **Login screen** (`app/(auth)/login.tsx`) renders a blue info banner below the back button when `login_banner` contains text. The banner picks `text_en` or `text_es` based on the device language.

### Adding new config keys

To add a new remote flag, insert a row into `app_config` and read it in `src/supabase/queries/app-config.ts`. The table uses public read-only RLS, so any new key is immediately available to the app.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
