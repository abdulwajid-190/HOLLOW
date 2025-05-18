// app/api/product/set/route.ts
import { NextRequest, NextResponse } from "next/server";
import redis from "@/app/lib/redis"; // server-side only

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product } = body;

    if (!product?.product_id) {
      return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
    }

    console.log("Product to set:", product);

    await redis.set(`product:dummy`, JSON.stringify(product), { EX: 3000 });

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
