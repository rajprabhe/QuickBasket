"use client"
import { Boxes, ClipboardCheck, LogOut, Menu, Package, PlusCircle, Search, ShoppingCartIcon, Sidebar, User, X } from "lucide-react"
import Link from "next/link"
import Image from 'next/image'
import { FormEvent, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from 'motion/react'
import { signOut } from "next-auth/react"
import { createPortal } from "react-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"


interface IUser{
    _id?:string,
    name: string,
    email: string,
    password?: string,
    mobile?: string,
    role: 'user' | 'deliverBoy' | 'admin',
    image?: string

}

// user data come from main file --> page.tsx
function Nav({user}:{user:IUser}) {
    const [open, setOpen] = useState(false)
    const profileDropDown = useRef<HTMLDivElement>(null)
    const [searchBarOpen, setSearchBarOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { cartData } = useSelector((state:RootState)=>state.cart)
    const [search, setSearch] = useState('')
    const router = useRouter()

    const handleSearch = (e:FormEvent) =>{
        e.preventDefault()
        const query = search.trim()
        if(!query){
            return router.push("/")
        }

        router.push(`?q=${encodeURIComponent(query)}`)
        setSearch("")
        setSearchBarOpen(false)

    }

    /**
     * Bilkul bhai. Ye code profile dropdown ke bahar click karne par dropdown close karne ke liye hai.

useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        if (
            profileDropDown.current &&
            !profileDropDown.current.contains(e.target as Node)
        ) {
            setOpen(false)
        }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => document.removeEventListener("mousedown", handleClickOutside)
}, [])
1. useEffect(..., [])
useEffect(() => {
   ...
}, [])

[] ka matlab: component mount hone par ek baar ye code chalega.

2. handleClickOutside
const handleClickOutside = (e: MouseEvent) => {

Ye ek function hai jo mouse click hone par chalega.

e ke andar click ki information hoti hai.

Example:

e.target

batata hai ki exactly kis element par click hua.

3. profileDropDown.current

Usually ref aisa bana hota hai:

const profileDropDown = useRef<HTMLDivElement>(null)

Aur JSX:

<div ref={profileDropDown}>
   Profile
   <Dropdown />
</div>

profileDropDown.current actual DOM element ko point karega.

Matlab:

profileDropDown.current
        ↓
<div>
   Profile Dropdown
</div>
4. contains()

Main logic ye hai:

!profileDropDown.current.contains(e.target as Node)

contains() check karta hai:

Kya clicked element dropdown ke andar hai?

Agar dropdown ke andar click:
<div ref={profileDropDown}>
    Profile
    └── Logout ← click
</div>

Then:

profileDropDown.current.contains(e.target)

➡️ true

!true → false

So:

setOpen(false)

nahi chalega.

Agar dropdown ke bahar click:
<div ref={profileDropDown}>
    Profile
    Dropdown
</div>

<button>Outside</button> ← click

Then:

profileDropDown.current.contains(e.target)

➡️ false

!false → true

So:

setOpen(false)

➡️ Dropdown close.

5. Ye condition poori samjho
if (
    profileDropDown.current &&
    !profileDropDown.current.contains(e.target as Node)
) {
    setOpen(false)
}

Iska simple meaning:

Agar dropdown ka element exist karta hai AND click dropdown ke bahar hua hai, toh dropdown close kar do.

6. addEventListener
document.addEventListener("mousedown", handleClickOutside)

Ye browser ke document par listener laga raha hai.

Matlab page par kahin bhi mouse button press hoga, handleClickOutside execute hoga.

Flow:

User clicks anywhere
       ↓
mousedown event
       ↓
handleClickOutside()
       ↓
Check: click dropdown ke andar hai?
       ↓
     ┌───────┴───────┐
    YES             NO
     ↓               ↓
  kuch nahi      setOpen(false)
                     ↓
              Dropdown close
7. return cleanup ke liye
return () => {
    document.removeEventListener("mousedown", handleClickOutside)
}

Jab component unmount hoga, listener remove kar diya jayega.

Agar remove nahi karoge, purane event listeners accumulate ho sakte hain.

8. e.target as Node kya hai?

TypeScript mein:

e.target

ka type generally EventTarget | null hota hai.

Lekin:

contains()

ko Node chahiye.

Isliye:

e.target as Node

TypeScript ko bol raha hai:

"Mujhe pata hai ki e.target ek DOM Node hai."

Ye TypeScript type assertion hai. Runtime par koi conversion nahi karta.

Short mein

Ye pura code basically:

Dropdown open hai
      ↓
User kahin click karta hai
      ↓
Click dropdown ke andar?
   ↙          ↘
 YES          NO
 ↓             ↓
Stay open   setOpen(false)
             ↓
           Close

Real-world example: Instagram/YouTube ke profile menu mein profile icon click karke menu open karo, phir menu ke bahar click karo → menu automatically close ho jata hai
     */
    useEffect(()=>{
        const handleClickOutside = (e:MouseEvent)=>{
            if(profileDropDown.current && !profileDropDown.current.contains(e.target as Node)){
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    },[])



    // createPortal --> provide react-dom
    // it is independent from all Dom element
    // it is run separate without css conflict other element
    const sideBar = menuOpen ? createPortal(
        <AnimatePresence>
            <motion.div
            initial={{x:-100, opacity:0}}
            animate={{x:0, opacity:1}}
            exit={{x:-100}}
            transition={{type:"spring", stiffness:100, damping:14}}
            className="fixed top-0 left-0 h-full w-[75%] sm:w-[60%] z-9999
            bg-linear-to-b from-green-800/90 via-green-700/80 to-green-900/90
            backdrop-blur-xl border-r border-green-400/20
            shadow-[0_0_50px_-10px_rgba(0,255,100,0.3)]
            flex flex-col p-6 text-white
            md:hidden"
            >
                <div className="flex justify-between items-center mb-2">
                    <h1 className="font-extrabold text-2xl tracking-wide text-white/90">
                        Admin Panel
                    </h1>
                    <button onClick={()=>setMenuOpen(false)}
                    className="text-white/80 hover:text-red-400 text-2xl font-bold cursor-pointer transition">
                        <X/>
                    </button>
                </div>

                {/* image  */}
                <div className="flex items-center gap-3 p-3 mt-3 rounded-xl bg-white/10 hover:bg-white/15
                transition-all shadow-inner">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2
                    border-green-400/60 shadow-lg">
                          {user.image ? <Image src={user.image} alt='user' fill className="object-cover"/> 
                          : <User/>}
                    </div>     
                    <div>
                        <h2 className="text-lg font-semibold text-white">{user.name}</h2>
                        <p className="text-xs text-green-200 capitalize tracking-wide">{user.role}</p>
                    </div> 
                </div>


                <div className="flex flex-col gap-3 font-medium mt-6">
   
                    <Link href={"/admin/add-grocery"}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/10
                    hover:bg-white/20 hover:pl-4 transition-all"
                    >
                     <PlusCircle className="h-5 w-5"/>
                        Add Grocery  
                    </Link>

                    <Link href={"/admin/view-grocery"}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/10
                    hover:bg-white/20 hover:pl-4 transition-all"
                    >
                    <Boxes className="h-5 w-5"/>  
                        View Grocery  
                    </Link>


                    <Link href={"/admin/manage-orders"}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/10
                    hover:bg-white/20 hover:pl-4 transition-all"
                    > 
                    <ClipboardCheck className="h-5 w-5"/>
                        Manage Orders  
                    </Link>

                </div>

                {/* border line */}
                <div className="my-5 border-t border-white/20"></div>

                {/* logout buttton */}
                <div onClick={async ()=> await signOut({callbackUrl:"/login"})}
                className="flex items-center gap-3 text-red-300 font-semibold mt-auto hover:bg-red-500/20
                p-3 rounded-lg transition-all">
                    <LogOut className="w-5 h-5 text-red-300"/>
                    Log Out
                </div>
            </motion.div>

        </AnimatePresence>,
        //  pure page par lagana hai
        document.body
    ) : null

  return (
    <>
    <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500
    to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 
    md:px-8 z-50">
        
        <Link href={"/"}
        // sm --> small device
        className="text-white font-extrabold text-2xl sm:text-3xl tracking-wider
        hover:scale-105 transition-transform"
        >
           QuickBasket
        </Link> 

        {/* only user see search bar */}
        {user.role == "user" &&
        // seach grocery   
        <form className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md"
        onSubmit={handleSearch}
        >
        <Search className="text-gray-500 w-5 h-5 mr-2"/>
        <input type="text" placeholder="Search groceries..." className="w-full outline-none text-gray-700 placeholder-gray-400"
        onChange={(e)=>setSearch(e.target.value)}
        value={search}
        />
        </form>  
        }
        

        {/* image and shopping cart */}
        <div className="flex items-center gap-3 md:gap-6 relative">

            {/* only user see this  */}
            {user.role == "user" && 
            <>

             {/* small device search option  */}
            <div className="bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md
            hover:scale-105 transition md:hidden"
            onClick={()=>setSearchBarOpen((prev)=> !prev)}
            >
                <Search className="text-green-600 w-6 h-6"/>
            </div>

            {/* shoping icon */}
            <Link href={"/user/cart"}
            className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md
            hover:scale-105 transition"
            >
            <ShoppingCartIcon className="text-green-600 w-6 h-6"/>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex
            items-center justify-center rounded-full font-semibold shadow">
                {cartData.length}
            </span>
            </Link>
            
            </>
            }


            {/* only for admin */}
            {user.role == "admin" && 
            <>
            {/* big device visible */}
            <div className="hidden md:flex items-center gap-4">

                <Link href={"/admin/add-grocery"}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4
                py-2 rounded-full hover:bg-green-100 transition-all"
                >
                  <PlusCircle className="h-5 w-5"/>
                  Add Grocery  
                </Link>

                <Link href={"/admin/view-grocery"}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4
                py-2 rounded-full hover:bg-green-100 transition-all"
                >
                  <Boxes className="h-5 w-5"/>  
                  View Grocery  
                </Link>


                <Link href={"/admin/manage-orders"}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4
                py-2 rounded-full hover:bg-green-100 transition-all"
                > 
                  <ClipboardCheck className="h-5 w-5"/>
                  Manage Orders  
                </Link>
            </div>

            {/* small device visible */}
            <div className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
            onClick={() => setMenuOpen(prev => !prev)}
            >
                <Menu className="text-green-600  w-6 h-6"/>
            </div>
            </>
            }

            

            {/* image */}
            <div className="relative" ref={profileDropDown}>
            <div className="bg-white rounded-full w-11 h-11 flex items-center justify-center overflow-hidden
            shadow-md hover:scale-105 transition-transform relative"
            onClick={()=>setOpen(prev => !prev)}>
                {user.image ? <Image src={user.image} alt='user' fill className="object-cover"/> 
                : <User/>}
            </div>
            <AnimatePresence>
                {open && 
                <motion.div
                initial={{
                opacity:0,
                y:-10,
                scale:0.95
                }}
                animate={{
                opacity:1,
                y:0,
                scale:1
                }}
                transition={{
                duration:0.4
                }}
                exit={{
                opacity:0,
                y:-10,
                scale:0.95 
                }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border
                border-gray-200 p-3 z-999"
                >
                <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
                    <div className="w-10 h-10 relative rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                        {user.image ? <Image src={user.image} alt='user' fill className="object-cover"/> 
                         : <User/>}
                    </div>
                    <div >
                        <div className="text-gray-800 font-semibold">{user.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                </div>

                {user.role == "user" &&
                <Link href={"/user/my-orders"} className="flex items-center gap-2 px-3 py-3 hover:bg-green-50 rounded-lg text-gray-700 font-medium"
                onClick={() => setOpen(false)}>
                    <Package className="w-5 h-5 text-green-600"/>
                    My Orders
                </Link>
                }
                
                <button className="flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-50 rounded-lg
                text-gray-700 font-medium"
                onClick={()=> {
                    setOpen(false)
                    signOut({callbackUrl:"/login"})
                }}
                >
                    <LogOut className="w-5 h-5 text-red-500"/>
                     Log Out
                </button>
                </motion.div>
                }
            </AnimatePresence>

            {/* small device code for seach bar */}
            <AnimatePresence>
                {searchBarOpen
                &&
                <motion.div
                initial={{
                opacity:0,
                y:-10,
                scale:0.95
                }}
                animate={{
                opacity:1,
                y:0,
                scale:1
                }}
                transition={{
                duration:0.4
                }}
                exit={{
                opacity:0,
                y:-10,
                scale:0.95 
                }}
                className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white
                rounded-full shadow-lg z-40 flex items-center px-4 py-2
                md:hidden"
                >
                    {/* small device serach bar */}
                    <Search className="text-gray-500 w-5 h-5 mr-2"/>
                    <form className="grow"
                    onSubmit={handleSearch}
                    >
                        <input type="text"  
                        placeholder="Search groceries..."
                        className="w-full outline-none text-gray-700"
                        onChange={(e)=>setSearch(e.target.value)}
                        value={search}
                        />
                    </form>
                    <button onClick={()=>setSearchBarOpen(false)}>
                        <X className="text-gray-500 w-5 h-5"/>
                    </button>
                </motion.div>
                }
            </AnimatePresence>
           
            
            </div>
        </div>

        {/* side bar for admin --> small device */}
       
    </div>
    {/*  independent code not conflit other Dom element */}
    {sideBar}
    </>
  )
}

export default Nav