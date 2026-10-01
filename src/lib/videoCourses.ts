export type VideoCourse = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  language_code: string;
  price_eur: number;
  status: 'live' | 'coming_soon' | 'hidden';
  cover_image: string | null;
  display_order: number;
};

export const DELIVERY_LANGUAGES: Record<string, { el: string; en: string; flag: string }> = {
  el: { el: 'Ελληνικά', en: 'Greek', flag: '🇬🇷' },
  en: { el: 'Αγγλικά', en: 'English', flag: '🇬🇧' },
  es: { el: 'Ισπανικά', en: 'Spanish', flag: '🇪🇸' },
  fr: { el: 'Γαλλικά', en: 'French', flag: '🇫🇷' },
  it: { el: 'Ιταλικά', en: 'Italian', flag: '🇮🇹' },
  de: { el: 'Γερμανικά', en: 'German', flag: '🇩🇪' },
};

export function languageLabel(code: string, uiLang: string) {
  const l = DELIVERY_LANGUAGES[code];
  if (!l) return code;
  return `${l.flag} ${uiLang === 'el' ? l.el : l.en}`;
}
