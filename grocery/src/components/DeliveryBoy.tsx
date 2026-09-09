import connectDb from "@/lib/db"
import DeliveryBoyDashboard from "./DeliveryBoyDashboard"
import { auth } from "@/auth"
import Order from "@/models/order.model"

async function DeliveryBoy() {
  await connectDb()
  const session = await auth()
  const deliveryBoyId = session?.user?.id
  const orders = await Order.find({
    assignedDeliveryBoy:deliveryBoyId,
    deliveryOtpVefication:true
  })

  const today = new Date().toDateString()
  const todayOrders = orders.filter((o)=>new Date(o.deliveredAt).toDateString() === today).length
  // fixed earning delivery Boy 40 ruppes per order
  const todaysEarning = todayOrders * 40



  return (
    <>
      <DeliveryBoyDashboard
      earning={todaysEarning}
      />
    </>
  )
}

export default DeliveryBoy