'use client';

import { useEffect, useState } from 'react';
import NucleusScene from '@/components/nucleus-scene';
import { ThemeProvider } from "@/components/theme-provider";
import { NavigationBar } from '@/components/navigation-menu';
import LoadingIndicator from '@/components/loading-indicator/loading-indicator';

export default function Page() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showNucleusScene, setShowNucleusScene] = useState(true);

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsPageLoading(false);
        }, 1000);

        return () => clearTimeout(loadingTimeout);
    }, []);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1000);
            setShowNucleusScene(window.innerWidth > 1300);
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
                                <div className="flex h-[600px]">
                                    <div className="w-[50%] flex items-center px-16">
                                        <div className="border rounded-lg py-12 pr-24 dark:bg-slate-950">
                                            <div className="px-10 text-xl">Welcome to,</div>
                                            <div className="px-12 text-8xl font-bold">InfoNest</div>
                                            <div className="px-12 text-muted-foreground text-md">Your one stop destination for everything.</div>
                                        </div>
                                    </div>
                                    {showNucleusScene && (
                                        <div className="w-[50%] flex justify-center items-center">
                                            <NucleusScene />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                    </ThemeProvider>
                </div>
            )}
        </div>
    );
}
