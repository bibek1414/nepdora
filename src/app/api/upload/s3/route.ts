import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_STORAGE_BUCKET_NAME || "himalayancrm";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "nepdora";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const key = `public/Nepdora/${folder}/${fileName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        // ACL: "public-read", // Uncomment if bucket policy doesn't handle public access
      })
    );

    const region = process.env.AWS_REGION || "ap-south-1";
    const url = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload to S3" },
      { status: 500 }
    );
  }
}
