import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Admin.css";
import { useState, useEffect } from 'react';
import Uploader from "../../components/Uploader/Uploader";
import List from "../../components/List/List";
import { notifyError } from '../../components/Toaster/Toaster';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Editor from "../../components/Editor/Editor";
const ADMIN_USER = import.meta.env.VITE_REACT_APP_ADMIN_USER;
const ADMIN_PASSWORD = import.meta.env.VITE_REACT_APP_ADMIN_PASSWORD;
const AdminV2 = () => {
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user === "ByRadmin")
            setLogged(true);
    }, []);
    const [logged, setLogged] = useState(false);
    const [remember, setRemember] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState("");
    const [loginData, setLoginData] = useState({
        user: '',
        password: ''
    });
    const [, setLoginError] = useState('');
    const setTab = () => {
        setCurrentTab("home");
    };
    const [currentTab, setCurrentTab] = useState("home");
    const handleTabChange = (tab) => {
        setCurrentTab(tab);
    };
    const changeHandler = (event) => {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value
        });
        setLoginError('');
    };
    const loginHandler = () => {
        if (loginData.user === ADMIN_USER && loginData.password === ADMIN_PASSWORD) {
            setLogged(true);
            if (remember)
                localStorage.setItem('user', 'ByRadmin');
        }
        else {
            notifyError('Usuario o contraseña incorrecta');
        }
    };
    const logoutHandler = () => {
        setLogged(false);
        setLoginData({
            user: '',
            password: ''
        });
        localStorage.removeItem('user');
    };
    const rememberHandler = (event) => {
        if (event.target.checked)
            setRemember(true);
        else
            setRemember(false);
    };
    const enableEdit = (propertyId) => {
        setSelectedProperty(propertyId);
        setCurrentTab("edit");
    };
    return (!logged ?
        _jsxs("div", { className: "w-100 h-100 d-flex flex-column justify-content-center align-items-center", children: [_jsx("h1", { children: "Admin Login" }), _jsxs("div", { className: "loginCard", children: [_jsx("h4", { className: "title", children: "Iniciar sesi\u00F3n" }), _jsxs("form", { onSubmit: loginHandler, children: [_jsxs("div", { className: "field", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "input-icon", viewBox: "0 0 16 16", children: _jsx("path", { d: "M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" }) }), _jsx("input", { autoComplete: "off", id: "logemail", placeholder: "Usuario", className: "input-field", name: "user", type: "text", value: loginData.user, onChange: changeHandler })] }), _jsxs("div", { className: "field", children: [_jsx("svg", { className: "input-icon", viewBox: "0 0 500 500", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z" }) }), _jsx("input", { autoComplete: "off", id: "logpass", placeholder: "Contrase\u00F1a", className: "input-field", name: "password", type: "password", value: loginData.password, onChange: changeHandler })] }), _jsxs("div", { className: "field d-flex justify-content-start", children: [_jsx("input", { autoComplete: "off", id: "remember", name: "remember", type: "checkbox", onChange: rememberHandler }), _jsx("span", { className: '', style: { color: "gray" }, children: "Recordarme" })] }), _jsx("button", { className: "loginbtn", type: "submit", children: "Login" })] })] })] })
        :
            _jsxs("div", { className: 'w-100 h-100 overflow-auto', children: [_jsx(Container, { fluid: true, className: "p-1", children: _jsxs(Nav, { variant: "tabs", defaultActiveKey: "patients", activeKey: currentTab, children: [_jsx(Navbar.Brand, { children: _jsx("img", { src: "/images/logo.webp", width: "auto", height: "30", className: "d-inline-block align-top", alt: "ByR Inmobiliaria" }) }), _jsx(Nav.Item, { children: _jsx(Nav.Link, { className: "text-dark", eventKey: "home", onClick: () => handleTabChange("home"), children: "Propiedades" }) }), _jsx(Nav.Item, { children: _jsx(Nav.Link, { className: "text-dark", eventKey: "createProperty", onClick: () => handleTabChange("createProperty"), children: "Cargar propiedad" }) }), _jsx(Nav.Item, { children: _jsx(Nav.Link, { className: "text-dark", onClick: logoutHandler, children: "Salir" }) })] }) }), _jsxs("div", { className: "mt-3 w-100 h-100", children: [currentTab === "home" ? _jsx(List, { enableEdit: enableEdit }) : null, currentTab === "edit" ? _jsx(Editor, { updateList: setTab, propertyId: selectedProperty }) : null, currentTab === "createProperty" ? _jsx(Uploader, { updateList: setTab }) : null] })] }));
};
export default AdminV2;
