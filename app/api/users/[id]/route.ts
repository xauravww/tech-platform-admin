import { NextResponse } from 'next/server';
import UserModel from '@/app/models/User';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id; // Extract 'id' from the URL path

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete the user from the database using Mongoose's findByIdAndDelete() method
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}


import bcrypt from 'bcryptjs';
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const requestData = await request.json();

    // console.log("requestdat in PUT",JSON.stringify(requestData));

    // If the password is being updated, hash it first
    if (requestData.password) {
      const salt = await bcrypt.genSalt(10);
      requestData.password = await bcrypt.hash(requestData.password, salt);
    }

    // Update user details
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: requestData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'User updated successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
