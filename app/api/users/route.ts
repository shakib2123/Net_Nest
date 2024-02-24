import { NextResponse } from "next/server";
import connectDB from "@/utils/mongoose/db";
import User from "../../../utils/models/User";

export const GET = async (request: any): Promise<any> => {
  try {
    await connectDB();
    const posts = await User.find();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error in fetching data: " + error });
  }
};
