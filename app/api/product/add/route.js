import connectDB from "@/config/db";
//is the function that connects to the mongo dp data base
import Product from "@/models/Product";
//is the product model used to pass information
import { getAuth } from "@clerk/nextjs/server";
//This will check if we're authenticated, then we can add product
import { v2 as cloudinary } from "cloudinary";
//it stores images and gives a link to optimize the website
import { NextResponse } from "next/server";
//next reponse give a reponse after the action has taken place

// configure cloudinary with environment varaibles
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//POST REQUEST TO CREATE NEW PRODCUCT TO OUR DATABASE
export async function POST(request) {
  // trycatch is used to catch errors in a function
  try {
    //get user ID
    const { userId } = getAuth(request);
    const userLoggedin = userId;

    if (!userLoggedin) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authorized to upload pictures",
        },
        { status: 401 }
      );
    }

    //Parse form data from the request
    const formData = await request.formData();

    //Extract product detials from form data
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    //Get all upload image files
    const files = formData.getAll("image");

    //confirm that the images are uploaded
    //before the request is completed
    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No files upload",
        },
        { status: 400 }
      );
    }

    //Process all images in parallel using Promise.all
    const result = await Promise.all(
      files.map(async (file) => {
        // Convert file to buffer for upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        //upload each file to Cloudinary using stream
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" }, // Auto-detect file type
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(buffer);
        });
      })
    );

    //Extract secure URLd from Cloudinary response
    const image = result.map((result) => result.secure_url);

    //Connect to MongoDB
    await connectDB();
    //create a new product in the dataBase

    const newProduct = await Product.create({
      userId,
      name,
      description,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image,
      date: Date.now(),
    }); // return success response with new product data
    return NextResponse.json({
      success: true,
      message: "Upload successful",
      newProduct,
    });
  } catch (error) {
    // Handle any errors and return error response
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
