// import { NextResponse } from 'next/server';
// import { research } from '@/app/data/research';

// export async function GET() {
//   return NextResponse.json(research.research_contributions);
// }

import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Types } from 'mongoose';
const ObjectId = Types.ObjectId;
import Research from '@/app/models/Research';
import dbConnect from '@/app/lib/mongodb';

// GET: Fetch researches with pagination and optional search
export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';
    const search = searchParams.get('search') || '';

    const pageNumber = parseInt(page, 10);
    const limit = parseInt(pageSize, 10);
    const skip = (pageNumber - 1) * limit;
    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const researchesCollection = Research;
    const researches = await researchesCollection.find(query).skip(skip).limit(limit).lean();
    const total = await researchesCollection.countDocuments(query);

    return NextResponse.json({ researches, total, page: pageNumber, pageSize: limit }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching researches', error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const newResearch = await request.json();
    // console.log("newResearch",newResearch)
    await Research.create(newResearch);
    return NextResponse.json({ message: 'Research added' }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error adding research', error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT: Update an existing research entry
export async function PUT(request: Request) {
  try {
    await dbConnect()
    const { id, ...updateData } = await request.json();
    if (!id) {
      return NextResponse.json({ message: 'Research ID is required' }, { status: 400 });
    }

    const researchesCollection = Research;

    await researchesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return NextResponse.json({ message: 'Research updated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating research' }, { status: 500 });
  }
}

// DELETE: Delete a research entry
export async function DELETE(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Research ID is required' }, { status: 400 });
    }

    const researchesCollection = Research;

    await researchesCollection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Research deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting research' }, { status: 500 });
  }
}
