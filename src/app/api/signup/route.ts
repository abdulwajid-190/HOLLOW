import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import User from '@/app/models/user';

// POST method to handle user signup
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Simple input validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@') || password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password too short' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();

    return NextResponse.json(
      { success: true, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    let errorMessage = 'Server error';
    let statusCode = 500;

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      errorMessage = 'Email already exists';
      statusCode = 400;
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
