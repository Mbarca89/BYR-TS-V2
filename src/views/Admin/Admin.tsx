import './Admin.css';
import { FormEvent, useEffect, useState } from 'react';
import { Container, Nav, Navbar, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Uploader from '../../components/Uploader/Uploader';
import List from '../../components/List/List';
import Editor from '../../components/Editor/Editor';
import api, { clearCsrf, refreshCsrf } from '../../utils/api';
import { errorMessage } from '../../utils/HandleErrors';

const Admin = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [checking, setChecking] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmation: '' });
    const [currentTab, setCurrentTab] = useState('home');
    const [selectedProperty, setSelectedProperty] = useState('');

    useEffect(() => {
        let active = true;
        localStorage.removeItem('user');
        const expired = () => {
            setUsername(null);
            setPasswords({ currentPassword: '', newPassword: '', confirmation: '' });
            setCurrentTab('home');
        };
        window.addEventListener('byr-session-expired', expired);
        api.get('/api/auth/me').then(({ data }) => {
            if (active) setUsername(data.username);
        }).catch(error => {
            if (active && error.response?.status !== 401) setError(errorMessage(error));
        }).finally(() => { if (active) setChecking(false); });
        return () => { active = false; window.removeEventListener('byr-session-expired', expired); };
    }, []);

    const login = async (event: FormEvent) => {
        event.preventDefault();
        if (busy) return;
        setBusy(true); setError(''); setMessage('');
        try {
            await refreshCsrf();
            await api.post('/api/auth/login', new URLSearchParams(loginData));
            clearCsrf();
            const { data } = await api.get('/api/auth/me');
            setUsername(data.username);
            setLoginData({ username: '', password: '' });
            setCurrentTab('home');
        } catch (error) { setError(errorMessage(error)); }
        finally { setBusy(false); }
    };

    const logout = async () => {
        setBusy(true); setError('');
        try {
            await api.post('/api/auth/logout');
            clearCsrf(); setUsername(null); setCurrentTab('home');
            setPasswords({ currentPassword: '', newPassword: '', confirmation: '' });
        } catch (error) { setError(errorMessage(error)); }
        finally { setBusy(false); }
    };

    const changePassword = async (event: FormEvent) => {
        event.preventDefault();
        if (busy) return;
        setError(''); setMessage('');
        if (passwords.newPassword !== passwords.confirmation) {
            setError('Las contraseñas nuevas no coinciden'); return;
        }
        setBusy(true);
        try {
            const { data } = await api.post('/api/auth/password', {
                currentPassword: passwords.currentPassword, newPassword: passwords.newPassword
            });
            clearCsrf(); setUsername(null); setCurrentTab('home');
            setPasswords({ currentPassword: '', newPassword: '', confirmation: '' });
            setMessage(data.message);
        } catch (error) { setError(errorMessage(error)); }
        finally { setBusy(false); }
    };

    if (checking) return <div className="p-5 text-center"><Spinner aria-label="Comprobando sesión" /></div>;

    return <div className="w-100 h-100 overflow-auto">
        {error && <Alert variant="danger" role="alert">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        {!username ? <div className="d-flex flex-column align-items-center justify-content-center p-4">
            <h1>Administración</h1>
            <div className="loginCard">
                <h2 className="title">Iniciar sesión</h2>
                <form onSubmit={login}>
                    <div className="field">
                        <input aria-label="Usuario" autoComplete="username" placeholder="Usuario" className="input-field"
                            required maxLength={100} value={loginData.username}
                            onChange={event => setLoginData({ ...loginData, username: event.target.value })} />
                    </div>
                    <div className="field">
                        <input aria-label="Contraseña" autoComplete="current-password" placeholder="Contraseña" type="password"
                            className="input-field" required maxLength={72} value={loginData.password}
                            onChange={event => setLoginData({ ...loginData, password: event.target.value })} />
                    </div>
                    <button className="loginbtn" type="submit" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
                </form>
            </div>
        </div> : <>
            <Container fluid className="p-1">
                <Nav variant="tabs" activeKey={currentTab}>
                    <Navbar.Brand><img src="/images/logo.webp" height="30" alt="ByR Inmobiliaria" /></Navbar.Brand>
                    <Nav.Item><Nav.Link eventKey="home" onClick={() => setCurrentTab('home')}>Propiedades</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="createProperty" onClick={() => setCurrentTab('createProperty')}>Cargar propiedad</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="password" onClick={() => setCurrentTab('password')}>Cambiar contraseña</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link disabled={busy} onClick={logout}>Salir ({username})</Nav.Link></Nav.Item>
                </Nav>
            </Container>
            <div className="mt-3 w-100">
                {currentTab === 'home' && <List enableEdit={id => { setSelectedProperty(id); setCurrentTab('edit'); }} />}
                {currentTab === 'edit' && <Editor key={selectedProperty} propertyId={selectedProperty} updateList={() => setCurrentTab('home')} />}
                {currentTab === 'createProperty' && <Uploader updateList={() => setCurrentTab('home')} />}
                {currentTab === 'password' && <Container style={{ maxWidth: 520 }}>
                    <h2>Cambiar contraseña</h2>
                    <p>Usá al menos 12 caracteres. Al cambiarla se cerrarán las sesiones abiertas.</p>
                    <Form onSubmit={changePassword}>
                        <Form.Group className="mb-3" controlId="currentPassword">
                            <Form.Label>Contraseña actual</Form.Label>
                            <Form.Control type="password" autoComplete="current-password" required maxLength={72}
                                value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>Nueva contraseña</Form.Label>
                            <Form.Control type="password" autoComplete="new-password" required minLength={12} maxLength={72}
                                value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Repetir nueva contraseña</Form.Label>
                            <Form.Control type="password" autoComplete="new-password" required minLength={12} maxLength={72}
                                value={passwords.confirmation} onChange={e => setPasswords({ ...passwords, confirmation: e.target.value })} />
                        </Form.Group>
                        <Button type="submit" disabled={busy}>{busy ? 'Guardando…' : 'Guardar contraseña'}</Button>
                    </Form>
                </Container>}
            </div>
        </>}
    </div>;
};
export default Admin;
