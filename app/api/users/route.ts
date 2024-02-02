import { NextResponse } from "next/server";
import connectDB from "@/utils/mongoose/db";
import Post, { IPost } from "@/utils/models/user";

export const GET = async (request: any): Promise<any> => {
  try {
    await connectDB();
    const posts: IPost[] = await Post.find();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error in fetching data: " + error });
  }
};
