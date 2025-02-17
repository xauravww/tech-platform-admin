// /app/api/products/route.ts

import { NextResponse } from 'next/server';
import { Types } from 'mongoose'
const ObjectId = Types.ObjectId
import Product from '@/app/models/Product';
import dbConnect from '@/app/lib/mongodb';

// GET: Fetch products with pagination and optional search
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
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const productsCollection = Product;
    const products = await productsCollection.find(query).skip(skip).limit(limit).lean();
    const total = await productsCollection.countDocuments(query);

    return NextResponse.json({ products, total, page: pageNumber, pageSize: limit }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching products', error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const newProduct = await request.json();
    // console.log("newProduct", newProduct);

    // Optionally, validate newProduct here before creating it
    await Product.create(newProduct);
    return NextResponse.json({ message: 'Product added' }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error adding product:', errorMessage);
    return NextResponse.json(
      { message: 'Error adding product', error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT: Update an existing product
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, ...updateData } = await request.json();
    if (!id) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    const productsCollection = Product;
    await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return NextResponse.json({ message: 'Product updated' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating product', error: errorMessage }, { status: 500 });
  }
}

// DELETE: Delete a product
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
// console.log("id: " + id);
    if (!id) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    const productsCollection = Product;
    await productsCollection.deleteOne({ _id: new ObjectId(id) });
    // console.log("product id",new ObjectId(id) )
    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // console.log("error", errorMessage)
    return NextResponse.json({ message: 'Error deleting product', error: errorMessage }, { status: 500 });
  }
}
