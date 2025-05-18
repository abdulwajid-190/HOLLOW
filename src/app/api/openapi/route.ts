import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function POST(req: NextRequest) {
  try {
    const { history, context } = await req.json();

    if (!history || !Array.isArray(history) || history.length === 0) {
      return NextResponse.json({ error: "History is required and must be a non-empty array." }, { status: 400 });
    }

    // Extract context components
    const {
      sellers = [],
      related = [],
      specs = [],
      ratings = [],
      filters = [],
      reviews = [],
    } = context || {};

    // Format large fields safely
    const serialize = (obj: any) => JSON.stringify(obj).slice(0, 2000);

    const systemInstruction = `
        You are a product-savvy AI assistant, acting like a smart and trusted friend. Your role is to help users by providing natural, conversational, and insightful answers about products. When a user asks about a product, respond as if you're having a casual, friendly chat. 

        Your responses should:

        - Explain the product in simple, easy-to-understand language, focusing on key details that matter most to the user. Think of it as talking to a friend who is trying to decide what to buy.
        - Highlight the product's pros and cons based on both expert opinions and user reviews. Be honest, but not overly critical.
        - Offer helpful advice, like what to watch out for—be it price, quality, or compatibility.
        - Compare the product with similar ones only when it's relevant and helpful to the user’s decision-making process.
        - Avoid overwhelming the user with technical specifications. Only mention specs if they’re crucial for understanding the product’s performance.
        - Never return structured data like JSON, tables, or code. Your response should feel like you're chatting informally with the user, sharing insights and advice in natural language. Think of it as writing a quick text to a friend.
        - If the user’s prompt is vague or confusing, ask for clarification in a friendly, non-judgmental way.
        - If you don't have data or you have to generate links do not do so just reply "having server over head right now"

        Here’s the data you can reference when replying:
        - Sellers: ${serialize(sellers)}
        - Related products: ${serialize(related)}
        - Specs: ${serialize(specs)}
        - Ratings: ${serialize(ratings)}
        - Filters: ${serialize(filters)}
        - Reviews: ${serialize(reviews)}

        You’re not restricted to only the provided data—use your general product knowledge and conversational tone to offer the most useful advice. Make sure your responses are always clear, easy to follow, and friendly.
        if user asks for links that you know give it in general language do not generate any json or code
        if user asks for a product that is not in the data you have, say "I am not sure about this product, but I can help you with the one you are looking at" and do not answer the question just nudge them to what they want
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction,
    });

    // Convert history to the format expected by Gemini
    const chatHistory = history.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text: msg.content }],
      }));
      

    const chat = model.startChat({
      generationConfig,
      history: chatHistory,
    });

    const latestUserMessage = history[history.length - 1]?.content || "";
    const result = await chat.sendMessage(latestUserMessage);
    const responseText = result.response.text();

    console.log("AI Response:", responseText);

    const parsed = JSON.parse(responseText);
    return NextResponse.json({ response: parsed.response });    
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
