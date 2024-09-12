import { create } from 'zustand'

export const useFiltersStore = create((set, get) => ({
    filters : {
        tags: [],
        courseCode: "",
        courseTitle: "",
        instructor: "",
        semester: "",
        year: ""
    },
    setFilters : (filters : any) => set({filters}),
    addFilter : (filter : any) => set((state : any) => ({filters : {...state.filters, ...filter}})),
    clearFilters : () => set({filters : {}})
}))