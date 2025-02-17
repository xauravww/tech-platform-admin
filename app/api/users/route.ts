import { NextResponse } from 'next/server';
import UserModel from '@/app/models/User';

// Define the type for the request body
interface CreateUserRequestBody {
  email: string;
  password: string;
}

// Define the type for the user response
interface SafeUser {
  email: string;
  // Add other fields you want to expose (e.g., name, role, etc.)
}

export async function GET(request: Request) {
  try {
    // Extract query parameters from the URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const search = searchParams.get('search') || '';

    // Build query object; for example, search in email field
    const query: any = {};
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    // Get total matching users count for pagination purposes
    const total = await UserModel.countDocuments(query);

    // Fetch users with pagination (skip & limit) and exclude the password field
    const users = await UserModel.find(query, '-password')
      .skip((page - 1) * pageSize)
      .limit(pageSize).lean();

    // Map users into a safe format (password field is already excluded)
    const safeUsers: SafeUser[] | any = users.map(({ password, ...user }) => user);

    return NextResponse.json({ users: safeUsers, total, page, pageSize });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateUserRequestBody = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists using Mongoose's findOne() method
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create a new user and save it to the database using Mongoose's create() method
    const user = await UserModel.create({ email, password });
    // Remove password before returning response
    const { password: _, ...safeUser } = user.toObject();

    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
