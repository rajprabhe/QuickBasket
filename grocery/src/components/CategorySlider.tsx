'use client'
import { Apple, Baby, Box, ChevronLeft, ChevronRight, Coffee, Cookie, Flame, Heart, Home, Milk, Wheat } from 'lucide-react'
import { motion } from "motion/react"
import { useEffect, useRef, useState } from 'react';

function CategorySlider() {
  const categories = [
    { id: 1, name: "Fruits & Vegetables", icon: Apple, color: "bg-green-100" },
    { id: 2, name: "Dairy & Eggs", icon: Milk, color: "bg-yellow-100" },
    { id: 3, name: "Rice, Atta & Grains", icon: Wheat, color: "bg-orange-100" },
    { id: 4, name: "Snacks & Biscuits", icon: Cookie, color: "bg-pink-100" },
    { id: 5, name: "Spices & Masalas", icon: Flame, color: "bg-red-100" },
    { id: 6, name: "Beverages & Drinks", icon: Coffee, color: "bg-blue-100" },
    { id: 7, name: "Personal Care", icon: Heart, color: "bg-purple-100" },
    { id: 8, name: "Household Essentials", icon: Home, color: "bg-lime-100" },
    { id: 9, name: "Instant & Packaged Food", icon: Box, color: "bg-teal-100" },
    { id: 10, name: "Baby & Pet Care", icon: Baby, color: "bg-rose-100" },
  ];

  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (direction:"left" | "right") => {
    if(!scrollRef.current) return
    const scrollAmount = direction == "left" ? -300 : 300
    // console.log(scrollRef.current)
    // console.log(scrollRef.current.scrollBy())
    scrollRef.current.scrollBy({left:scrollAmount, behavior:"smooth"})
  }

  const [showleft, setShowLeft] = useState<Boolean>()
  const [showRight, setShowRight] = useState<Boolean>()
  const checkScroll = () => {
    if(!scrollRef.current) return
    // console.log("scrollWidth", scrollRef.current.scrollWidth)
    // console.log("clientwidth", scrollRef.current.clientWidth)
    // console.log("scrollLeft", scrollRef.current.scrollLeft)
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 0)
    setShowRight((scrollLeft + clientWidth) < scrollWidth)
  }


  useEffect(()=>{
    const autoScroll = setInterval(()=>{
        if(!scrollRef.current) return
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        if((scrollLeft + clientWidth) > scrollWidth){
            scrollRef.current.scrollTo({left:0, behavior:"smooth"})
        }else{
            scrollRef.current.scrollBy({left:300, behavior:"smooth"})
        }
    },2000)
    return ()=> clearInterval(autoScroll)
  },[])

  useEffect(()=>{
    scrollRef.current?.addEventListener("scroll",checkScroll)
    checkScroll()
    return ()=> removeEventListener("scroll", checkScroll)
  },[])

  return(
    <motion.div
    initial={{opacity:0, y:50}}
    whileInView={{opacity:1, y:0}}
    transition={{duration:0.6}}
    viewport={{once:false, amount:0.5}}
    className='w-[90%] md:w-[80%] mt-10 mx-auto relative'
    >
        <h2 className='text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center'>
            🛒 Shop by Category
        </h2>

        {showleft &&
        <button className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg
        hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center
        transition-all'
        onClick={()=>scroll("left")}
        >
            <ChevronLeft className='w-6 h-6 text-green-700'/>
        </button>
        }

        <div ref={scrollRef}
        className='flex gap-6 overflow-x-auto px-10 pb-4 scrollbar-hide scroll-smooth '>
           {categories.map((cat)=>{
            const Icon = cat.icon
            return <motion.div
            key={cat.id}
            className={`min-w-[150px] md:min-w-[180px] flex flex-col items-center justify-center rounded-2xl
                ${cat.color} shadow-md hover:shadow-xl transition-all cursor-pointer`}
            >
                <div className='flex flex-col items-center justify-center p-5'>
                    <Icon className='w-10 h-10 text-green-700 mb-3'/>
                    <p className='text-center text-sm md:text-base font-semibold text-gray-700'>{cat.name}</p>
                </div> 
            </motion.div>
           })} 
        </div>

        {showRight &&
        <button className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg
        hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center
        transition-all'
        onClick={()=>scroll("right")}
        >
            <ChevronRight className='w-6 h-6 text-green-700'/>
        </button>
        }

         
        
    </motion.div>
  )
}

export default CategorySlider;


/**

const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

Here, scrollRef.current is usually a DOM element, for example a <div> that has horizontal scrolling.

Suppose:

<div ref={scrollRef} className="overflow-x-auto">
    ...
</div>

Then:

scrollRef.current

means the actual <div> element.

1. scrollLeft
scrollRef.current.scrollLeft

This tells you how far the element has been scrolled horizontally from the left.

Example:

|------------------------------|
      ← content →
       ↑
     viewport

If the user hasn't scrolled:

scrollLeft = 0

If they scroll 200px to the right:

scrollLeft = 200
2. scrollWidth
scrollRef.current.scrollWidth

This is the total width of all the content, including the part that is currently hidden because of scrolling.

Example:

Total content width = 1000px


|--------------------|
      visible area
|------------------------------|
          total content

So:

scrollWidth = 1000
3. clientWidth
scrollRef.current.clientWidth

This is the width of the visible area/container.

For example:

Container
┌──────────────────────┐
│   visible content    │
└──────────────────────┘
        500px

Then:

clientWidth = 500
Why are they often used together?

Suppose:

scrollWidth = 1000
clientWidth = 500
scrollLeft = 200

The maximum possible horizontal scroll is:

scrollWidth - clientWidth

So:

1000 - 500 = 500

That means:

scrollLeft = 0       → at the beginning
scrollLeft = 250     → somewhere in the middle
scrollLeft = 500     → at the end

That's why you often see:

const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;


const isAtEnd = scrollLeft + clientWidth >= scrollWidth;

The logic is:

current position + visible width
             ↓
        scrollLeft + clientWidth
             ↓
        total content width?
             ↓
       scrollWidth

If they're equal (or very close), you've reached the right end.

In short
Property	Meaning
scrollLeft	How far you've scrolled horizontally
scrollWidth	Total width of the content
clientWidth	Visible width of the container

So this:

const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

is simply a shorter way of writing:

const scrollLeft = scrollRef.current.scrollLeft;
const scrollWidth = scrollRef.current.scrollWidth;
const clientWidth = scrollRef.current.clientWidth;

The { ... } syntax here is object destructuring.

why not scrollRigth

Because scrollRight is not a built-in DOM property.

The browser gives you:

element.scrollLeft
element.scrollWidth
element.clientWidth

but not:

element.scrollRight // ❌ doesn't exist
Why only scrollLeft?

Horizontal scrolling is represented by the position of the left edge of the visible area.

For example:

Full content
┌──────────────────────────────────────────────┐
│                                              │
│        HIDDEN        │      VISIBLE          │
│                      │                       │
└──────────────────────┴───────────────────────┘
                       ↑
                  scrollLeft

If you scroll right, the left position moves to the right.

So the browser stores:

scrollLeft = 300;

meaning:

"The visible area has moved 300px from the original left position."

Then how do we calculate the right side?

You calculate it yourself:

const scrollRight = scrollWidth - clientWidth - scrollLeft;

For example:

scrollWidth = 1000;
clientWidth = 400;
scrollLeft = 300;

Then:

scrollRight
= 1000 - 400 - 300
= 300

So there are 300px remaining on the right.

Visual
Total content = 1000px


┌──────────────┬────────────────────┬──────────────┐
│   scrolled   │     visible        │   remaining  │
│    300px     │      400px         │     300px    │
└──────────────┴────────────────────┴──────────────┘
       ↑                ↑                  ↑
   scrollLeft       clientWidth       scrollRight

So:

const scrollRight =
    scrollWidth - clientWidth - scrollLeft;

Key idea: scrollLeft is the actual browser property; scrollRight is something you calculate when you need it.
 */

/**
These two methods are very similar, but the important difference is:

scrollTo() → go to a specific position
scrollBy() → move by a certain amount from the current position

Assume:

scrollRef.current

is your horizontally scrollable <div>.

1. scrollTo()
scrollRef.current.scrollTo({
    left: 0,
    behavior: "smooth"
});

This means:

"Go to horizontal position 0."

So if you are currently here:

0        300        600        900
|---------|----------|----------|
                ↑
           current position

After:

scrollTo({ left: 0 })

you go back to:

0        300        600        900
|---------|----------|----------|
↑
current position

So scrollTo() uses an absolute position.

For example:

scrollTo({ left: 500 })

means:

Go directly to position 500.

2. scrollBy()
scrollRef.current.scrollBy({
    left: 300,
    behavior: "smooth"
});

This means:

"Move 300px to the right from where you currently are."

Suppose currently:

0        300        600        900
|---------|----------|----------|
          ↑
       scrollLeft = 300

Then:

scrollBy({ left: 300 })

moves another 300px:

0        300        600        900
|---------|----------|----------|
                     ↑
                scrollLeft = 600

So:

scrollTo → "Go THERE"
scrollBy  → "Move THIS MUCH"
Very important difference

If current position is 400:

scrollTo({ left: 300 })

Result:

400 → 300

But:

scrollBy({ left: 300 })

Result:

400 → 700
What does behavior: "smooth" do?

Without it:

scrollRef.current.scrollTo({ left: 0 });

It jumps immediately.

With:

scrollRef.current.scrollTo({
    left: 0,
    behavior: "smooth"
});

it animates smoothly to that position.

So your two lines can be thought of as:

// Go back to the beginning
scrollRef.current.scrollTo({
    left: 0,
    behavior: "smooth"
});


// Move 300px to the right
scrollRef.current.scrollBy({
    left: 300,
    behavior: "smooth"
});

This is commonly used for carousel/slider left and right buttons.


Question --> why rigth here

If you're asking why left: 300 moves the content to the right, this is the confusing part.

left does not mean "move left."

It means:

Set/change the horizontal scroll position (scrollLeft).

Think of left as a coordinate
scrollRef.current.scrollBy({
    left: 300
});

means:

Increase scrollLeft by 300.

So:

Before:
scrollLeft = 0


After:
scrollLeft = 300

When scrollLeft increases, you see content that is further to the right.

CONTENT
──────────────────────────────────────
       [visible area]
       ↓
       ┌───────────┐
       │           │
       └───────────┘
       0


After scrollBy({ left: 300 })


CONTENT
──────────────────────────────────────
                   [visible area]
                   ↓
                   ┌───────────┐
                   │           │
                   └───────────┘
                   300

So:

left: 300

➡️ increases the horizontal scroll position
➡️ viewport moves right
➡️ you see content on the right

And left: -300?
scrollRef.current.scrollBy({
    left: -300
});

This decreases scrollLeft:

scrollLeft: 600
      ↓
scrollLeft: 300

So the viewport moves left.

Therefore:

left: 300   // move viewport right ➡️
left: -300  // move viewport left ⬅️

The word left refers to the horizontal scroll coordinate, not the direction of movement.


Question --> my point say scrollTo({ rigth: 300 }) exists


No — scrollTo({ right: 300 }) does not exist for the DOM Element.scrollTo() API.

Valid options are:

element.scrollTo({
  left: 300,
  behavior: "smooth"
});

or vertical scrolling:

element.scrollTo({
  top: 300,
  behavior: "smooth"
});

There is no right property:

element.scrollTo({
  right: 300 // ❌ invalid
});
Why?

The browser represents horizontal scroll position using scrollLeft:

left side                              right side
    ↓                                      ↓
    0 ─────────────── 300 ─────────────── 600
                      ↑
                  scrollLeft

So if you want to go 300px from the right, you calculate it:

const { scrollWidth, clientWidth } = scrollRef.current;


scrollRef.current.scrollTo({
  left: scrollWidth - clientWidth - 300,
  behavior: "smooth"
});

This means:

"Go to a position where 300px remains on the right."

So remember:

scrollTo({ left })  ✅
scrollTo({ top })   ✅


scrollTo({ right }) ❌
scrollTo({ bottom }) ❌

right and bottom are common in CSS positioning, but they are not properties of scrollTo().
 */