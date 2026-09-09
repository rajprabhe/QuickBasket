"use client";
import LiveMap from "@/components/LiveMap";
import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/user.model";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ArrowLeft, Loader, Send, Sparkle } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { IMessage } from "@/models/message.model";

interface IOrder {
  _id?:string;
  user: IUser;
  items: [
    {
      grocery:string;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    lontitude: number;
  };
  assignment?: string;
  assignedDeliveryBoy?: IUser;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

interface ILocation {
  latitude: number;
  longitude: number;
}

function TrackOrder({ params }: { params: { orderId: string } }) {
  const { userData } = useSelector((state: RootState) => state.user);
  const { orderId } = useParams();
  const [order, setOrder] = useState<IOrder>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [message, setMessage] = useState<IMessage[]>();

  const [suggestion, setSuggestion] = useState([]);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [message]);

  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get-order/${orderId}`);
        // console.log(result)
        setOrder(result.data);
        // user Location
        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.lontitude,
        });

        // delivery Boy location
        setDeliveryBoyLocation({
          latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
          longitude:
            result.data.assignedDeliveryBoy.location.coordinates[0],
        });
      } catch (error) {
        console.log(error);
      }
    };
    getOrder();
  }, [userData?._id]);

  const sendMsg = () => {
    const socket = getSocket();
    const message = {
      senderId: userData?._id,
      roomId: orderId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: newMessage,
    };

    socket.emit("send-message", message);

    setNewMessage("");
  };

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);
    socket.on("send-message", (message) => {
      if (message.roomId == orderId) {
        setMessage((prev) => [...prev!, message]);
      }
    });

    return () => {
      socket.off("send-message");
    };
  }, []);

  useEffect(() => {
    const getAllMessage = async () => {
      try {
        const result = await axios.post("/api/chat/message", {
          roomId: orderId,
        });
        // console.log(result.data)
        setMessage(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllMessage();
  }, []);

  // update delivery Boy location
  useEffect(() => {
    const socket = getSocket();
    socket.on("update-delivery-location", (data) => {
      setDeliveryBoyLocation({
        latitude: data.location.coordinates?.[1] ?? data.location.latitude,
        longitude: data.location.coordinates?.[0] ?? data.location.lontitude,
      });
    });

   


    return () => {
      socket.off("update-delivery-location");
    };
  }, [order]);

  const getSuggestion = async () => {
    setLoading(true);
    try {
      // console.log("chal raha hai")
      // find last message only receiver for ai suggestion
      const lastMessage = message
        ?.filter((m) => m.senderId.toString() != userData?._id)
        ?.at(-1);
      const result = await axios.post("/api/chat/ai-suggestion", {
        message: lastMessage?.text,
        role: "user",
      });
      // console.log(result.data);
      setSuggestion(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto pb-24">
        {/* header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-999">
          <button
            className="p-2 bg-green-100 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="text-green-700" size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold">Track order</h2>
            <p className="text-sm text-gray-600">
              {" "}
              order#{order?._id?.toString().slice(-6)}{" "}
              <span className="text-green-700 font-semibold">
                {order?.status}
              </span>
            </p>
          </div>
        </div>

        {/* map */}
        <div className="px-4 mt-6 space-y-4">
          <div className="rounded-3xl overflow-hidden border shadow">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>

          {/* chat function */}
          <div className="bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-700 text-sm">
                Quick Replies
              </span>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={getSuggestion}
                disabled={loading}
                className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700
                        rounded-full shadow-sm border border-purple-200 cursor-pointer"
              >
                <Sparkle size={14} />
                AI Suggest
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  "AI Suggest"
                )}
              </motion.button>
            </div>

            <div className="flex gap-2 flex-wrap mb-3">
              {suggestion.map((s) => (
                <motion.div
                  key={s}
                  whileTap={{ scale: 0.92 }}
                  className="px-3 py-1 text-xs bg-green-50 border border-green-200 text-green-700 rounded-full cursor-pointer"
                  onClick={() => setNewMessage(s)}
                >
                  {s}
                </motion.div>
              ))}
            </div>

            <div
              className="flex-1 overflow-y-auto p-2 space-y-3"
              ref={chatBoxRef}
            >
              <AnimatePresence>
                {message?.map((msg) => (
                  <motion.div
                    key={msg._id?.toString()}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.senderId.toString() == userData?._id ? "justify-end" : "justify-start"} `}
                  >
                    <div
                      className={`px-4 py-2 max-w-[75%] rounded-2xl shadow
                                  ${
                                    msg.senderId.toString() == userData?._id
                                      ? "bg-green-600 text-white rounded-br-none"
                                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                                  }
                                  `}
                    >
                      <p>{msg.text}</p>
                      <p className="text-[10px] opacity-70 mt-1 text-right">
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex gap-2 mt-3 border-t pt-3">
              <input
                type="text"
                placeholder="Type a Message ...."
                className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2
                      focus:ring-green-500 "
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />

              <button
                className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white cursor-pointer"
                onClick={sendMsg}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;
