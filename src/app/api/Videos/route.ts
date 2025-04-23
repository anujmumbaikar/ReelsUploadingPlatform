import authOptions from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import Video, { IVideo } from "@/models/video.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean()
        if(videos.length === 0) {
            return NextResponse.json([], { status: 404 })
        }
        return NextResponse.json(videos)
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request:NextRequest){
    try {
        const session = await getServerSession(authOptions)
        if(!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        await dbConnect()
        const body:IVideo = await request.json()
        if(!body.title || !body.description || !body.videoUrl) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }
        const videoData = {
            ...body,
            controlls:body.controlls ?? true,
            transformations:{
                height:1920,
                width:1080,
                quality:body.transformations?.quality ?? 100
            }
        }
        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo, { status: 201 })
    } catch (error) {
        console.error("Error creating video:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}