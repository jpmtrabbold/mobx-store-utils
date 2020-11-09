export function findLast<T>(a: T[], predicate?: (e: T) => boolean) {
    if (!predicate) {
        return a[a.length - 1]
    }
    for (let index = a.length - 1; index >= 0; index--) {
        if (predicate(a[index])) {
            return a[index]
        }
    }
    return undefined
}