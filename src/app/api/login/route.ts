import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import User from '@/app/models/user';
export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json(
              { success: false, message: 'Email and password are required' },
              { status: 400 }
            );
          }
          if (!email.includes('@') ) {
            return NextResponse.json(
              { success: false, message: 'Invalid email ' },
              { status: 400 }
            );
          }
          await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
        return NextResponse.json(
            { success: false, message: 'User does not exist' },
            { status: 400 }
        );
        }else{
            
            const isMatch=await bcrypt.compare(password,existingUser.password);
            if(isMatch){
                return NextResponse.json(
                    { success: true, message: 'login successful' },
                    { status: 200}
                  );
            }
            else{
                return NextResponse.json(
                    { success: false, message: 'Invalid Password' },
                    { status: 400 }
                );
            }
        }
    }
    catch (error: any) {
        console.error(error);
        let errorMessage = 'Server error';
        let statusCode = 500;
    
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
          errorMessage = 'Email does not exists';
          statusCode = 400;
        }
    
        return NextResponse.json(
          { success: false, message: errorMessage },
          { status: statusCode }
        );
      }
}