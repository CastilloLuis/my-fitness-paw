import { supabase } from '../client';
import type { AppConfig, LoginBanner } from '../types';

const defaults: AppConfig = {
  loginEnabled: true,
  signupEnabled: true,
  loginBanner: null,
};

export async function fetchAppConfig(): Promise<AppConfig> {
  const { data, error } = await supabase
    .from('app_config')
    .select('key, value');
  if (error) throw error;

  const map = new Map<string, unknown>(
    (data ?? []).map((row) => [row.key, row.value])
  );

  return {
    loginEnabled: (map.get('login_enabled') as boolean) ?? defaults.loginEnabled,
    signupEnabled: (map.get('signup_enabled') as boolean) ?? defaults.signupEnabled,
    loginBanner: (map.get('login_banner') as LoginBanner | null) ?? defaults.loginBanner,
  };
}
