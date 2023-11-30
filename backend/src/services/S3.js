const { v4: uuid } = require('uuid');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Uploadv3 = async (files) => {
  const s3client = new S3Client({ region: "us-east-1" });

  const params = files.map((file) => ({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `images/${uuid()}-${file.originalname}`,
    Body: file.buffer,
  }));

  const results = await Promise.all(
    params.map((param) =>
      s3client.send(new PutObjectCommand(param)))
  );

  return [results, params.map((param) => param.Key)];
}

const uploadImagesToS3 = async (files) => {
  try {
    const [results, filenames] = await s3Uploadv3(files);
    const fileUrls = filenames.map(filename => `https://${process.env.AWS_BUCKET_URL}/${filename}`)
    return fileUrls
  } catch (err) {
    throw new Error("fail to upload images:", err);
  }
}

exports.uploadImagesToS3 = uploadImagesToS3;