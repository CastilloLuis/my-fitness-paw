// Type reference for available translation keys.
// Strict key checking is not enabled because several patterns
// use dynamic keys stored as `string` (activity labels, tab labels, etc.).
import type en from './en.json';

export type TranslationKeys = typeof en;
