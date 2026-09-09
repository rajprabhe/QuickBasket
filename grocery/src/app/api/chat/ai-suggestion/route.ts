import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { message, role } = await req.json();

    const prompt = `You are a professional delivery assistant chatbot.

You will be given:
- role: either "user" or "delivery_boy"
- last message: the last message sent in the conversation

Your task:
If role is "user" > generate 3 short WhatsApp-style reply suggestions that a user could send to the
delivery boy.
If role is "delivery_boy" > generate 3 short WhatsApp-style reply suggestions that a delivery boy could send to the user
could send to the user.

⚠️ Follow these rules:
- Replies must match the context of the last message.
- Keep replies short, human-like (max 10 words).
- Use emojis naturally (max one per reply).
- No generic replies like "Okay" or "Thank you".
- Must be helpful, respectful, and relevant to delivery, status, help, or location.
- NO numbering, NO extra instructions, NO extra text.
- Just return comma-separated reply suggestions.

Return only the three reply suggestions, comma-separated.

Role: ${role}
Last message: ${message}


`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/interactions?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({
            "model": "gemini-3.7-flash",
            "input": prompt
        })
      },
    );

    const data = await response.json()
    // console.log(data)
    const replayText = data?.steps?.[1]?.content?.[0]?.text || ""
    const suggestions = replayText.split(",").map((s:string)=>(s.trim()))
    // console.log('server chala')

    return NextResponse.json(
        suggestions,
        {status:200}
    )





  } catch (error:any) {
        // console.log(error.message)
        // console.log(error.name)
       return NextResponse.json(
        {message:"ai message error",error},
        {status:500}
    )
  }
}
