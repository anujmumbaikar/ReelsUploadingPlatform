import { NextRequest,NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";


export async function POST(request: NextRequest) {
    try {
        const {email,password} = await request.json();
        if(!email || !password){
            return NextResponse.json({message:"Please provide all fields"},{status:400})
        }
        await dbConnect();
        const existingUesr = await User.findOne({email})
        if(existingUesr){
            return NextResponse.json({message:"User already exists"},{status:400})
        }
        await User.create({email,password})
        return NextResponse.json({message:"User created successfully"},{status:201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:"Internal server error"},{status:500})   
    }
}