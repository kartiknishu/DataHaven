import { create } from 'zustand'

export const useAddResourceStore = create((set) => ({
    resource: {
        courseCode: "",
        courseTitle: "",
        instructor_primary: "",
        instructor_secondary: "",
        semester: "",
        year: "",
        tags: [],
        link: "",
        description: ""
    },
    setResource: (resource : any) => set({resource}),
    addResource: (resource : any) => set((state : any) => ({resource : {...state.resource, ...resource}})),
    clearResource: () => set({resource : {}})
}))