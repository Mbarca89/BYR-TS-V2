import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import style from './ControlPanel.module.css';
import { useNavigate } from 'react-router-dom';
const logo = require('../../img/logo.webp');
const ControlPanel = () => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: style.controlPanel, children: [_jsx("h1", { children: "Panel de Administrador" }), _jsx("hr", {}), _jsxs("div", { children: [_jsx("button", { onClick: () => { navigate('/upload'); }, children: "Cargar propiedad" }), _jsx("button", { onClick: () => { navigate('/list'); }, children: "Ver propiedades" }), _jsx("button", { onClick: () => { navigate(''); }, children: "Cargar inversi\u00F3n" }), _jsx("button", { onClick: () => { navigate(''); }, children: "Ver inversiones" })] }), _jsx("hr", {}), _jsx("img", { src: logo, alt: "" })] }));
};
export default ControlPanel;
