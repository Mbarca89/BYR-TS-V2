import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { modalState } from '../../app/store';
import CustomModal from '../CustomModal/CustomModal';
import DeleteProperty from '../DeleteProperty/DeteleProperty';
import handleError from '../../utils/HandleErrors';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
const List = ({ enableEdit }) => {
    const [properties, setProperties] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [selectedProperty, setSelectecProperty] = useState("");
    const [show, setShow] = useRecoilState(modalState);
    const getPropertyList = async () => {
        try {
            const res = await axios(`${SERVER_URL}/api/properties/getPropertyList`);
            if (res.data) {
                setProperties(res.data);
            }
        }
        catch (error) {
            handleError(error);
        }
    };
    useEffect(() => {
        getPropertyList();
        return () => {
            setProperties([]);
        };
    }, []);
    const deleteHandler = (id, name) => {
        setSelectedId(id);
        setSelectecProperty(name);
        setShow(true);
    };
    const editHandler = (propertyId) => {
        enableEdit(propertyId);
    };
    return (_jsxs("div", { className: 'container flex-grow-1 overflow-auto d-flex justify-content-center align-items-center w-100', children: [_jsxs(Table, { striped: true, bordered: true, hover: true, size: "sm", className: 'text-center', children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Id" }), _jsx("th", { children: "Nombre" }), _jsx("th", { children: "Tipo" }), _jsx("th", { children: "Categor\u00EDa" }), _jsx("th", { children: "Ubicaci\u00F3n" }), _jsx("th", { children: "Destacada" }), _jsx("th", { children: "Eliminar" }), _jsx("th", { children: "Editar" })] }) }), _jsx("tbody", { children: properties.map(property => _jsxs("tr", { children: [_jsx("td", { role: 'button', onClick: () => window.open(`/detail/${property.id}`, '_blank'), children: property.id }), _jsx("td", { role: 'button', onClick: () => window.open(`/detail/${property.id}`, '_blank'), children: property.name }), _jsx("td", { role: 'button', onClick: () => window.open(`/detail/${property.id}`, '_blank'), children: property.type }), _jsx("td", { role: 'button', onClick: () => window.open(`/detail/${property.id}`, '_blank'), children: property.category }), _jsx("td", { role: 'button', onClick: () => window.open(`/detail/${property.id}`, '_blank'), children: property.location }), _jsx("td", { role: 'button', onClick: () => window.open(`/detail/${property.id}`, '_blank'), children: property.featured ? _jsxs("svg", { width: "25", height: "25", viewBox: "0 0 512 512", style: { color: "#1C2033" }, xmlns: "http://www.w3.org/2000/svg", className: "h-full w-full", children: [_jsx("rect", { width: "25", height: "25", x: "0", y: "0", rx: "30", fill: "transparent", stroke: "transparent", strokeWidth: "0", strokeOpacity: "100%", paintOrder: "stroke" }), _jsx("svg", { width: "512px", height: "512px", viewBox: "0 0 16 16", fill: "#1C2033", x: "0", y: "0", role: "img", style: { display: "inline-block;vertical-align:middle" }, xmlns: "http://www.w3.org/2000/svg", children: _jsx("g", { fill: "#1C2033", children: _jsx("path", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "m2.75 8.75l3.5 3.5l7-7.5" }) }) })] }) : _jsxs("svg", { width: "25", height: "25", viewBox: "0 0 512 512", style: { color: "#1C2033" }, xmlns: "http://www.w3.org/2000/svg", className: "h-full w-full", children: [_jsx("rect", { width: "25", height: "25", x: "0", y: "0", rx: "30", fill: "transparent", stroke: "transparent", strokeWidth: "0", strokeOpacity: "100%", paintOrder: "stroke" }), _jsx("svg", { width: "512px", height: "512px", viewBox: "0 0 24 24", fill: "#1C2033", x: "0", y: "0", role: "img", style: { display: "inline-block;vertical-align:middle" }, xmlns: "http://www.w3.org/2000/svg", children: _jsx("g", { fill: "#1C2033", children: _jsx("path", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeWidth: "2", d: "M20 20L4 4m16 0L4 20" }) }) })] }) }), _jsx("td", { children: _jsxs("svg", { onClick: () => deleteHandler(property.id, property.name), role: 'button', width: "25", height: "25", viewBox: "0 0 512 512", style: { color: "#1C2033" }, xmlns: "http://www.w3.org/2000/svg", className: "h-full w-full", children: [_jsx("rect", { width: "512", height: "512", x: "0", y: "0", rx: "30", fill: "transparent", stroke: "transparent", strokeWidth: "0", strokeOpacity: "100%", paintOrder: "stroke" }), _jsx("svg", { width: "512px", height: "512px", viewBox: "0 0 24 24", fill: "#1C2033", x: "0", y: "0", role: "img", style: { display: "inline-block;vertical-align:middle" }, xmlns: "http://www.w3.org/2000/svg", children: _jsx("g", { fill: "#1C2033", children: _jsx("path", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 6h16l-1.58 14.22A2 2 0 0 1 16.432 22H7.568a2 2 0 0 1-1.988-1.78L4 6Zm3.345-2.853A2 2 0 0 1 9.154 2h5.692a2 2 0 0 1 1.81 1.147L18 6H6l1.345-2.853ZM2 6h20m-12 5v5m4-5v5" }) }) })] }) }), _jsx("td", { children: _jsxs("svg", { onClick: () => editHandler(property.id), role: 'button', width: "25", height: "25", viewBox: "0 0 512 512", style: { color: "currentColor" }, xmlns: "http://www.w3.org/2000/svg", className: "h-full w-full", children: [_jsx("rect", { width: "512", height: "512", x: "0", y: "0", rx: "30", fill: "transparent", stroke: "transparent", strokeWidth: "0", strokeOpacity: "100%", paintOrder: "stroke" }), _jsx("svg", { width: "512px", height: "512px", viewBox: "0 0 24 24", fill: "currentColor", x: "0", y: "0", role: "img", style: { display: "inline-block;vertical-align:middle" }, xmlns: "http://www.w3.org/2000/svg", children: _jsx("g", { fill: "currentColor", children: _jsxs("g", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", children: [_jsx("path", { d: "m16.474 5.408l2.118 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621Z" }), _jsx("path", { d: "M19 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" })] }) }) })] }) })] }, String(property.id))) })] }), show && _jsx(CustomModal, { title: "Eliminar propiedad", size: "lg", children: _jsx(DeleteProperty, { propertyId: selectedId, propertyName: selectedProperty, updateList: getPropertyList }) })] }));
};
export default List;
