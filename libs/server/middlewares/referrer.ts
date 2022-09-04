import { NOTE_ID_REGEXP } from 'libs/shared/note';
import { ApiRequest, ApiResponse, ApiNext } from '../connect';
import { isLoggedIn } from './auth';

export async function useReferrer(
    req: ApiRequest,
    res: ApiResponse,
    next: ApiNext
) {
    const referer = req.headers.referer;

    /**
     * Check permissions
     * - Logged in [pass]
     * -  No?
     *   - The note are in the meta of the file and are shared [pass]
     *   - fallback: From the sharing page [pass]
     */
    if (!isLoggedIn(req)) {
        let noteId;

        if (referer) {
            const pathname = new URL(referer).pathname;
            const m = pathname.match(new RegExp(`/(${NOTE_ID_REGEXP})$`));

            noteId = m ? m[1] : null;
        }

        if (!noteId) {
            return res.APIError.NOT_SUPPORTED.throw();
        }
    }

    return next();
}
