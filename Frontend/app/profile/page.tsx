'use client';

import axios from 'axios';
axios.defaults.withCredentials = true;
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { ThemeProvider } from "@/components/theme-provider"
import { NavigationBar } from '@/components/navigation-menu';
import { SectionBookmarks } from '@/components/profile/section-bookmarks';
import LoadingIndicator from '@/components/loading-indicator/loading-indicator'
import { SectionContributions } from '@/components/profile/section-contributions';
import { SectionPersonalDetails } from '@/components/profile/section-personal-details';

export default function Page() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [userDetails, setUserDetails] = useState<any>({});
    const [savedResources, setSavedResources] = useState([]);
    const [contributedResources, setContributedResources] = useState([]);
    const [codes, setCodes] = useState([])
    const [titles, setTitles] = useState([])
    const [instructors, setInstructors] = useState([])
    const [codeTitleMap, setCodeTitleMap] = useState({})
    const router = useRouter();
    const [rank, setRank] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsPageLoading(false);
        }, 1000);

        return () => clearTimeout(loadingTimeout);
    }, []);

    useEffect(() => {
        const getSavedResources = async () => {
            try {
                const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/getSavedResources/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                })

                setSavedResources(res.data.updatedResourceData);
            }
            catch (error) {
                console.log(error)
            }
        };
        getSavedResources();
    }, []);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const response = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/getParticularUser`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
                });

                setUserDetails(response.data.user);
            } catch (error) {
                console.log(error);
                // Handle error if needed
                router.push('/login');
                return
            }
        };

        getUserDetails();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/topContributors`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
                });

                response.data.sortedUsers.forEach((element: any, index: number) => {
                    if (element._id === userDetails._id) { setRank(index + 1) }
                })
            } catch (e) {
                console.log(e)
            }
        };

        fetchData();
    }, [userDetails]);


    useEffect(() => {
        const getContributedResources = async () => {
            try {
                const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/getContributedResources`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                })

                setContributedResources(res.data.updatedResourceData);
            }
            catch (error) {
                console.log(error)
            }
        };
        getContributedResources();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const res = await axios.get(
                    `${process.env.BACKEND_URL}/api/v1/courses/getCourses`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );


                // Assuming backendResponse is extracted from res.data
                const backendResponse = res.data.courses;

                // Extracting value and label from backend response
                const mappedCodes = backendResponse.map(item => ({
                    value: item.code.toLowerCase(),
                    label: item.code
                }));

                setCodes(mappedCodes);
                
                const codeMap = {};
                backendResponse.forEach(item => {
                    codeMap[item.code.toLowerCase()] = item.title.toLowerCase();
                });

                setCodeTitleMap(codeMap);
                // Creating set of unique titles
                const uniqueTitles = new Set(backendResponse.map(item => item.title));

                // Extracing value and label from uniqueTitles
                const titlesArray = Array.from(uniqueTitles).map(title => ({
                    value: (title as string).toLowerCase(),
                    label: title
                }));

                setTitles(titlesArray);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const res = await axios.get(
                    `${process.env.BACKEND_URL}/api/v1/courses/getInstructors`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );


                // Assuming backendResponse is extracted from res.data
                const backendResponse = res.data.instructors;


                // Extracting value and label from backend response
                const mappedCodes = backendResponse.map(item => ({
                    value: item.instructor.toLowerCase(),
                    label: item.instructor
                }));

                setInstructors(mappedCodes);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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
                                <SectionPersonalDetails personalInfo={userDetails} rank={rank} />
                                <div className="flex justify-center">
                                    <div className="w-[45%]">
                                        <SectionBookmarks bookmarks={savedResources} />
                                    </div>
                                    <div className="w-[45%]">
                                        <SectionContributions contributions={contributedResources} codes={codes} titles={titles} instructors={instructors} codeTitleMap = {codeTitleMap}/>
                                    </div>
                                </div>
                            </>
                        )}

                    </ThemeProvider>
                </div>
            )}
        </div>
    );
}
