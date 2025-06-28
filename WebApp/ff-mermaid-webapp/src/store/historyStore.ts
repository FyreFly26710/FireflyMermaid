import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidV4 } from 'uuid';
import { generateSlug } from 'random-word-slugs';
import type { HistoryEntry, HistoryType, Optional, State } from '../types';
import { logEvent } from '../utils/statistics';

const MAX_AUTO_HISTORY_LENGTH = 30;

interface HistoryState {
  // State
  historyMode: HistoryType;
  autoHistory: HistoryEntry[];
  manualHistory: HistoryEntry[];
  loaderHistory: HistoryEntry[];
  
  // Computed
  currentHistory: HistoryEntry[];
  
  // Actions
  setHistoryMode: (mode: HistoryType) => void;
  addHistoryEntry: (entry: Optional<HistoryEntry, 'id'>) => void;
  clearHistoryData: (idToClear?: string) => void;
  getPreviousState: (auto: boolean) => string;
  restoreHistory: (data: HistoryEntry[]) => void;
  updateCurrentHistory: () => void;
}

const validateEntry = (entry: HistoryEntry): boolean => {
  return !!(entry.type && entry.state && entry.time);
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      // Initial state
      historyMode: 'manual',
      autoHistory: [],
      manualHistory: [],
      loaderHistory: [],
      currentHistory: [],

      // Update current history based on mode
      updateCurrentHistory: () => {
        const state = get();
        let currentHistory: HistoryEntry[];
        
        switch (state.historyMode) {
          case 'auto':
            currentHistory = state.autoHistory;
            break;
          case 'manual':
            currentHistory = state.manualHistory;
            break;
          case 'loader':
            currentHistory = state.loaderHistory;
            break;
          default:
            currentHistory = state.autoHistory;
        }
        
        set({ currentHistory });
      },

      // Set history mode and update current history
      setHistoryMode: (mode: HistoryType) => {
        set({ historyMode: mode });
        get().updateCurrentHistory();
      },

      // Add a new history entry
      addHistoryEntry: (entryToAdd: Optional<HistoryEntry, 'id'>) => {
        const entry: HistoryEntry = {
          ...entryToAdd,
          id: uuidV4()
        };

        if (entry.type === 'loader') {
          set((state) => ({
            loaderHistory: [entry, ...state.loaderHistory]
          }));
          get().updateCurrentHistory();
          return;
        }

        if (!entry.name) {
          entry.name = generateSlug(2);
        }

        if (entry.type === 'auto') {
          set((state) => {
            let autoHistory = state.autoHistory;
            if (autoHistory.length >= MAX_AUTO_HISTORY_LENGTH) {
              autoHistory = autoHistory.slice(0, MAX_AUTO_HISTORY_LENGTH - 1);
            }
            return { autoHistory: [entry, ...autoHistory] };
          });
        }

        set((state) => ({
          manualHistory: [entry, ...state.manualHistory]
        }));
        
        get().updateCurrentHistory();
        logEvent('history', { action: 'save' });
      },

      // Clear history data
      clearHistoryData: (idToClear?: string) => {
        const state = get();
        const isAuto = state.historyMode === 'auto';
        
        if (state.historyMode !== 'loader') {
          if (isAuto) {
            set((currentState) => ({
              autoHistory: idToClear 
                ? currentState.autoHistory.filter(({ id }) => id !== idToClear)
                : []
            }));
          } else {
            set((currentState) => ({
              manualHistory: idToClear 
                ? currentState.manualHistory.filter(({ id }) => id !== idToClear)
                : []
            }));
          }
          
          get().updateCurrentHistory();
          logEvent('history', { action: 'clear', type: idToClear ? 'single' : 'all' });
        }
      },

      // Get previous state as JSON string
      getPreviousState: (auto: boolean) => {
        const state = get();
        const entries = auto ? state.autoHistory : state.manualHistory;
        if (entries.length > 0) {
          return JSON.stringify(entries[0].state);
        }
        return '';
      },

      // Restore history from external data
      restoreHistory: (data: HistoryEntry[]) => {
        const entries = data.filter((element) => validateEntry(element));
        const invalidEntryCount = data.length - entries.length;
        
        if (invalidEntryCount > 0) {
          console.error(`${invalidEntryCount} invalid history entries were removed.`);
          console.error(data);
        }
        
        if (entries.length > 0) {
          let entryCount = 0;
          const isAuto = entries[0].type === 'auto';
          
          set((state) => {
            const existing = isAuto ? state.autoHistory : state.manualHistory;
            const existingIDs = new Set(existing.map(({ id }) => id));
            const newEntries = entries.filter(({ id }) => !existingIDs.has(id));
            entryCount = newEntries.length;
            
            const combined = [...existing, ...newEntries];
            combined.sort((a, b) => b.time - a.time);
            
            return isAuto 
              ? { autoHistory: combined }
              : { manualHistory: combined };
          });

          alert(
            `${entryCount} entries restored. ${invalidEntryCount} invalid, ${
              entries.length - entryCount
            } duplicates.`
          );
          
          get().updateCurrentHistory();
          logEvent('history', {
            action: 'restore',
            success: entryCount,
            invalid: invalidEntryCount,
            duplicates: entries.length - entryCount
          });
        } else {
          alert('No valid entries found.');
        }
      }
    }),
    {
      name: 'mermaid-editor-history',
      partialize: (state) => ({
        historyMode: state.historyMode,
        autoHistory: state.autoHistory,
        manualHistory: state.manualHistory
        // Note: loaderHistory is not persisted as it's session-only
      }),

    }
  )
);

// Initialize current history on first load
useHistoryStore.getState().updateCurrentHistory(); 