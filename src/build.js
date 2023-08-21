import { Readable } from "node:stream";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  R2_ACCESS_KEY,
  R2_BUCKET,
  R2_ENDPOINT,
  R2_SECRET_ACCESS_KEY,
} from "./env.js";
import { buildUploadPage } from './upload.js'
import { ensureFile } from "fs-extra";
import { entries } from "browser-stream-tar";
import { writeFile } from "node:fs/promises";
const s3 = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  endpoint: R2_ENDPOINT,
});
console.log("Downloading report...");
const url = await getSignedUrl(
  s3,
  new GetObjectCommand({ Key: "reports.tar.gz", Bucket: R2_BUCKET }),
  { expiresIn: 60 }
);
const res = await fetch(url);
if (!res.ok || !res.body) {
  throw "Failed fetching signed url";
}
console.log("Downloaded");
console.log("extracting...");
await processZip(res.body);
console.log("extracted");

console.log('copying public folder')
await buildUploadPage()

/** @param {ReadableStream<Uint8Array>} fileStream */
async function processZip(fileStream) {
  const unzippedTarStream = fileStream.pipeThrough(
    new DecompressionStream("gzip")
  );
  for await (const entry of entries(unzippedTarStream)) {
    const filePath = entry.name;
    await ensureFile("./dist/" + filePath);
    await writeFile("./dist/" + filePath, Readable.fromWeb(entry.stream));
  }
}
