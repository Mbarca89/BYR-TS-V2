import { vi, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Admin from './views/Admin/Admin';
import api from './utils/api';
vi.mock('./utils/api', () => ({
    __esModule: true, default: { get: vi.fn(), post: vi.fn() },
    clearCsrf: vi.fn(), refreshCsrf: vi.fn().mockResolvedValue(undefined)
}));
vi.mock('./components/List/List', () => ({ default: () => <div>Listado protegido</div> }));
vi.mock('./components/Editor/Editor', () => ({ default: () => <div>Editor</div> }));
vi.mock('./components/Uploader/Uploader', () => ({ default: () => <div>Carga</div> }));
const get = api.get as Mock;
const post = api.post as Mock;
beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); });
test('a legacy localStorage flag does not grant access', async () => {
    localStorage.setItem('user', 'ByRadmin');
    get.mockRejectedValue({ response: { status: 401 } });
    render(<Admin />);
    expect(await screen.findByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
    expect(screen.queryByText('Listado protegido')).not.toBeInTheDocument();
    expect(localStorage.getItem('user')).toBeNull();
});
test('login requires server success and logout calls the server', async () => {
    get.mockRejectedValueOnce({ response: { status: 401 } }).mockResolvedValue({ data: { username: 'admin' } });
    post.mockResolvedValue({ data: {} });
    render(<Admin />);
    fireEvent.change(await screen.findByLabelText('Usuario'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'a-test-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText('Listado protegido')).toBeInTheDocument();
    expect(post).toHaveBeenCalledWith('/api/auth/login', expect.any(URLSearchParams));
    fireEvent.click(screen.getByText('Salir (admin)'));
    expect(await screen.findByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
    expect(post).toHaveBeenCalledWith('/api/auth/logout');
});
test('password confirmation prevents a request and success returns to login', async () => {
    get.mockResolvedValue({ data: { username: 'admin' } });
    post.mockResolvedValue({ data: { message: 'Contraseña actualizada' } });
    render(<Admin />);
    fireEvent.click(await screen.findByText('Cambiar contraseña'));
    fireEvent.change(screen.getByLabelText('Contraseña actual'), { target: { value: 'old-password-2026' } });
    fireEvent.change(screen.getByLabelText('Nueva contraseña'), { target: { value: 'new-password-2026' } });
    fireEvent.change(screen.getByLabelText('Repetir nueva contraseña'), { target: { value: 'different-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar contraseña' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('no coinciden');
    expect(post).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Repetir nueva contraseña'), { target: { value: 'new-password-2026' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar contraseña' }));
    await waitFor(() => expect(post).toHaveBeenCalledWith('/api/auth/password', {
        currentPassword: 'old-password-2026', newPassword: 'new-password-2026'
    }));
    expect(await screen.findByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
});
