import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { encrypt } from '@/app/lib/auth';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { setCookie } from 'cookies-next';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    // console.log("password", password)
    // console.log("user.password", user.password)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const token = await encrypt({
      id: user._id,
      email: user.email,
    });

    // Save token in cookies
    (await
      // Save token in cookies
      cookies()).set('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
      });

    // // Save token in cookies
    // setCookie('token', token, {
    //   maxAge: 60 * 60 * 24, // 1 day
    //   path: '/', // default path
    //   httpOnly: false, // Set to true if you want the cookie to be accessible only by the server
    //   secure: process.env.NODE_ENV === 'production', // Set to true if you're using HTTPS in production
    //   sameSite: 'lax', // Recommended setting for most use cases
    // });

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}