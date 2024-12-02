import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import "./Global.css";
import { Route, Routes, Outlet } from 'react-router-dom';
import Home from './views/Home/Home';
import Nav from './components/Nav/Nav';
import Detail from './views/Detail/Detail';
import Admin from './views/Admin/Admin';
import Properties from './views/Properties/Properties';
import ContactView from './views/ContactView/ContactView';
import Footer from './components/Footer/Footer';
import About from './views/About/About';
import { Toaster } from 'react-hot-toast';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import './App.css';
import { Col } from 'react-bootstrap';
function App() {
    return (_jsxs("div", { className: "d-flex flex-column flex-xl-row App overflow-hidden", children: [_jsx(Toaster, {}), _jsx(TawkMessengerReact, { propertyId: "64db6042cc26a871b02f5cbd", widgetId: "1h7sf00ve" }), _jsxs(Routes, { children: [_jsxs(Route, { element: (_jsxs(_Fragment, { children: [_jsx(Col, { xs: 2, className: 'd-flex', children: _jsx(Nav, {}) }), _jsxs(Col, { className: 'overflow-auto', children: [_jsx(Outlet, {}), _jsx(Footer, {})] })] })), children: [_jsx(Route, { path: '/', element: _jsx(Home, {}) }), _jsx(Route, { path: '/propiedades', element: _jsx(Properties, {}) }), _jsx(Route, { path: '/contacto', element: _jsx(ContactView, {}) }), _jsx(Route, { path: '/detalle/:id', element: _jsx(Detail, {}) }), _jsx(Route, { path: '/empresa', element: _jsx(About, {}) })] }), _jsx(Route, { path: '/admin', element: _jsx(Admin, {}) })] })] }));
}
export default App;
