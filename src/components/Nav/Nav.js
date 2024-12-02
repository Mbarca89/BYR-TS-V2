import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import "./Nav.css";
import { useState } from "react";
import { GiHamburgerMenu } from 'react-icons/gi';
import { GrFormClose } from 'react-icons/gr';
import { Offcanvas } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
const Nav = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const showNavHandler = () => {
        setShow(!show);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "position-relative m-1 z-5 d-xl-none d-flex", onClick: showNavHandler, children: _jsx("div", { children: !show ?
                        _jsx(GiHamburgerMenu, { size: 35, color: '#4a4a4a' })
                        : _jsx(GrFormClose, { size: 35, color: '#4a4a4a' }) }) }), _jsxs("div", { className: "d-flex flex-row justify-content-evenly position-absolute end-0 m-2 d-xl-none gap-3", children: [_jsx("a", { className: "", href: `https://www.instagram.com/byrinmobiliaria/`, target: "_blank", rel: "noopener noreferrer", children: _jsx("img", { src: '/images/instagram.webp', alt: 'B&R Inmobiliaria' }) }), _jsx("a", { className: "", href: `https://www.facebook.com/ByRdesarrollosinmobiliarios`, target: "_blank", rel: "noopener noreferrer", children: _jsx("img", { src: '/images/facebook.webp', alt: 'B&R Inmobiliaria' }) }), _jsx("a", { className: "", href: `https://api.whatsapp.com/send?phone=5492664570187&text=Hola, Necesito asesoramiento sobre una propiedad`, target: "_blank", rel: "noopener noreferrer", children: _jsx("img", { src: '/images/whatsapp.webp', alt: 'B&R Inmobiliaria' }) }), _jsx("a", { href: "tel:+549 266 570187", children: _jsx("img", { src: '/images/phone.webp', alt: "" }) })] }), _jsxs(Offcanvas, { show: show, onHide: handleClose, responsive: "xl", style: { width: "100%" }, children: [_jsx(Offcanvas.Header, { className: 'position-absolute', closeButton: true }), _jsxs("div", { className: "d-flex flex-column h-100", style: { backgroundColor: "#eaeaea" }, children: [_jsx("div", { className: "w-100 h-25 d-flex justify-content-center align-items-center", children: _jsx(NavLink, { to: '/', children: _jsx("img", { className: "", src: '/images/logo.webp', alt: 'B&R Inmobiliaria' }) }) }), _jsx("div", { className: "line" }), _jsxs("div", { className: "d-flex flex-column gap-5 h-50 mt-5", onClick: showNavHandler, children: [_jsx(NavLink, { to: '/', className: location.pathname === '/' ? "buttonActive" : "button", children: "Inicio" }), _jsx(NavLink, { to: '/propiedades', className: location.pathname === '/propiedades' ? "buttonActive" : "button", children: "Propiedades" }), _jsx(NavLink, { to: '/contacto', className: location.pathname === '/contacto' ? "buttonActive" : "button", children: "Contacto" }), _jsx(NavLink, { to: '/empresa', className: location.pathname === '/empresa' ? "buttonActive" : "button", children: "\u00BFQuienes somos?" })] }), _jsx("div", { className: "line" }), _jsxs("div", { className: "d-flex flex-row justify-content-evenly mt-5", children: [_jsx("a", { className: "", href: `https://www.instagram.com/byrinmobiliaria/`, target: "_blank", rel: "noopener noreferrer", children: _jsx("img", { src: '/images/instagram.webp', alt: 'B&R Inmobiliaria' }) }), _jsx("a", { className: "", href: `https://www.facebook.com/ByRdesarrollosinmobiliarios`, target: "_blank", rel: "noopener noreferrer", children: _jsx("img", { src: '/images/facebook.webp', alt: 'B&R Inmobiliaria' }) }), _jsx("a", { className: "", href: `https://api.whatsapp.com/send?phone=5492664570187&text=Hola, Necesito asesoramiento sobre una propiedad`, target: "_blank", rel: "noopener noreferrer", children: _jsx("img", { src: '/images/whatsapp.webp', alt: 'B&R Inmobiliaria' }) }), _jsx("a", { href: "tel:+549 266 570187", children: _jsx("img", { src: '/images/phone.webp', alt: "" }) })] })] })] })] }));
};
export default Nav;
