import connectDb from "@/lib/db"
import AdminDashboardClient from "./AdminDashboardClient"
import Order from "@/models/order.model"
import User from "@/models/user.model"
import Grocery from "@/models/grocery.model"



async function AdminDashboard() {
  await connectDb()
  const orders = await Order.find({})
  const users = await User.find({role:"user"})
  const groceries = await Grocery.find({})

  const totalOrders = orders.length
  const totalCustomers = users.length
  const pendingDeliveries = orders.filter((o)=> o.status === "pending").length
  const totalRevenue = orders.reduce((sum, o)=> sum + (o.totalAmount || 0), 0)

  // find today date
  const today = new Date()
  const startOfToday = new Date(today)
  startOfToday.setHours(0,0,0,0)

  // find 7 days ago date
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate()-6)

  // find today revenue
  const todayOrders = orders.filter((o)=> new Date(o.createdAt) >= startOfToday)
  const todaysRevenue = todayOrders.reduce((sum, o)=> sum + (o.totalAmount || 0), 0)

  // find 7 days revenue
  const sevenDaysOrders = orders.filter((o)=> new Date(o.createdAt) >= sevenDaysAgo)
  const sevenDaysRevenue = sevenDaysOrders.reduce((sum, o)=> sum + (o.totalAmount || 0), 0)


  const stats = [
    { title: "Total Orders", value: totalOrders},
    { title: "Total Customers", value: totalCustomers},
    { title: "Pending Deliveries", value: pendingDeliveries},
    { title: "Total Revenue", value: totalRevenue}
  ]


  const chartData = []
  
  for(let i = 6; i >= 0; i--){

    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0,0,0,0)

    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate()+1)

    const ordercount = orders.filter((o)=> new Date(o.createdAt) >= date && new Date(o.createdAt) < nextDay).length
   
    chartData.push({
      day:date.toLocaleDateString("en-US",{weekday:"short"}),
      orders:ordercount
    })
  }





  return (
    <>
      <AdminDashboardClient
      earning={{
        today:todaysRevenue,
        sevenDays:sevenDaysRevenue,
        total:totalRevenue
      }}
      stats={stats}
      chartdata={chartData}

      />
    </>
  )
}

export default AdminDashboard


/**

Last 7 days ke liye har din kitne orders aaye, wo count karna.

Tumhara code basically date range banata hai → orders filter karta hai → chartData me result store karta hai.

1. Start
const chartData = []

Initially:

chartData = []

Isme hum baad me 7 objects dalenge:

[
  { day: "Fri", orders: 5 },
  { day: "Sat", orders: 8 },
  ...
]
2. Loop i = 6 se 0
for(let i = 6; i >= 0; i--)

Ye total 7 times chalega:

i = 6
i = 5
i = 4
i = 3
i = 2
i = 1
i = 0

Kyun?

Kyuki tumhe last 7 days chahiye.

Aaj maan lo:

Friday, 4 September 2026

To:

i	Date
6	Aug 29
5	Aug 30
4	Aug 31
3	Sep 1
2	Sep 2
1	Sep 3
0	Sep 4

So i basically bol raha hai:

"Aaj se kitne din peeche jana hai?"

3. Current date create hoti hai
const date = new Date()

Suppose abhi:

September 4, 2026 12:30 PM

Then:

date = Sep 4, 2026 12:30 PM
4. setDate() se peeche jaate hain
date.setDate(date.getDate() - i)

Suppose:

i = 2

Then:

date.getDate()

returns:

4

Then:

4 - 2 = 2

So date becomes:

September 2, 2026 12:30 PM
5. Important: setHours(0,0,0,0)
date.setHours(0,0,0,0)

Ye time ko midnight kar deta hai:

September 2, 2026 12:30 PM

becomes:

September 2, 2026 00:00:00

Why?

Because hume poora din check karna hai.

Matlab:

Sep 2 00:00
       ↓
Sep 3 00:00

ke beech ke orders chahiye.

6. nextDay kya hai?
const nextDay = new Date(date)

Yaha date ki copy ban rahi hai.

Suppose:

date = Sep 2 00:00

Then:

nextDay = Sep 2 00:00

Then:

nextDay.setDate(nextDay.getDate() + 1)

So:

nextDay = Sep 3 00:00

Ab hamare paas range hai:

Sep 2 00:00
      ↓
Sep 3 00:00
7. Orders filter

Ye sabse important part hai:

const ordercount = orders.filter(
  (o) =>
    new Date(o.createdAt) >= date &&
    new Date(o.createdAt) < nextDay
)

Iska simple meaning:

Sirf wahi orders nikalo jo us particular day ke andar aaye hain.

Dry Run

Maan lo orders me ye data hai:

const orders = [
  { createdAt: "2026-09-02T10:00:00" },
  { createdAt: "2026-09-02T15:30:00" },
  { createdAt: "2026-09-03T09:00:00" },
  { createdAt: "2026-09-04T11:00:00" }
]

Aur currently:

date = Sep 2 00:00
nextDay = Sep 3 00:00

Ab filter ek-ek order check karega.

Order 1
Sep 2 10:00

Check:

Sep 2 10:00 >= Sep 2 00:00   ✅

Sep 2 10:00 < Sep 3 00:00    ✅

So include.

Order 2
Sep 2 15:30
>= Sep 2 00:00   ✅
<  Sep 3 00:00   ✅

Include.

Order 3
Sep 3 09:00
>= Sep 2 00:00   ✅

< Sep 3 00:00    ❌

So exclude.

Order 4
Sep 4 11:00
>= Sep 2 00:00   ✅
< Sep 3 00:00    ❌

Exclude.

So:

ordercount = [
  { createdAt: "2026-09-02T10:00:00" },
  { createdAt: "2026-09-02T15:30:00" }
]

Therefore:

ordercount.length

is:

2

Complete Dry Run

Suppose today:

Friday, September 4

And orders:

Aug 29 → 3 orders
Aug 30 → 5 orders
Aug 31 → 2 orders
Sep 1  → 7 orders
Sep 2  → 4 orders
Sep 3  → 6 orders
Sep 4  → 8 orders

Loop chalega:

i = 6
date = Aug 29 00:00
nextDay = Aug 30 00:00

orders = 3

Push:

{
  day: "Sat",
  orders: 3
}
i = 5
date = Aug 30
nextDay = Aug 31

orders = 5

Push:

{
  day: "Sun",
  orders: 5
}
i = 4
Aug 31 → 2 orders
i = 3
Sep 1 → 7 orders
i = 2
Sep 2 → 4 orders
i = 1
Sep 3 → 6 orders
i = 0
Sep 4 → 8 orders

Finally:

chartData = [
  { day: "Sat", orders: 3 },
  { day: "Sun", orders: 5 },
  { day: "Mon", orders: 2 },
  { day: "Tue", orders: 7 },
  { day: "Wed", orders: 4 },
  { day: "Thu", orders: 6 },
  { day: "Fri", orders: 8 }
]

Ye data directly bar chart / line chart ko diya ja sakta hai.

Simple visualization
Sat  ███        3
Sun  █████      5
Mon  ██         2
Tue  ███████    7
Wed  ████       4
Thu  ██████     6
Fri  ████████   8
Overall concept ek line me:
Last 7 days
     ↓
Har din ki start date banao
     ↓
Uske next day ki date banao
     ↓
orders.filter() se us range ke orders nikalo
     ↓
ordercount.length
     ↓
chartData me {day, orders} store karo

Important: date = day ki starting boundary, aur nextDay = next day ki starting boundary. Isliye condition >= date && < nextDay use karna clean aur correct approach hai.
 */

