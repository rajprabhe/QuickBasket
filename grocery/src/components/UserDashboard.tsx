import connectDb from "@/lib/db"
import CategorySlider from "./CategorySlider"
import HeroSection from "./HeroSection"
import Grocery from "@/models/grocery.model"
import GroceryItemCard from "./GroceryItemCard"


interface IGrocery {
  _id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

async function UserDashboard({groceryList}:{groceryList:IGrocery[]}) {



  // await connectDb()
  
  // const groceries = await Grocery.find({})
  // const plainGrocery = JSON.parse(JSON.stringify(groceryList));

  return (
    <>
        <HeroSection/>
        <CategorySlider/>
        <div className="w-[90%] md:w-[80%] mx-auto mt-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6
          text-center">
            Popular Grocery Items
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {groceryList.map((item:IGrocery, index:number) => (
            <GroceryItemCard key={item._id.toString()} item={item}/>
            ))}
          </div>
        </div>
        
    </>
  )
}

export default UserDashboard