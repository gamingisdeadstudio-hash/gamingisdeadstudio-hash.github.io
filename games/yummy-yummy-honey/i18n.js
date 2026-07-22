(function () {
  'use strict';

  const SUPPORTED = [
    'en', 'fr', 'it', 'de', 'es', 'cs', 'ja', 'ko', 'pl',
    'pt', 'ru', 'zh-Hans', 'th', 'tr', 'vi', 'ca'
  ];

  const LANG_LABELS = {
    'en': 'English',
    'fr': 'Français',
    'it': 'Italiano',
    'de': 'Deutsch',
    'es': 'Español',
    'cs': 'Čeština',
    'ja': '日本語',
    'ko': '한국어',
    'pl': 'Polski',
    'pt': 'Português',
    'ru': 'Русский',
    'zh-Hans': '简体中文',
    'th': 'ไทย',
    'tr': 'Türkçe',
    'vi': 'Tiếng Việt',
    'ca': 'Català',
  };

  // Steam's GetCurrentGameLanguage() returns lowercase English names, not BCP-47.
  // https://partner.steamgames.com/doc/store/localization/languages
  const STEAM_LANG_MAP = {
    english: 'en',
    german: 'de',
    french: 'fr',
    italian: 'it',
    spanish: 'es',
    latam: 'es',
    portuguese: 'pt',
    brazilian: 'pt',
    czech: 'cs',
    polish: 'pl',
    russian: 'ru',
    turkish: 'tr',
    vietnamese: 'vi',
    japanese: 'ja',
    koreana: 'ko',
    schinese: 'zh-Hans',
    tchinese: 'zh-Hans',
    thai: 'th',
    catalan: 'ca',
  };

  function matchSteamLang(name) {
    if (!name) return null;
    const code = STEAM_LANG_MAP[String(name).toLowerCase()];
    return (code && SUPPORTED.indexOf(code) !== -1) ? code : null;
  }

  // Map a navigator.language tag to one of SUPPORTED, or null.
  function matchBrowserLang(tag) {
    if (!tag) return null;
    const lower = tag.toLowerCase();
    if (lower.startsWith('zh')) return 'zh-Hans';
    if (lower.startsWith('pt')) return 'pt';
    if (lower.startsWith('es')) return 'es';
    const primary = lower.split(/[-_]/)[0];
    for (const code of SUPPORTED) {
      if (code.toLowerCase() === lower) return code;
      if (code.toLowerCase().split('-')[0] === primary) return code;
    }
    return null;
  }

  function detectInitialLang() {
    try {
      const saved = localStorage.getItem('yyh_lang');
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (_) {}
    try {
      const steamLang = window.yyh && window.yyh.steam && window.yyh.steam.gameLanguage;
      const m = matchSteamLang(steamLang);
      if (m) return m;
    } catch (_) {}
    const navs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || 'en'];
    for (const tag of navs) {
      const m = matchBrowserLang(tag);
      if (m) return m;
    }
    return 'en';
  }

  // STRINGS[lang][key] = "translated text". Only `en` is the source of truth.
  // Other languages fall back to en when a key is missing.
  const STRINGS = { en: {} };

  // Generic upgrade name/desc translations keyed by English source. Lets
  // language files translate e.g. "Radius" once instead of for every radiusN id.
  // Shape: { de: { name: { 'Radius': 'Reichweite' }, desc: { ... } } }
  const UPG_GENERIC = {};

  let currentLang = detectInitialLang();

  function t(key, vars) {
    let s = (STRINGS[currentLang] && STRINGS[currentLang][key]);
    if (s == null && key.indexOf('upg.') === 0) {
      // Generic-by-English fallback for upgrade name/desc.
      const m = /^upg\.(.+)\.(name|desc)$/.exec(key);
      if (m) {
        const enVal = STRINGS.en[key];
        const dict = UPG_GENERIC[currentLang] && UPG_GENERIC[currentLang][m[2]];
        if (enVal != null && dict && dict[enVal] != null) s = dict[enVal];
      }
    }
    if (s == null) s = STRINGS.en[key];
    if (s == null) return key;
    if (vars) {
      for (const k in vars) {
        s = s.split('{' + k + '}').join(String(vars[k]));
      }
    }
    return s;
  }

  function addUpgradeGeneric(lang, names, descs) {
    if (!UPG_GENERIC[lang]) UPG_GENERIC[lang] = { name: {}, desc: {} };
    if (names) for (const k in names) UPG_GENERIC[lang].name[k] = names[k];
    if (descs) for (const k in descs) UPG_GENERIC[lang].desc[k] = descs[k];
  }

  function getLang() { return currentLang; }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    currentLang = lang;
    try { localStorage.setItem('yyh_lang', lang); } catch (_) {}
    document.documentElement.lang = lang;
    applyDomTranslations();
    // Notify rest of the game so it can re-render anything dynamic.
    document.dispatchEvent(new CustomEvent('yyh:langchange', { detail: { lang } }));
  }

  // Hydrate elements marked with data-i18n / data-i18n-title / data-i18n-html.
  function applyDomTranslations(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    scope.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = t(el.getAttribute('data-i18n-title'));
    });
    scope.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
    });
  }

  function addStrings(lang, dict) {
    if (!STRINGS[lang]) STRINGS[lang] = {};
    for (const k in dict) STRINGS[lang][k] = dict[k];
  }

  window.YYH_I18N = {
    SUPPORTED,
    LANG_LABELS,
    t,
    getLang,
    setLang,
    addStrings,
    addUpgradeGeneric,
    applyDomTranslations,
  };

  // Apply on DOMContentLoaded so any data-i18n attributes in markup hydrate
  // before the main game script reads UI elements.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.documentElement.lang = currentLang;
      applyDomTranslations();
    });
  } else {
    document.documentElement.lang = currentLang;
    applyDomTranslations();
  }
})();
