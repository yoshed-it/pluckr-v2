import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;
let nativeClient: SupabaseClient | null = null;

type EnvironmentMap = Record<string, string | undefined>;

type StorageAdapter = {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
};

function getEnvironment() {
  const scopedGlobal = globalThis as typeof globalThis & {
    process?: {
      env?: EnvironmentMap;
    };
  };

  return scopedGlobal.process?.env ?? {};
}

function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseUrl() {
  const env = getEnvironment();

  return requireEnv(
    "NEXT_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_URL or SUPABASE_URL",
    env.NEXT_PUBLIC_SUPABASE_URL ??
      env.EXPO_PUBLIC_SUPABASE_URL ??
      env.SUPABASE_URL
  );
}

export function getSupabasePublishableKey() {
  const env = getEnvironment();

  return requireEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY or SUPABASE_PUBLISHABLE_KEY",
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      env.SUPABASE_PUBLISHABLE_KEY ??
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createClient(getSupabaseUrl(), getSupabasePublishableKey(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }

  return browserClient;
}

/**
 * Creates a React Native-safe Supabase client using the storage adapter
 * recommended by Supabase for Expo and React Native apps.
 */
export function getSupabaseNativeClient(storage: StorageAdapter) {
  if (!nativeClient) {
    nativeClient = createClient(getSupabaseUrl(), getSupabasePublishableKey(), {
      auth: {
        storage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    });
  }

  return nativeClient;
}

export function getSupabaseSecretKey() {
  const env = getEnvironment();

  return requireEnv(
    "SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY",
    env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabaseAdminClient() {
  return createClient(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function getSupabaseAnonKey() {
  return getSupabasePublishableKey();
}

export function getSupabaseServiceRoleClient() {
  return getSupabaseAdminClient();
}
