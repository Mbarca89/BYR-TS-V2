import { vi, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Editor from './Editor';
import api from '../../utils/api';

vi.mock('../../utils/api', () => ({
    __esModule: true,
    default: Object.assign(vi.fn(), { put: vi.fn(), delete: vi.fn() })
}));
vi.mock('../RichTextEditor/RichTextEditor', () => ({ __esModule: true, default: ({ value, onChange }: any) =>
    <textarea aria-label="Descripción" value={value} onChange={event => onChange(event.target.value)} /> }));
vi.mock('../Toaster/Toaster', () => ({ notifySuccess: vi.fn(), notifyError: vi.fn() }));
const get = api as unknown as Mock;
const put = api.put as Mock;
const remove = api.delete as Mock;
const property = {
    id: 'property-1', name: 'Original', description: '<p>Texto</p>', type: 'Casa', category: 'Venta',
    price: 10, currency: '$', location: 'San Luis', size: 0, constructed: 0, bedrooms: 0, bathrooms: 0,
    kitchen: 0, garage: 0, others: [], services: [], amenities: [], featured: false,
    images: [{ id: 'a', url: '/a.jpg', thumbnailUrl: '/a.jpg' }, { id: 'b', url: '/b.jpg', thumbnailUrl: '/b.jpg' },
        { id: 'c', url: '/c.jpg', thumbnailUrl: '/c.jpg' }], imageOrder: [2, 0, 1]
};
beforeEach(() => {
    vi.clearAllMocks();
    get.mockResolvedValue({ data: property });
    put.mockResolvedValue({ data: 'ok' });
    remove.mockResolvedValue({ data: 'ok' });
    URL.createObjectURL = vi.fn(() => 'blob:test');
    URL.revokeObjectURL = vi.fn();
});
test('checkbox edits retain typed fields, and retrying does not duplicate photo indexes', async () => {
    put.mockRejectedValueOnce({ response: { data: { message: 'Error temporal' } } });
    const { container } = render(<Editor propertyId="property-1" updateList={vi.fn()} />);
    const name = await screen.findByPlaceholderText('Nombre');
    await waitFor(() => expect(name).toHaveValue('Original'));
    fireEvent.change(name, { target: { value: 'Nombre modificado' } });
    const checkbox = container.querySelector('input[type="checkbox"][name]') as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(name).toHaveValue('Nombre modificado');
    const file = new File(['bytes'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [file] } });
    fireEvent.submit(container.querySelector('form')!);
    await waitFor(() => expect(put).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(container.querySelector('button[type="submit"]')).toBeInTheDocument());
    fireEvent.submit(container.querySelector('form')!);
    await waitFor(() => expect(put).toHaveBeenCalledTimes(2));
    for (const call of put.mock.calls) {
        const payload = JSON.parse(call[1].get('propertyData'));
        expect(payload.name).toBe('Nombre modificado');
        expect([...payload.others, ...payload.services, ...payload.amenities]).toContain(checkbox.value);
        expect(payload.imageOrder).toEqual([2, 0, 1, 3]);
    }
});
test('deleting the first displayed photo deletes its ID rather than the first underlying image', async () => {
    const { container } = render(<Editor propertyId="property-1" updateList={vi.fn()} />);
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'X' })).toHaveLength(3));
    fireEvent.click(screen.getAllByRole('button', { name: 'X' })[0]);
    await waitFor(() => expect(remove).toHaveBeenCalledWith(expect.stringContaining('/api/images/delete'), { params: { id: 'c' } }));
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'X' })).toHaveLength(2));
    fireEvent.submit(container.querySelector('form')!);
    await waitFor(() => expect(put).toHaveBeenCalled());
    expect(JSON.parse(put.mock.calls[0][1].get('propertyData')).imageOrder).toEqual([0, 1]);
});
