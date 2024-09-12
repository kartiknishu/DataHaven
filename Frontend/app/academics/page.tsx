'use client';

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import { useEffect, useState } from 'react';
import { ThemeProvider } from "@/components/theme-provider"
import { NavigationBar } from '@/components/navigation-menu';
import LoadingIndicator from '@/components/loading-indicator/loading-indicator'
import { CourseFiltersCard } from '@/components/academics/home-page/card/course-filters';
import { SectionCourseResults } from "@/components/academics/home-page/section-course-results";
import { SectionTopContributors } from '@/components/academics/home-page/section-top-contributors';
import axios from "axios"
axios.defaults.withCredentials = true

export default function Page() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [codes, setCodes] = useState([])
    const [titles, setTitles] = useState([])
    const [codeTitleMap, setCodeTitleMap] = useState({})
    const [instructors, setInstructors] = useState([])
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsPageLoading(false);
        }, 1000);

        return () => clearTimeout(loadingTimeout);
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
                                <div className="flex">
                                    <CourseFiltersCard instructors={instructors} />
                                    <div className="flex-1">
                                        <ResizablePanelGroup direction="horizontal">
                                            <ResizablePanel defaultSize={80}>
                                                <SectionCourseResults codes={codes} titles={titles} codeTitleMap = {codeTitleMap}/>
                                            </ResizablePanel>
                                            <ResizableHandle withHandle />
                                            <ResizablePanel defaultSize={20}>
                                                <SectionTopContributors codes={codes} titles={titles} instructors={instructors} codeTitleMap = {codeTitleMap}/>
                                            </ResizablePanel>
                                        </ResizablePanelGroup>
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
