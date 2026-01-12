/**
 * Internationalization (i18n) Service
 * Laravel-style translation with :variable replacement support
 */

import en from '../langs/en.json';
import ptBR from '../langs/pt-BR.json';

export type Locale = 'en' | 'pt-BR';
export type TranslationParams = Record<string, string | number>;

// All available translations
const translations: Record<Locale, typeof en> = {
  'en': en,
  'pt-BR': ptBR,
};

// Storage key for persisting language preference
const STORAGE_KEY = 'battlecard_locale';

// Current locale (default: English)
let currentLocale: Locale = 'en';

/**
 * Initialize locale from localStorage or use default
 */
export function initLocale(): Locale {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && translations[stored]) {
      currentLocale = stored;
    }
  }
  return currentLocale;
}

/**
 * Get current locale
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Set locale and persist to localStorage
 */
export function setLocale(locale: Locale): void {
  if (translations[locale]) {
    currentLocale = locale;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, locale);
    }
  }
}

/**
 * Get nested value from object using dot notation
 * Example: getNestedValue(obj, 'menu.title') returns obj.menu.title
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let result: unknown = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return typeof result === 'string' ? result : undefined;
}

/**
 * Replace :variable placeholders with actual values (Laravel-style)
 * Example: replaceParams('Hello :name!', { name: 'World' }) => 'Hello World!'
 */
function replaceParams(text: string, params: TranslationParams): string {
  let result = text;
  
  for (const [key, value] of Object.entries(params)) {
    // Replace :key with value (case-insensitive)
    const regex = new RegExp(`:${key}`, 'gi');
    result = result.replace(regex, String(value));
  }
  
  return result;
}

/**
 * Translate a key with optional parameters
 * 
 * Usage:
 *   t('menu.title') => 'PokéCard Battle'
 *   t('battle.directAttackDealt', { attacker: 'Pikachu', damage: 500 })
 *     => 'DIRECT ATTACK! Pikachu dealt 500 damage!'
 * 
 * @param key - Dot-notation key (e.g., 'menu.title', 'battle.summoned')
 * @param params - Optional parameters to replace :variable placeholders
 * @returns Translated string or key if not found
 */
export function t(key: string, params?: TranslationParams): string {
  const translation = getNestedValue(translations[currentLocale], key);
  
  if (!translation) {
    // Fallback to English
    const fallback = getNestedValue(translations['en'], key);
    if (!fallback) {
      console.warn(`[i18n] Missing translation for key: ${key}`);
      return key; // Return key itself as last resort
    }
    return params ? replaceParams(fallback, params) : fallback;
  }
  
  return params ? replaceParams(translation, params) : translation;
}

/**
 * Check if a translation key exists
 */
export function hasTranslation(key: string): boolean {
  return getNestedValue(translations[currentLocale], key) !== undefined ||
         getNestedValue(translations['en'], key) !== undefined;
}

/**
 * Get all available locales
 */
export function getAvailableLocales(): Locale[] {
  return Object.keys(translations) as Locale[];
}

/**
 * Get locale display name
 */
export function getLocaleDisplayName(locale: Locale): string {
  switch (locale) {
    case 'en': return 'English';
    case 'pt-BR': return 'Português (BR)';
    default: return locale;
  }
}

// Initialize locale on module load
initLocale();

// Default export for convenience
export default { t, setLocale, getLocale, initLocale, hasTranslation, getAvailableLocales, getLocaleDisplayName };
