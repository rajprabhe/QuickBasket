'use client'
import { Leaf, ShoppingBasket, Smartphone, Truck } from "lucide-react"
import Image from "next/image"
import vegetableImage from '../assets/vegetable.avif'
import delivery from '../assets/del.avif'
import vege from '../assets/vege.avif'
import { useEffect, useState } from "react"
import { AnimatePresence } from "motion/react"
import { motion } from 'motion/react'
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getSocket } from "@/lib/socket"


function HeroSection() {

    
    
    const slides=[
        {
            id:1,
            icon: <Leaf className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-2xl-lg"/>,
            title:"Fresh Organic Groceries 🥦",
            subtitle:"Farm-fresh fruits, vegetables, and daily essentials delivered to you",
            btnText:"Shop Now",
            bg:"https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id:2,
            icon: <Truck className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-2xl-lg"/>,
            title:"Fast & Reliable delivery 🚚",
            subtitle:"we ensure your groceries reach your doorstep in no time",
            btnText:"Order Now",
            bg:"https://plus.unsplash.com/premium_photo-1683147625874-fbcbea60107c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI2fHxkZWxpdmVyeSUyMGJveXxlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            id:3,
            icon: <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-2xl-lg"/>,
            title:"Shop Anytime, Anywhere 📱",
            subtitle:"Easy and seamless online grocery Shopping experience",
            btnText:"Get Started",
            bg:"https://plus.unsplash.com/premium_photo-1741466800992-d6c2d2f76d2a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ]

    /**
     * Tumhare code ko line-by-line samjho:

const [current, setCurrent] = useState(0)
1. current kya hai?

current batata hai ki abhi kaunsi slide active hai.

Starting mein:

current = 0

Matlab slides[0] first slide show hogi.

setCurrent ka kaam current ki value change karna hai.

Example:

current = 0  → Slide 1
current = 1  → Slide 2
current = 2  → Slide 3
current = 3  → Slide 4
2. useEffect
useEffect(() => {
   ...
}, [])

useEffect ke andar hum timer setup kar rahe hain.

Aur [] ka matlab:

Component jab first time render/mount hoga, tab ye effect chalega.

Isliye timer baar-baar create nahi hoga.

3. setInterval
const timer = setInterval(() => {
    ...
}, 4000)

setInterval ka matlab:

Har 4000 milliseconds = 4 seconds mein andar wala code execute karo.

So:

0 sec  → current = 0
4 sec  → current = 1
8 sec  → current = 2
12 sec → current = 3
16 sec → current = ...
4. Ye sabse important line
setCurrent(prev => (prev + 1) % slides.length)

Isko tod ke samjho:

prev + 1

prev current ki previous value hai.

Suppose:

prev = 0

Then:

prev + 1
= 0 + 1
= 1

Next:

prev = 1

Then:

1 + 1 = 2

So slides aage move karti hain.

% slides.length kyun?

Ye bahut important hai.

Maan lo tumhare paas 4 slides hain:

slides.length = 4

Index:

0
1
2
3

Ab current 3 hai:

(prev + 1) % slides.length

Means:

(3 + 1) % 4
4 % 4
= 0

Toh:

Slide 1 → Slide 2 → Slide 3 → Slide 4
                         ↓
                       Slide 1

Yaani last slide ke baad wapas first slide.

Isliye % slides.length slider ko continuously loop karata hai.

5. prev kyun use kiya?
setCurrent(prev => ...)

React mein jab new state previous state ke basis par calculate karni ho, tab functional form use karte hain:

setCurrent(prev => prev + 1)

Ye basically bol raha hai:

"Jo current value abhi hai, usko lekar +1 kar do."

6. Cleanup
return () => clearInterval(timer)

Ye bhi bahut important hai.

Jab component screen se remove/unmount hota hai, React ye function chalata hai:

clearInterval(timer)

Matlab timer ko band kar do.

Agar cleanup nahi karoge, timer background mein chalta reh sakta hai aur unnecessary timers create ho sakte hain.

Pura flow

Suppose:

slides.length = 3

Toh:

Component render
      ↓
current = 0
      ↓
useEffect runs
      ↓
Timer starts
      ↓
4 seconds
      ↓
current = (0 + 1) % 3 = 1
      ↓
React re-render
      ↓
4 seconds
      ↓
current = (1 + 1) % 3 = 2
      ↓
React re-render
      ↓
4 seconds
      ↓
current = (2 + 1) % 3 = 0
      ↓
First slide again
Short mein
setInterval(..., 4000)

➡️ har 4 sec mein function chalao

setCurrent(...)

➡️ current slide change karo

prev + 1

➡️ next slide par jao

% slides.length

➡️ last slide ke baad first slide par wapas jao

clearInterval(timer)

➡️ component hatne par timer band karo.
     */

    const [current, setCurrent] = useState(0)
    useEffect(()=>{
        const timer = setInterval(()=>{
        setCurrent(prev => (prev + 1) % slides.length)
        },4000)

        return ()=> clearInterval(timer)
    },[])

  return (
    <div className="relative w-[98%] mx-auto mt-32 h-[80vh] rounded-3xl overflow-hidden shadow-2xl">
        <AnimatePresence mode='wait'>
            <motion.div
            key={current}
            initial={{opacity:0}}
            animate={{opacity:1}}
            transition={{duration:0.8}}
            exit={{opacity:0}}
            className="absolute inset-0"
            >
                <Image className="object-cover"
                src={slides[current]?.bg} fill alt='photo'  priority/>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"/>

            </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 flex items-center justify-center text-white px-6">
            <motion.div
            initial={{y:30, opacity:0}}
            animate={{y:0, opacity:1}}
            transition={{duration:0.6}}
            className="flex flex-col items-center justify-center gap-6 max-w-3xl"
            >
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-full shadow-lg"
                >{slides[current].icon}
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
                    {slides[current].title}
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 max-w-2xl">
                    {slides[current].subtitle}
                </p>
                <motion.button
                whileHover={{scale:1.09}}
                whileTap={{scale:0.96}}
                transition={{duration:0.2}}
                className="mt-4 bg-white text-green-700 hover:bg-green-100 px-8 py-3 rounded-full font-semibold
                shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                    <ShoppingBasket className="w-5 h-5"/>
                    {slides[current].btnText}
                </motion.button>
            </motion.div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((_, index)=>(
                <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                    index === current ? "bg-white w-6" : "bg-white/50"}`}
                />
            ))}
        </div>

    </div>
  )
}

export default HeroSection