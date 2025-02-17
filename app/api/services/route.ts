import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import { Types } from 'mongoose';
const ObjectId = Types.ObjectId 
import Service from '@/app/models/Service';

// GET: Fetch services with pagination and optional search
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';
    const search = searchParams.get('search') || '';

    const pageNumber = parseInt(page, 10);
    const limit = parseInt(pageSize, 10);
    const skip = (pageNumber - 1) * limit;
    const query = search
      ? {
          $or: [
            { category: { $regex: search, $options: 'i' } },
            { 'sub_services.name': { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const services = await Service.find(query).skip(skip).limit(limit).lean();
    const total = await Service.countDocuments(query);

    return NextResponse.json({ services, total, page: pageNumber, pageSize: limit }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching services', error: errorMessage }, { status: 500 });
  }
}

// POST: Add a new service
export async function POST(request: Request) {
  try {
    await dbConnect();
    const newService = await request.json();
// console.log("newservice", JSON.stringify(newService));
    if (!newService.category || !newService.description || !Array.isArray(newService.sub_services)) {
      return NextResponse.json({ message: 'Invalid service data' }, { status: 400 });
    }

    await Service.create(newService);
    return NextResponse.json({ message: 'Service added' }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error adding service', error: errorMessage }, { status: 500 });
  }
}

// PUT: Update an existing service entry
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Service ID is required' }, { status: 400 });
    }

    await Service.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    return NextResponse.json({ message: 'Service updated' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating service', error: errorMessage }, { status: 500 });
  }
}

// DELETE: Delete a service entry
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Service ID is required' }, { status: 400 });
    }

    await Service.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Service deleted' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting service', error: errorMessage }, { status: 500 });
  }
}
