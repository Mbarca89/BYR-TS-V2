import { vi, type Mock } from 'vitest';
import { normalizeImageOrder, removeImageFromOrder } from './images';
test('normalizes legacy missing, repeated and invalid indexes', () => {
    expect(normalizeImageOrder([2, 2, -1, 99], 3)).toEqual([2, 0, 1]);
    expect(normalizeImageOrder(null, 2)).toEqual([0, 1]);
    expect(normalizeImageOrder([0], 0)).toEqual([]);
});
test('deleting a reordered image preserves the surviving order', () => {
    expect(removeImageFromOrder([2, 0, 1], 3, 0)).toEqual([1, 0]);
    expect(removeImageFromOrder([2, 0, 1], 3, 2)).toEqual([0, 1]);
    expect(removeImageFromOrder([0], 1, 0)).toEqual([]);
});
