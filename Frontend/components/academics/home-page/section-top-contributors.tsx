'use client';

import axios from 'axios';
import '@fontsource/inter/400.css';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContributeAlert } from '@/components/academics/home-page/alert-dialog/contribute';

export function SectionTopContributors({codes, titles, instructors, codeTitleMap}) {
    const [topContributorsData, setTopContributorsData] = useState([]);
    useEffect(() => {
        const fetchTopContributors = async () => {
            try {
                const token = localStorage.getItem('authToken')
                const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/topContributors`, { headers: { 'Authorization': `Bearer ${token}` } });
                setTopContributorsData(res.data.sortedUsers.slice(0, 5))
            } catch (err) {
                console.error(err);
            }
        };

        fetchTopContributors();
    }, []);

    return (
        <>
            <div className='my-8'>
                <ContributeAlert label='Contribute' variant='secondary' resourceId='' isUpdate={false} codes = {codes} titles = {titles} instructors= {instructors} codeTitleMap = {codeTitleMap}/>
                <div className="flex justify-center p-6">
                    <span className="text-lg font-semibold">Top Contributors</span>
                </div>
                <div className="">
                    {
                        topContributorsData.map((user, index) => {
                            return (
                                <div key={index}>
                                    <div className="flex items-center space-x-4 px-4 py-2">
                                        <Avatar>
                                            <AvatarImage src={user.imageUrl ? user.imageUrl : "https://github.com/shadcn.png"} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs font-xs text-muted-foreground">{user.totalLikes} Upvotes</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    );
}
