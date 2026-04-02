import { useState, useEffect, useSyncExternalStore } from 'react';

// État global centralisé de l'application CyberShield

export interface PasswordAnalysis {
  password: string;
  score: number;
  level: string;
  entropy: number;
  date: string;
}

export interface PhishingAnalysis {
  sender: string;
  subject: string;
  score: number;
  verdict: string;
  reasons: string[];
  date: string;
}

export interface QuizResult {
  score: number;
  total: number;
  date: string;
  categories: Record<string, { correct: number; total: number }>;
  playerName: string;
}

export interface CyberState {
  passwordAnalyses: PasswordAnalysis[];
  phishingAnalyses: PhishingAnalysis[];
  quizResults: QuizResult[];
  quizTopScores: QuizResult[];
  newsCache: NewsArticle[] | null;
  newsCacheTime: number | null;
}

export interface NewsArticle {
  title: string;
  source: string;
  date: string;
  summary: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  url?: string;
}

const STORAGE_KEY = 'cybershield_state';

function loadState(): CyberState {
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
const listeners: (() => void)[] = [];

export function getState(): CyberState {
  return state;
}

export function updateState(partial: Partial<CyberState>) {
  state = { ...state, ...partial };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach(fn => fn());
}

export function subscribe(fn: () => void) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}

export function useGlobalState(): CyberState {
  const snap = useSyncExternalStore(subscribe, getState, getState);
  return snap;
}
