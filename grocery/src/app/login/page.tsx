'use client'
import { EyeIcon, EyeOff, Leaf, Loader2, Lock, LogIn, Mail} from 'lucide-react'
import { motion } from "motion/react"
import Image from 'next/image'
import googleImage from '@/assets/google.webp' 
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'


function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showpassword, setShowpassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const session = useSession()

    // console.log(session)
    const handleLogin = async (e:React.FormEvent)=> {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await signIn("credentials",{
                email, password, redirect:false
            })           
       
            router.push("/")
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }

    }



  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6
    py-10 bg-white relative'>

        <motion.h1
        initial={{
            y:-10,
            opacity:0
        }}
        animate={{
            y:0,
            opacity:1
        }}
        transition={{
            duration:0.6
        }}
        className='text-4xl font-extrabold text-green-700 mb-2'>
            Welcome Back
        </motion.h1>

        <p className='text-gray-600 mb-8 flex items-center gap-1'>
            Login To QuickBasket  <Leaf className='w-5 h-5 text-green-600'/>
        </p>

        <motion.form
        onSubmit={handleLogin}
        initial={{
            opacity:0
        }}
        animate={{
            opacity:1
        }}
        transition={{
            duration:0.6
        }}
        className='flex flex-col gap-5 w-full max-w-sm'
        >
             <div className='relative'>
                <Mail className='absolute left-3 top-3.5 w-5 h-5 text-gray' />
                <input 
                type="email" 
                placeholder='Your Email' 
                className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4
                text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
                />
            </div> 
            <div className='relative'>
                <Lock className='absolute left-3 top-3.5 w-5 h-5 text-gray' />
                <input 
                type={showpassword ? 'text' : 'password'} 
                placeholder='Your Password' 
                className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4
                text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
                />
                {
                    showpassword ? <EyeOff className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 
                    cursor-pointer' onClick={()=>setShowpassword(false)}/>
                    :
                    <EyeIcon className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 
                    cursor-pointer' onClick={()=>setShowpassword(true)}/>
                }
            </div>

            {/* speacial function Immediately validation for button */}
            {
                // Immediately Invoked Function Expression
                (()=>{
                    const formValidation = email !== "" && password !== ""
                    return <button disabled={!formValidation || loading}
                    type='submit'
                    className={`w-full font-semibold py-3 rounded-xl transition-all
                    duration-200 shadow-md inline-flex items-center justify-center gap-2
                    ${formValidation 
                       ?"bg-green-500 hover:bg-green-700 text-white"
                       :"bg-gray-300 hover:bg-gray-500 cursor-not-allowed"
                       }
                    `}>
                        {/* animate-spin built in taiwind class */}
                       {loading? <Loader2 className='w-5 h-5 animate-spin'/>: "Login"}    
                    </button>

                })()
            }

            <div className='flex items-center gap-2 text-gray-400 text-sm mt-2'>
                <span className='flex-1 h-px bg-gray-200'></span>
                OR
                <span className='flex-1 h-px bg-gray-200'></span>
            </div>

            <div className='w-full flex items-center justify-center gap-3 border border-gray-300 cursor-pointer
            hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200'
            onClick={()=>signIn("google", {callbackUrl:"/"})}
            >
                <Image src={googleImage} width={20} height={20} alt='google'/>
                Continue with Google
            </div>

            <p onClick={()=>router.push('/register')}
            className='cursor-pointer text-gray-600 mt-6 text-sm flex justify-center items-center gap-1'>
                Want to create an account ? <LogIn className='w-4 h-4'/>
                <span className='text-green-600'>Sign Up</span>
            </p>
             
        </motion.form>
    </div>
  )
}

export default Login