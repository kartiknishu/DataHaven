import { create } from 'zustand'

export const useResultsStore = create((set) => ({
    results: [],
    setResults: (results : any) => set({results}),
    clearResults: () => set({results : []})
}))