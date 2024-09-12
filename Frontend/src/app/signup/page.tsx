"use client"

import {use, useEffect, useRef,useState} from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import resimg from '../assets/resource-image.avif'
import tick from '../assets/tick.png'
import user from '../assets/user.png'
import study from '../assets/study.png'
import mail from '../assets/mail.png'
import lock from '../assets/padlock.png'
import google from '../assets/google.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

const SignUp = () => {

  const nameRef=useRef<HTMLInputElement>(null);
  const emailRef=useRef<HTMLInputElement>(null);
  const passwordRef=useRef<HTMLInputElement>(null);
  const confirmPasswordRef=useRef<HTMLInputElement>(null);
  const router=useRouter()
  const [error,setError]=useState<string>('');
  const [emailStatus,setEmailStatus]=useState<boolean>(false);
  const [passwordStatus,setPasswordStatus]=useState<{status:boolean,message:string}>({status:false,message:''});
  const [loading,setLoading]=useState<boolean>(false);
  const [confirmPassword,setConfirmPassword]=useState<boolean>(false)

  const notifySuccess=(message:string)=>{
    toast.success(message);
  }
  
  const notifyError=(message:string)=>{
    toast.error(message);
  }

  const handleSignup = async (e:React.FormEvent) => {

    e.preventDefault();
    const email=emailRef.current?.value;
    const password=passwordRef.current?.value||'';
    
    if(!/@iitrpr\.ac\.in$/.test(emailRef.current?.value||'')){
      setEmailStatus(true);
      return;
    }

    if(password.length<8){
      setPasswordStatus({
        status:true,
        message:'Your password should be at least 8 characters long'
      })
      return;
    }
    if(!/[A-Z]/.test(password)||!/[a-z]/.test(password)||!/\d/.test(password)||!/[!@#$%^&*]/.test(password)){
      setPasswordStatus({
        status:true,
        message:'Your password should be at least 8 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters'
      })
      return;
    }
    else if(confirmPasswordRef.current?.value!==password){
      setConfirmPassword(true);
      return;
    }


    try {
      setError('');
      setLoading(true);

      // const res= await fetch('http://localhost:5000/api/v1/user/register',{
      //   method:'POST',
      //   headers:{
      //     'Content-Type':'application/json'
      //   },
      //   body:JSON.stringify({
      //     name:nameRef.current?.value,
      //     email:emailRef.current?.value,
      //     password:passwordRef.current?.value
      //   })
      // })

      // const response=await res.json();
      // console.log(response.data);

      // notifySuccess('Successfully signed up')

      const res=await axios.post('http://localhost:5000/api/v1/user/register',{
        name:nameRef.current?.value,
        email:emailRef.current?.value,
        password:passwordRef.current?.value
      })

      // console.log(res.data.data)

      notifySuccess(res.data.message)

      router.push('/login')
    } catch (error:any) {
      console.log(error)
      // notifyError(error.response.data.message)
      setError(error.message);
    }
    
    setLoading(false);
  };

  const handleGoogleSignup=()=>{
    
  }

  return (

    
    <>
        <div className="flex bg-white text-black fixed top-0 bottom-0 left-0 right-0">
          
            <div className=' w-6/12 hidden md:block m-auto '>
                <Image src={study} className=''  alt="" />
            </div>
            <div className='flex flex-col justify-center m-auto h-full' >
               
               <div className='md:w-[30vw] md:h-[max-content] flex flex-col rounded-lg border-2 border-grey p-5 lg:p-10' style={{boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'}}>
               <form onSubmit={handleSignup} className='flex flex-col'>
               <h1 className='text-center font-bold text-5xl m-8'>Sign Up</h1>
               
                {error&&<p className="text-red-600 mt-2 mb-2">{error}</p>}
                <div className="border-[1.5px] p-2 rounded-md divide-x flex mb-2 mt-2">
                  <Image src={user} className="w-6 m-1" alt="" />
                  <input  id='name' name='name' ref={nameRef} placeholder='Username' className="w-[100%] pl-2 outline-none" />
                </div>
                <div className={`border-[1.5px] p-2 rounded-md divide-x flex  mb-2 ${!emailStatus?'':'bg-red-100'}`}>
                  <Image src={mail} alt="" className="w-6 m-1"  />
                  <input type="email" name='email' ref={emailRef} placeholder='Email Id' className={!emailStatus?"w-[100%] pl-2 outline-none":"w-[100%] pl-2 outline-none bg-red-100"} onChange={()=>setEmailStatus(false)}/>
                </div>
                  {emailStatus&&<p className="text-red-600 mb-2">Please use institute email id</p>}

                <div className={`border-[1.5px] p-2 rounded-md divide-x flex  mb-2 ${!passwordStatus.status?'':'bg-red-100'}`}>
                <Image src={lock} className="w-6 m-1" alt="" />
                  <input type="password" name='password' ref={passwordRef} placeholder='Password'  className={!passwordStatus.status?"w-[100%] pl-2 outline-none":"w-[100%] pl-2 outline-none bg-red-100"} onChange={()=>setPasswordStatus({status:false,message:''})}/>
                </div>
                {passwordStatus.status&&<p className="text-red-600 mb-2">{passwordStatus.message}</p>}

                <div className={`border-[1.5px] p-2 rounded-md divide-x flex  mb-2 ${!confirmPassword?'':'bg-red-100'}`}>
                <Image src={lock} className="w-6 m-1" alt="" />
                  <input type="password" name='password'  ref={confirmPasswordRef} placeholder='Confirm Password'  className={!confirmPassword?"w-[100%] pl-2 outline-none":"w-[100%] pl-2 outline-none bg-red-100"} onChange={()=>setConfirmPassword(false)}/>
                </div>
                {confirmPassword&&<p className="text-red-600 mb-2">Passwords do not match</p>}
                <button disabled={loading} className='bg-[#BA988A]  p-2 mt-2 mb-2 rounded-md text-[white] hover:bg-[#5D4C45]'>Register</button>
                {/* {count&&<p className="text-cyan-900 mb-2">Retry in {count}s</p>} */}
                </form>
                <div className='mt-3 mb-2'><span>Already have an account  </span><button className='text-red-900 hover:text-red-600' onClick={()=>router.push('/login')}>Sign In</button></div>
                <p className="text-center border-b-2 leading-[0.1em] mt-4"><span className='bg-[white] pl-2 pr-2'>or</span></p>
               
                <button className=' p-2 mb-2 rounded-md border-[1.5px] border-slate-200 mt-6 hover:bg-slate-200 flex justify-center' onClick={handleGoogleSignup}><Image src={google} alt="" className='w-6 mr-4'/> Sign up with Google</button>
               </div>
        
            </div>
        </div>
       
        <ToastContainer position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"/>
       
    </>
  )
}

export default SignUp


