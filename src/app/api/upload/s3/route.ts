import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || "  ",
  endpoint: process.env.AWS_S3_ENDPOINT_URL || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: false, // DO Spaces works better with false (virtual-hosted style)
});

const BUCKET_NAME = process.env.AWS_STORAGE_BUCKET_NAME || " ";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "nepdora";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const prefix = process.env.AWS_FILESYSTEM_PREFIX || "public/Nepdora";
    const key = `${prefix}/${folder}/${fileName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read", // Required for public access on DO Spaces
      })
    );

    const customDomain =
      process.env.NEXT_PUBLIC_AWS_S3_CUSTOM_DOMAIN ||
      `${BUCKET_NAME}.${process.env.AWS_S3_REGION}.digitaloceanspaces.com`;
    const url = `https://${customDomain}/${key}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("DO Spaces Upload Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload to DigitalOcean Spaces",
      },
      { status: 500 }
    );
  }
}
