import { create } from 'zustand'

export const useImage = create((set) => ({
    imageUrl:"",
    setImage: (url:string) => set({ imageUrl: url }),
}))
