import OSS from 'ali-oss';

const endpoint = process.env?.END_POINT || "unknowEndPoint";
const accessKeyId = process.env?.ACCESS_KEY_ID || "unknowAccessKeyId";
const accessKeySecret = process.env?.ACCESS_KEY_SECRET || "unknowAccessKeySecret";
const bucket = process.env?.BUCKET_NAME || "unknowBucketName";

export async function getFile(fileName: string): Promise<Buffer> {
    console.log({
        endpoint, accessKeyId, accessKeySecret, bucket
    });

    const client = new OSS({
        endpoint, accessKeyId, accessKeySecret, bucket
    });

    const content = await client.get(fileName).then(d => d.content) as Buffer;
    return content;
}
