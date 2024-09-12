'use client';

import axios from 'axios'
axios.defaults.withCredentials = true
import { use, useEffect, useState } from 'react';
import { ThemeProvider } from "@/components/theme-provider"
import { NavigationBar } from '@/components/navigation-menu';
import LoadingIndicator from '@/components/loading-indicator/loading-indicator'
import { SectionCourseDetails } from '@/components/academics/course-page/section-course-details';
import { SectionCourseMetadata } from "@/components/academics/course-page/section-course-metadata";
import { SectionCourseComments } from "@/components/academics/course-page/section-course-comments";

const u1 = {
    name: 'Username',
    _id: 'abc'
}

export default function Page({ params }: any) {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [course, setCourse] = useState({})
    const [comments, setComments] = useState([])
    const [uploader, setUploader] = useState('')
    const [user, setUser] = useState(u1);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsPageLoading(false);
        }, 1000);

        return () => clearTimeout(loadingTimeout);
    }, []);

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/resource/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                })

                const newData = res.data.resource
                setCourse(newData)

                const uploaderRes = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/getParticularUser`, {
                    params: { user: newData.uploaded_by },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                })

                setUploader(uploaderRes.data.user.name)
            }
            catch (err) {
                console.log(err)
            }
        }

        getCourse()
    }, [])

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/comment/resource/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                })
                setComments(res.data.comments ? res.data.comments : [])

                const currentUser = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/getParticularUser`, {
                    params: { user: res.data.user },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                })
                setUser(currentUser.data.user)

            }
            catch (err) {
                console.log(err)
            }
        }

        getComments()
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1000);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            {isMobile ? (
                <p className="p-1 text-sm">Sorry, we do not support smaller screens at the moment.</p>
            ) : (
                <div>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >

                        {isPageLoading ? (
                            <LoadingIndicator />
                        ) : (
                            <>
                                <NavigationBar />
                                <SectionCourseDetails courseInfo={course} user={user} />
                                <div className="flex justify-center text-sm">
                                    <SectionCourseMetadata courseInfo={course} uploader={uploader} />
                                    <SectionCourseComments commentsInfo={comments} courseInfo={course} user={user} />
                                </div>
                            </>
                        )}

                    </ThemeProvider>
                </div>
            )}
        </div>
    );
}
