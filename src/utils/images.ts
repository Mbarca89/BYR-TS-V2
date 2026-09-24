export function normalizeImageOrder(order: number[] | null | undefined, count: number): number[] {
    const valid = (order || []).filter(index => Number.isInteger(index) && index >= 0 && index < count);
    return Array.from(new Set([...valid, ...Array.from({ length: count }, (_, index) => index)]));
}
export function removeImageFromOrder(order: number[], count: number, removed: number): number[] {
    return normalizeImageOrder(order, count).filter(index => index !== removed)
        .map(index => index > removed ? index - 1 : index);
}
