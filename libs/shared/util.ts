export function isProbablyError(e: any): e is Error {
    if (!e) return false;
    if (e instanceof Error) return true;

    return e && e.stack && e.message;
}
