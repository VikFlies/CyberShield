import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'cybershield_state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    passwordAnalyses: [],
    phishingAnalyses: [],
    quizResults: [],
    quizTopScores: [],
    newsCache: null,
    newsCacheTime: null,
  };
}

let state = loadState();
const listeners = [];

export function getState() {
  return state;
}

export function updateState(partial) {
  state = { ...state, ...partial };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach(fn => fn());
}

export function subscribe(fn) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}

export function useGlobalState() {
  return useSyncExternalStore(subscribe, getState, getState);
}
