'use client';

import axios from 'axios'
import { max } from 'moment';
axios.defaults.withCredentials = true;
import { toast } from 'react-toastify';
import { useImage } from "@/store/image";
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SiInformatica } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import GoogleLogin from "@stack-pulse/next-google-login"
import { ThemeProvider } from "@/components/theme-provider"
import LoadingIndicator from '@/components/loading-indicator/loading-indicator'
import { IFrame } from './iframe';

interface ImageData {
    setImage: (image: string) => void;
    imageUrl: string;
}

export default function Page() {

    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoginCompleted, setIsLoginCompleted] = useState(false);
    const router = useRouter();
    const { setImage, imageUrl } = useImage() as ImageData;
    const [cookies, setCookie, removeCookie] = useCookies(['_auth_resource_tkn']);
    const [isMobile, setIsMobile] = useState(false);

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

    const notifySuccess = (message: string) => {
        toast.success(message);
    };

    const notifyError = (message: string) => {
        toast.error(message);
    }

    const responseGoogle = async (response: any) => {
        setIsPageLoading(true)

        const bodyObject = {
            authId: response.tokenObj.id_token
        };

        try {
            setImage(response.profileObj.imageUrl)
            const result = await axios.post(`${process.env.BACKEND_URL}/api/v1/user/google-login`, bodyObject, { withCredentials: true });
            const cookies = result.data.cookies.split("=")[1]

            setCookie('_auth_resource_tkn', cookies, {
                maxAge: 60 * 60 * 24
            });

            localStorage.setItem('authToken', result.data.token);
            notifySuccess(result.data.message)
            router.push('/')
            setIsLoginCompleted(true)
        }
        catch (e: any) {
            console.log(e);
            // notifyError(e.response.data.message)
        }
    }

    
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

                        {isPageLoading || isLoginCompleted ? (
                            <LoadingIndicator />
                        ) : (
                            <>
                                <div className="flex h-screen">
                                    <Skeleton className="w-[50%]">
                                        <div className="h-full">
                                            <div className="flex items-center p-10">
                                                <SiInformatica size={40} />
                                                <p className="ml-2 text-2xl font-bold">InfoNest</p>
                                            </div>
                                            <div className="h-[70%]"></div>
                                            <div className="px-8 font-bold text-lg">Good to see you back.</div>
                                        </div>
                                    </Skeleton>
                                    <div className="w-[50%] flex justify-center items-center">
                                        <div >
                                            <div className="text-2xl font-bold text-center">Account Sign In</div>
                                            <div className="text-md text-muted-foreground text-center py-1">Click the button below to log in to your account.</div>
                                            <div className="px-4">
                                                {/* <Button variant="outline" className="w-full">
                                            <FaGoogle size={18} className="mx-2" />
                                            Sign In with Google
                                        </Button> */}

                                                {/* <IFrame id='ok' className = 'h-[65px] ml-24'> */}
                                                    {/* <meta name="color-scheme" content="light dark"></meta> */}
                                                    <GoogleLogin
                                                        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
                                                        buttonText="Sign in with Google"
                                                        onSuccess={responseGoogle}
                                                        onFailure={responseGoogle}
                                                        cookiePolicy={'single_host_origin'}
                                                        className = 'w-full flex items-center justify-center' 
                                                    >
                                                    </GoogleLogin>
                                                {/* </IFrame> */}
                                            </div>
                                            <div className="text-muted-foreground text-center py-1 text-xs">
                                                Join the <span className="font-bold">Infonest</span> community.
                                                <br /> Your one-stop solution for everything.
                                            </div>
                                        </div>
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
