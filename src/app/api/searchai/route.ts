import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 256,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userQuery = body.query || "";
    const filters = {
      priceRange: body.priceRange || "",
      rating: body.rating || "",
    };

    const prompt = `
    You are a backend service that takes a vague user request and optional filters, and returns a clean product search query.

    Rules:
    - Output only the query as a string. No JSON, no markdown, no explanations.
    - Include inferred terms if helpful (e.g., "gift for 8 year old boy" ⇒ "toys for boys age 8 under $50").
    - Always include price and rating if provided.

    Input:
    User query: "${userQuery}"
    Price range: "${filters.priceRange || "Not specified"}"
    Rating: "${filters.rating || "Not specified"}"
    make sure the query is googlable and can be used to search for products on Google Shopping.
    Respond with only the search query string in quotes.
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
    });

    const result = await model.generateContent(prompt);

    console.log("Generated query:", result);
    const text = (await result.response.text()).trim();
    console.log("Generated text:", text);

    // Ensure response is a string (strip wrapping quotes if present)
    const cleanedQuery = text.replace(/^"|"$/g, "");

    return NextResponse.json({ query: cleanedQuery });
  } catch (error) {
    console.error("Error generating query:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
