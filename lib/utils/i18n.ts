'use client';

import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from './storage';

export type Language = 'en' | 'ar';

const STORAGE_KEY = 'app_language';

export const translations = {
  en: {
    home: 'Home',
    search: 'Search',
    events: 'Events',
    profile: 'Profile',
    login: 'Sign In',
    register: 'Sign Up',
    logout: 'Logout',
    searchEvents: 'Search Events',
    keyword: 'Keyword',
    city: 'City',
    searchPlaceholder: 'Search events (e.g., concerts, sports, theater)',
    cityPlaceholder: 'City (optional)',
    searchResults: 'Search Results',
    noResults: 'No events found',
    eventDetails: 'Event Details',
    favorite: 'Favorite',
    unfavorite: 'Unfavorite',
    savedEvents: 'Saved Events',
    welcome: 'Welcome',
    discoverEvents: 'Discover Local Events',
    inYourCity: 'In Your City',
    exploreDescription: 'Explore exciting events happening around you. From concerts to workshops, find your next adventure with City Pulse.',
    getStarted: 'Get Started',
    browseEvents: 'Browse Events',
    discoverEventsTitle: 'Discover Events',
    localFocus: 'Local Focus',
    saveFavorites: 'Save Favorites',
  },
  ar: {
    home: 'الرئيسية',
    search: 'بحث',
    events: 'الفعاليات',
    profile: 'الملف الشخصي',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    searchEvents: 'بحث عن فعاليات',
    keyword: 'الكلمة المفتاحية',
    city: 'المدينة',
    searchPlaceholder: 'ابحث عن فعاليات (مثل: حفلات، رياضة، مسرح)',
    cityPlaceholder: 'المدينة (اختياري)',
    searchResults: 'نتائج البحث',
    noResults: 'لم يتم العثور على فعاليات',
    eventDetails: 'تفاصيل الفعالية',
    favorite: 'مفضلة',
    unfavorite: 'إلغاء المفضلة',
    savedEvents: 'الفعاليات المحفوظة',
    welcome: 'مرحباً',
    discoverEvents: 'اكتشف الفعاليات المحلية',
    inYourCity: 'في مدينتك',
    exploreDescription: 'استكشف الفعاليات المثيرة التي تحدث حولك. من الحفلات إلى ورش العمل، ابحث عن مغامرتك القادمة مع City Pulse.',
    getStarted: 'ابدأ الآن',
    browseEvents: 'تصفح الفعاليات',
    discoverEventsTitle: 'اكتشف الفعاليات',
    localFocus: 'التركيز المحلي',
    saveFavorites: 'حفظ المفضلة',
  },
};

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return getStorageItem<Language>(STORAGE_KEY) || 'en';
    }
    return 'en';
  });

  const [isRTL, setIsRTL] = useState(language === 'ar');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStorageItem(STORAGE_KEY, language);
      setIsRTL(language === 'ar');
      document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || key;
  };

  return {
    language,
    isRTL,
    toggleLanguage,
    t,
    setLanguage,
  };
}

