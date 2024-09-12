'use client';

import axios from 'axios';
axios.defaults.withCredentials = true;
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HiOutlineAcademicCap } from "react-icons/hi2";

export function SectionBookmarks({ bookmarks }) {
    const router = useRouter();

    const handleViewClick = (id: string) => {
        router.push(`/academics/course/${id}`)
    }

    const handleRemove = async (id: string) => {
        try {
            const res = await axios.delete(`${process.env.BACKEND_URL}/api/v1/user/removeSavedResource/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })

            window.location.reload();
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="px-4 py-6">
            <div className="text-xl font-bold px-2">Bookmarks</div>
            <div className="w-full h-[500px] border rounded my-2">
                <div className="w-full h-[100%] border-b">
                    <ScrollArea className="h-full">
                        {bookmarks.map((bookmark, index) => (
                            <div key={index} className="flex justify-between items-center py-4 px-4 border-b bg-white hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-950 dark:hover:bg-slate-900 dark:hover:text-slate-50">
                                <div className="flex space-x-2">
                                    <HiOutlineAcademicCap size={70} className="mx-1" />
                                    <div>
                                        <p className="text-lg font-semibold">{bookmark.courseCode.toUpperCase()}</p>
                                        <p className="text-md capitalize">{bookmark.courseTitle}</p>
                                        {/* <p className="text-xs text-muted-foreground">by {bookmark.uploaded_by}</p> */}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Button variant="outline" className="mx-1" onClick={() => handleViewClick(bookmark._id)}>
                                        View
                                    </Button>
                                    <Button variant="outline" className="mx-1" onClick={() => handleRemove(bookmark._id)}>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
