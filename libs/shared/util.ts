export function isProbablyError(e: any): e is Error {
    if (!e) return false;
    if (e instanceof Error) return true;

    return e && e.stack && e.message;
}

export function errorToString(error: Error): string {
    let str = "";

    if (error.stack) {
        return error.stack;
    }

    if (error.name) {
        str += error.name;
    }
    if (error.message) {
        str = ensureEndingUnlessEmpty(str, ": ") + error.message;
    }

    return str;
}

export function ensureEndingUnlessEmpty(str: string, ending: string) {
    if (str.length > 0 && !str.endsWith(ending)) {
        return str + ending;
    }
    return str;
}
