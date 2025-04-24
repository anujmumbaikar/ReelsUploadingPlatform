import { dbConnect } from "@/lib/dbConnect";
import Video, { IVideo } from "@/models/video.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "@/app/api/auth/[...nextauth]/options";

// Handler for preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

export async function GET() {
    try {
        await dbConnect();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean()
        
        // Add CORS headers
        const headers = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };
        
        if(videos.length === 0) {
            return NextResponse.json([], { 
              status: 404,
              headers
            })
        }
        return NextResponse.json(videos, { headers })
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request:NextRequest){
    try {
        // Add logging to debug authentication
        console.log("POST request received");
        
        // For debugging, you might want to temporarily skip auth in production
        // to see if that's the issue
        const session = await getServerSession(authOptions)
        console.log("Session:", session ? "exists" : "null");
        
        if(!session) {
            return NextResponse.json({ message: "Unauthorized" }, { 
              status: 401,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              }
            })
        }
        
        await dbConnect()
        const body:IVideo = await request.json()
        console.log("Request body:", body);
        
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
        
        return NextResponse.json(newVideo, { 
          status: 201,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        })
    } catch (error) {
        console.error("Error creating video:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}