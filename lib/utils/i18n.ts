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
    welcomeBack: 'Welcome Back',
    signInToAccount: 'Sign in to your account',
    emailAddress: 'Email Address',
    password: 'Password',
    signingIn: 'Signing in...',
    signIn: 'Sign In',
    orContinueWith: 'Or continue with',
    signInWithGoogle: 'Sign in with Google',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign up',
    or: 'Or',
    signInWithEmailLink: 'Sign in with email link (passwordless)',
    createAccount: 'Create Account',
    signUpToGetStarted: 'Sign up to get started',
    displayName: 'Display Name (Optional)',
    confirmPassword: 'Confirm Password',
    passwordMinLength: 'Must be at least 6 characters',
    creatingAccount: 'Creating account...',
    signUpWithGoogle: 'Sign up with Google',
    alreadyHaveAccount: 'Already have an account?',
    signInWithEmailLinkTitle: 'Sign In with Email Link',
    enterEmailForLink: "Enter your email and we'll send you a passwordless sign-in link",
    sending: 'Sending...',
    sendSignInLink: 'Send Sign-In Link',
    backToPasswordLogin: 'Back to password login',
    checkYourEmail: 'Check Your Email',
    emailSentTo: "We've sent a sign-in link to",
    clickLinkInEmail: 'Click the link in the email to sign in. The link will expire in a few minutes.',
    sendAnotherEmail: 'Send Another Email',
    backToLogin: 'Back to Login',
    completeSignIn: 'Complete Sign In',
    confirmEmailToComplete: 'Please confirm your email address to complete sign in',
    enterEmailReceivedLink: 'Enter the email address where you received the sign-in link',
    verifyingEmailLink: 'Verifying your email link...',
    invalidLink: 'Invalid Link',
    linkNotValid: 'This link is not a valid sign-in link. Please check your email for the correct link.',
    goToLogin: 'Go to Login',
    loading: 'Loading...',
    cityPulse: 'City Pulse',
    localEventsExplorer: 'Local Events Explorer',
    email: 'Email',
    language: 'Language',
    english: 'English',
    arabic: 'العربية',
    user: 'User',
    showing: 'Showing',
    of: 'of',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    eventNotFound: 'Event not found',
    eventIdRequired: 'Event ID is required',
    from: 'From',
    at: 'at',
    locationTBD: 'Location TBD',
    tryDifferentKeyword: 'Try a different keyword or city',
    enterKeywordToFind: 'Enter a keyword and optionally a city to find events',
    pleaseFillAllFields: 'Please fill in all fields',
    loginFailed: 'Login failed',
    googleSignInFailed: 'Google sign-in failed',
    registrationFailed: 'Registration failed',
    failedToSendEmailLink: 'Failed to send email link',
    failedToVerifyEmailLink: 'Failed to verify email link',
    pleaseEnterEmail: 'Please enter your email address',
    pleaseFillRequiredFields: 'Please fill in all required fields',
    passwordMustBeSixChars: 'Password must be at least 6 characters',
    passwordsDontMatch: 'Passwords do not match',
    invalidEmailFormat: 'Please enter a valid email address',
    rateLimitExceeded: 'Rate limit exceeded. Please try again later.',
    apiKeyNotConfigured: 'Ticketmaster API key is not configured',
    failedToFetchEvents: 'Failed to fetch events',
    failedToFetchEvent: 'Failed to fetch event',
    allRightsReserved: 'All rights reserved',
    copyright: '©',
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
    welcomeBack: 'مرحباً بعودتك',
    signInToAccount: 'قم بتسجيل الدخول إلى حسابك',
    emailAddress: 'عنوان البريد الإلكتروني',
    password: 'كلمة المرور',
    signingIn: 'جاري تسجيل الدخول...',
    signIn: 'تسجيل الدخول',
    orContinueWith: 'أو تابع مع',
    signInWithGoogle: 'تسجيل الدخول باستخدام Google',
    dontHaveAccount: 'ليس لديك حساب؟',
    signUp: 'إنشاء حساب',
    or: 'أو',
    signInWithEmailLink: 'تسجيل الدخول برابط البريد الإلكتروني (بدون كلمة مرور)',
    createAccount: 'إنشاء حساب',
    signUpToGetStarted: 'قم بالتسجيل للبدء',
    displayName: 'الاسم المعروض (اختياري)',
    confirmPassword: 'تأكيد كلمة المرور',
    passwordMinLength: 'يجب أن تكون 6 أحرف على الأقل',
    creatingAccount: 'جاري إنشاء الحساب...',
    signUpWithGoogle: 'التسجيل باستخدام Google',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    signInWithEmailLinkTitle: 'تسجيل الدخول برابط البريد الإلكتروني',
    enterEmailForLink: 'أدخل بريدك الإلكتروني وسنرسل لك رابط تسجيل دخول بدون كلمة مرور',
    sending: 'جاري الإرسال...',
    sendSignInLink: 'إرسال رابط تسجيل الدخول',
    backToPasswordLogin: 'العودة إلى تسجيل الدخول بكلمة المرور',
    checkYourEmail: 'تحقق من بريدك الإلكتروني',
    emailSentTo: 'لقد أرسلنا رابط تسجيل الدخول إلى',
    clickLinkInEmail: 'انقر على الرابط في البريد الإلكتروني لتسجيل الدخول. سينتهي صلاحية الرابط في بضع دقائق.',
    sendAnotherEmail: 'إرسال بريد إلكتروني آخر',
    backToLogin: 'العودة إلى تسجيل الدخول',
    completeSignIn: 'إكمال تسجيل الدخول',
    confirmEmailToComplete: 'يرجى تأكيد عنوان بريدك الإلكتروني لإكمال تسجيل الدخول',
    enterEmailReceivedLink: 'أدخل عنوان البريد الإلكتروني الذي استلمت فيه رابط تسجيل الدخول',
    verifyingEmailLink: 'جاري التحقق من رابط البريد الإلكتروني...',
    invalidLink: 'رابط غير صالح',
    linkNotValid: 'هذا الرابط ليس رابط تسجيل دخول صالح. يرجى التحقق من بريدك الإلكتروني للحصول على الرابط الصحيح.',
    goToLogin: 'الذهاب إلى تسجيل الدخول',
    loading: 'جاري التحميل...',
    cityPulse: 'City Pulse',
    localEventsExplorer: 'مستكشف الفعاليات المحلية',
    email: 'البريد الإلكتروني',
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    user: 'المستخدم',
    showing: 'عرض',
    of: 'من',
    page: 'صفحة',
    previous: 'السابق',
    next: 'التالي',
    eventNotFound: 'الفعالية غير موجودة',
    eventIdRequired: 'معرف الفعالية مطلوب',
    from: 'من',
    at: 'في',
    locationTBD: 'الموقع قيد التحديد',
    tryDifferentKeyword: 'جرب كلمة مفتاحية أو مدينة مختلفة',
    enterKeywordToFind: 'أدخل كلمة مفتاحية واختيارياً مدينة للعثور على الفعاليات',
    pleaseFillAllFields: 'يرجى ملء جميع الحقول',
    loginFailed: 'فشل تسجيل الدخول',
    googleSignInFailed: 'فشل تسجيل الدخول باستخدام Google',
    registrationFailed: 'فشل التسجيل',
    failedToSendEmailLink: 'فشل إرسال رابط البريد الإلكتروني',
    failedToVerifyEmailLink: 'فشل التحقق من رابط البريد الإلكتروني',
    pleaseEnterEmail: 'يرجى إدخال عنوان بريدك الإلكتروني',
    pleaseFillRequiredFields: 'يرجى ملء جميع الحقول المطلوبة',
    passwordMustBeSixChars: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    passwordsDontMatch: 'كلمات المرور غير متطابقة',
    invalidEmailFormat: 'يرجى إدخال عنوان بريد إلكتروني صالح',
    rateLimitExceeded: 'تم تجاوز حد المعدل. يرجى المحاولة مرة أخرى لاحقاً.',
    apiKeyNotConfigured: 'مفتاح API الخاص بـ Ticketmaster غير مُكوّن',
    failedToFetchEvents: 'فشل جلب الفعاليات',
    failedToFetchEvent: 'فشل جلب الفعالية',
    allRightsReserved: 'جميع الحقوق محفوظة',
    copyright: '©',
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

  const formatDate = (date: string, options?: Intl.DateTimeFormatOptions): string => {
    if (!date) return '';
    const dateObj = new Date(date);
    const locale = language === 'ar' ? 'ar-SA' : 'en-US';
    const defaultOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };
    return dateObj.toLocaleDateString(locale, defaultOptions);
  };

  const formatDateShort = (date: string): string => {
    if (!date) return '';
    const dateObj = new Date(date);
    const locale = language === 'ar' ? 'ar-SA' : 'en-US';
    return dateObj.toLocaleDateString(locale, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return {
    language,
    isRTL,
    toggleLanguage,
    t,
    setLanguage,
    formatDate,
    formatDateShort,
  };
}
