import { IncomingForm, File } from 'formidable';
import { ApiRequest } from './connect';

export async function readFileFromRequest(req: ApiRequest) {
    const data: File = await new Promise((resolve, reject): void => {
        const form = new IncomingForm();

        form.parse(req, (err, _fields, files) => {
            if (err) return reject(err);
            resolve(Array.isArray(files.file) ? files.file[0] : files.file);
        });
    });

    return data;
}
