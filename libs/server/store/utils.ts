import { Readable } from 'stream';

// Apparently the stream parameter should be of type Readable|ReadableStream|Blob
// The latter 2 don't seem to exist anywhere.
export async function streamToBuffer(stream: Readable): Promise<Buffer> {
    if (Buffer.isBuffer(stream)) {
        return stream;
    }
    return await new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}
