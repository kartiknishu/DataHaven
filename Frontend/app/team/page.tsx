'use client';

import { } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { AiFillInstagram } from "react-icons/ai";
import { ThemeProvider } from "@/components/theme-provider"
import { NavigationBar } from '@/components/navigation-menu';
import LoadingIndicator from '@/components/loading-indicator/loading-indicator'

const teamMembers = [
    {
        name: 'Subham',
        image: 'subham.jpg',
        email: '2020csb1317@iitrpr.ac.in',
        linkedin: 'https://www.linkedin.com/in/subham71/',
        instagram: 'https://www.instagram.com/_subham71/',
        batch: 'Batch of 2024'
    },
    {
        name: 'Sahil Mangla',
        image: 'sahil.jpeg',
        email: '2021csb1128@iitrpr.ac.in',
        linkedin: 'https://www.linkedin.com/in/sahilmangla/',
        instagram: 'https://www.instagram.com/sahilmangla148/',
        batch: 'Batch of 2025'
    },
    {
        name: 'Ojassvi Kumar',
        image: 'ojassvi_kumar.jpg',
        email: '2020csb1187@iitrpr.ac.in',
        linkedin: 'https://www.linkedin.com/in/ojassvi-kumar/',
        instagram: 'https://www.instagram.com/0jassvikumar/',
        batch: 'Batch of 2024'
    },
    {
        name: 'Sakshi Bansal',
        image: 'sakshi_bansal.jpeg',
        email: '2021mcb1244@iitrpr.ac.in',
        linkedin: 'https://www.linkedin.com/in/sakshi-bansal-a0b132234/',
        instagram: 'https://www.instagram.com/sakshi_19603/',
        batch: 'Batch of 2025'
    }
];

export default function Page() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const handleImageError = (event) => {
        event.target.src = 'https://github.com/shadcn.png';
    };

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsPageLoading(false);
        }, 1000);

        return () => clearTimeout(loadingTimeout);
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
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
                                <div className="flex justify-center">
                                    <div>
                                        <div className="pt-12 pb-1 font-bold text-xl text-center">About Us</div>
                                        <div className="flex justify-center text-muted-foreground text-sm text-center w-full">
                                            <span className="w-[60%]">
                                                Infonest is a thoughtful initiative to organize and simplify the sharing of resources and materials among different student batches, making life a teeny tiny bit easier for everyone involved.
                                            </span>
                                        </div>
                                        <div>
                                            <div className="grid grid-cols-4 mt-2">
                                                {teamMembers.map(member => (
                                                    <div key={member.name} className="flex justify-center h-72 w-48 border-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-950 dark:hover:bg-slate-900 dark:hover:text-slate-50 m-6">
                                                        <div>
                                                            <div className="h-40 w-39 border mt-4">
                                                                <img src={member.image} alt={member.name} onError={handleImageError} className="h-40 border"></img>
                                                            </div>
                                                            <div className="text-md text-center mt-2 font-mono">
                                                                {member.name}
                                                            </div>
                                                            <div className="text-xs text-center text-muted-foreground">
                                                                {member.batch}
                                                            </div>
                                                            <div className="flex space-x-2 justify-center mt-6">
                                                                <a className="cursor-pointer" href={`mailto:${member.email}`} target="_blank"><MdEmail size={20} /></a>
                                                                <a className="cursor-pointer" href={member.linkedin} target="_blank"><FaLinkedin size={20} /></a>
                                                                <a className="cursor-pointer" href={member.instagram} target="_blank"><AiFillInstagram size={20} /></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-auto border-t py-2 px-6 flex justify-center items-center dark:bg-secondary font-bold text-md">
                                    Made with <div style={{ color: 'red' }} className="px-1">&#x2764;&#xFE0F;</div>
                                </div>
                            </>
                        )}

                    </ThemeProvider>
                </div>
            )}
        </div>
    );
}
