import { NextResponse } from "next/server";

import User from "../../../utils/models/User";
import { connectDB } from "@/utils/mongoose/db";

export const GET = async (request: any) => {
  try {
    await connectDB();
    const posts = await User.find();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error in fetching data: " + error });
  }
};
