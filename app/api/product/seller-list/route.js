import connectDB from "@/config/db";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const userLoggedin = userId;

    if (!userLoggedin) {
      return NextResponse.json(
        {
          success: false,
          message: "You need to be logged in",
        },
        { status: 401 }
      );
    }
    await connectDB();

    const products = await Product.find({});
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
