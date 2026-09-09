import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleMobile from "@/components/EditRoleMobile";
import Footer from "@/components/Footer";
import GeoUpdate from "@/components/GeoUpdate";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import connectDb from "@/lib/db";
import Grocery, { IGrocery } from "@/models/grocery.model";
import User from "@/models/user.model";
import { redirect } from "next/navigation";


// server componets
async function Home(props:{
  searchParams:Promise<{
    q:string
  }>
}) {

  const searchParams = await props.searchParams
  // console.log(searchParams)
  await connectDb();
  // auth ke ander sari session detail rahegi
  const session = await auth();
  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
  }

  const inComplte =
    !user.mobile || !user.role || (!user.mobile && user.role == "user");
  if (inComplte) {
    return <EditRoleMobile />;
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  let groceryList:IGrocery[]=[]

  if(user.role === 'user'){
    if(searchParams.q){
      groceryList = await Grocery.find({
        $or:[
          // option : 'i' --> indicated search capital or small
          { name: { $regex: searchParams?.q || "", $options: "i"}},
          { category: { $regex: searchParams?.q || "", $options: "i"}},
        ]
      })
    }else{
      groceryList = await Grocery.find({})
    }
  }

   const plainGrocery = JSON.parse(JSON.stringify(groceryList));



  return (
    <>
      <Nav user={plainUser} />
      <GeoUpdate userId={plainUser._id}/>

      {user.role == "user" ? (
        <UserDashboard
        groceryList={plainGrocery}
        />
      ) : user.role == "admin" ? (
        <AdminDashboard />
      ) : 
        <DeliveryBoy />
      }

      <Footer/>
    </>
  );
}

export default Home;
