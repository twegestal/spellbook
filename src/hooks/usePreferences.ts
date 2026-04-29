import { useState, useEffect } from 'react';

type Preferences = {
  showDiceRoller: boolean;
};

const DEFAULTS: Preferences = {
  showDiceRoller: true,
};

const KEY = 'spellbook_preferences';

function load(): Preferences {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function save(prefs: Preferences) {
  localStorage.setItem(KEY, JSON.stringify(prefs));
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(load);

  const update = (partial: Partial<Preferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...partial };
      save(next);
      return next;
    });
  };

  return { prefs, update };
}
