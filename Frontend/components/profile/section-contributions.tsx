'use client';

import axios from 'axios';
axios.defaults.withCredentials = true;
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContributeAlert } from '../academics/home-page/alert-dialog/contribute';

export function SectionContributions({ contributions, codes, titles, instructors, codeTitleMap }) {

    const router = useRouter();

    const handleViewClick = (id: string) => {
        router.push(`/academics/course/${id}`)
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await axios.delete(`${process.env.BACKEND_URL}/api/v1/resource/delete/${id}`, {
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
            <div className="text-xl font-bold px-2">Contributions</div>
            <div className="w-full h-[500px] border rounded my-2">
                <div className="w-full h-[100%] border-b">
                    <ScrollArea className="h-full">
                        {contributions.map((contribution, index) => (
                            <div key={index} className="flex justify-between items-center py-4 px-4 border-b bg-white hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-950 dark:hover:bg-slate-900 dark:hover:text-slate-50">
                                <div className="flex space-x-2">
                                    <HiOutlineAcademicCap size={70} className="mx-1" />
                                    <div>
                                        <p className="text-lg font-semibold">{contribution.courseCode.toUpperCase()}</p>
                                        <p className="text-md capitalize">{contribution.courseTitle}</p>
                                        <p className="text-xs text-muted-foreground">{contribution.likes} Upvotes</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <Button variant="outline" className="mx-0.5" onClick={() => handleViewClick(contribution._id)}>
                                        View
                                    </Button>
                                    {/* <Button variant="outline" className="mx-0.5" > */}
                                        <ContributeAlert label='Edit' variant='outline' resourceId={contribution._id} isUpdate={true} codes = {codes} titles = {titles} instructors = {instructors} codeTitleMap={codeTitleMap}/>
                                    {/* </Button> */}
                                    <Button variant="outline" className="mx-0.5" onClick={() => handleDelete(contribution._id)}>
                                        Delete
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
