import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import env from "../config/env";
import ApiError from "../errors/apiError";

const UPLOAD_URL_EXPIRES_IN_SECONDS = 300;

type PresignedUploadInput = {
  key: string;
  contentType: string;
};

function getS3UploadConfig() {
  const missingEnvVars = [
    ["AWS_REGION", env.AWS_REGION],
    ["AWS_S3_BUCKET", env.AWS_S3_BUCKET],
    ["AWS_ACCESS_KEY_ID", env.AWS_ACCESS_KEY_ID],
    ["AWS_SECRET_ACCESS_KEY", env.AWS_SECRET_ACCESS_KEY],
    ["AWS_S3_PUBLIC_BASE_URL", env.AWS_S3_PUBLIC_BASE_URL],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingEnvVars.length > 0) {
    throw new ApiError(
      500,
      `S3 upload is not configured. Missing: ${missingEnvVars.join(", ")}`,
    );
  }

  return {
    region: env.AWS_REGION!,
    bucket: env.AWS_S3_BUCKET!,
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
    publicBaseUrl: env.AWS_S3_PUBLIC_BASE_URL!.replace(/\/+$/, ""),
  };
}

export async function createPresignedUploadUrl({
  key,
  contentType,
}: PresignedUploadInput) {
  const config = getS3UploadConfig();
  const client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: UPLOAD_URL_EXPIRES_IN_SECONDS,
  });

  return {
    uploadUrl,
    fileUrl: `${config.publicBaseUrl}/${key}`,
    expiresIn: UPLOAD_URL_EXPIRES_IN_SECONDS,
  };
}
