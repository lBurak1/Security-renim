import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// İlerleme, soru geçmişi ve işaretli sorular localStorage'da tutulur.
export const useProgress = create(
  persist(
    (set, get) => ({
      // { "1.2-q1": { correct: true, chosen: "A" } }
      answers: {},
      // tamamlanmış modül id'leri: ["1.1", "1.2"]
      completedModules: [],
      // işaretlenen soru id'leri
      flagged: [],

      recordAnswer: (qid, chosen, correct) =>
        set((s) => ({ answers: { ...s.answers, [qid]: { chosen, correct } } })),

      toggleModuleComplete: (mid) =>
        set((s) => ({
          completedModules: s.completedModules.includes(mid)
            ? s.completedModules.filter((m) => m !== mid)
            : [...s.completedModules, mid],
        })),

      toggleFlag: (qid) =>
        set((s) => ({
          flagged: s.flagged.includes(qid)
            ? s.flagged.filter((q) => q !== qid)
            : [...s.flagged, qid],
        })),

      resetAll: () => set({ answers: {}, completedModules: [], flagged: [] }),

      stats: () => {
        const a = get().answers
        const keys = Object.keys(a)
        const correct = keys.filter((k) => a[k].correct).length
        return { total: keys.length, correct, accuracy: keys.length ? Math.round((correct / keys.length) * 100) : 0 }
      },

      // En son yanlış cevaplanan soru id'leri
      wrongIds: () => {
        const a = get().answers
        return Object.keys(a).filter((k) => !a[k].correct)
      },
    }),
    { name: 'secplus-progress' }
  )
)
