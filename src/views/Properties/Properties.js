import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Properties.css";
import { useEffect, useState } from "react";
import axios from "axios";
import handleError from "../../utils/HandleErrors";
import { Button, Col, Form, Offcanvas, Pagination, Row } from "react-bootstrap";
import ReactLoading from "react-loading";
import { propertyTypes } from "../../utils/propertyTypes";
import { propertyLocations } from "../../utils/propertylocations";
import { operationTypes } from "../../utils/operationType";
import Select from "react-select";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
const Properties = () => {
    const operationType = operationTypes.map(type => ({ value: type, label: type }));
    const propertyType = propertyTypes.map(type => ({ value: type, label: type }));
    const propertyLocation = propertyLocations.map(type => ({ value: type, label: type }));
    const queryFilters = new URLSearchParams(window.location.search);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [data, setData] = useState([{
            id: '',
            name: '',
            description: '',
            type: '',
            category: '',
            price: 0,
            currency: '',
            location: '',
            size: 0,
            constructed: 0,
            bedrooms: 0,
            bathrooms: 0,
            kitchen: 0,
            garage: 0,
            others: [],
            services: [],
            amenities: [],
            featured: true,
            images: [],
            imageOrder: []
        }]);
    const [filters, setFilters] = useState({
        operationType: null,
        propertyType: null,
        location: null,
    });
    useEffect(() => {
        const getProperties = async () => {
            setLoading(true);
            try {
                const { data } = await axios(`${SERVER_URL}/api/properties/paginated?limit=6&offset=${currentPage - 1}&type=${filters.propertyType?.value || ""}&category=${filters.operationType?.value || ""}&location=${filters.location?.value || ""}`);
                console.log(data);
                setCurrentPage(data.page.number + 1);
                setTotalPages(data.page.totalPages);
                setData(data._embedded?.propertyResponseDtoList || []);
                setLoading(false);
            }
            catch (error) {
                handleError(error);
            }
        };
        getProperties();
    }, [currentPage, filters]);
    useEffect(() => {
        if (queryFilters.size) {
            const type = queryFilters.get('type') || '';
            const category = queryFilters.get('category') || '';
            const location = queryFilters.get('location') || '';
            let filters = {
                operationType: type ? { value: type, label: type } : null,
                propertyType: category ? { value: category, label: category } : null,
                location: location ? { value: location, label: location } : null
            };
            setFilters(filters);
        }
    }, []);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: '#d7d7d7',
            color: state.isFocused ? '#B84644' : 'black',
            borderLeft: state.isFocused ? "solid 2px #B84644" : "none",
            padding: 10,
        }),
        control: (provided) => ({
            ...provided,
            display: "flex",
            flexDirection: "row",
            padding: "15px",
            margin: "0",
            backgroundColor: "#4a4a4a",
            color: "white",
            border: '1px solid #ced4da',
            boxShadow: 'none',
            '&:hover': {
                border: '1px solid #B84644',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "white",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "white",
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: "white",
        })
    };
    const handleSubmit = () => {
    };
    const handleTypeChange = (value) => {
        setFilters({
            ...filters,
            operationType: value
        });
    };
    const handlePropertyTypeChange = (value) => {
        setFilters({
            ...filters,
            propertyType: value
        });
    };
    const handlePropertyLocationChange = (value) => {
        setFilters({
            ...filters,
            location: value
        });
    };
    const resetFilters = () => {
        setFilters({
            operationType: null,
            propertyType: null,
            location: null,
        });
    };
    console.log(filters);
    return (!loading ? _jsxs("div", { className: "h-100 w-100 d-flex flex-column justify-content-even", children: [_jsx(Button, { className: "d-xl-none custom-properties-button rounded w-lg-100 w-sm-100 mt-3 variant-none", onClick: handleShow, children: "Filtrar" }), _jsxs(Offcanvas, { show: show, onHide: handleClose, responsive: "xl", placement: "end", children: [_jsx(Offcanvas.Header, { closeButton: true }), _jsxs("div", { className: "w-100 h-25 px-3 z-3", children: [_jsx("div", { className: "w-100 mt-1 mb-1 d-flex align-items-center", style: { backgroundColor: "#B84644", height: "75px" }, children: _jsx("h1", { className: 'fs-1 ms-3 text-light', children: "Aplicar filtros" }) }), _jsx("hr", { className: "d-xl-none" }), _jsx(Form, { noValidate: true, onSubmit: handleSubmit, children: _jsxs(Row, { className: "gap-3 gap-md-0", children: [_jsx(Col, { xs: 12, md: 12, xl: 3, children: _jsx(Select, { className: "z-2", options: operationType, value: filters.operationType, styles: customStyles, placeholder: "Tipo de operaci\u00F3n", onChange: (value) => handleTypeChange(value) }) }), _jsx(Col, { xs: 12, md: 12, xl: 3, children: _jsx(Select, { className: "z-2", options: propertyType, value: filters.propertyType, styles: customStyles, placeholder: "Tipo de propiedad", onChange: (value) => handlePropertyTypeChange(value) }) }), _jsx(Col, { xs: 12, md: 12, xl: 3, children: _jsx(Select, { className: "z-2", options: propertyLocation, value: filters.location, styles: customStyles, placeholder: "Ubicaci\u00F3n", onChange: (value) => handlePropertyLocationChange(value) }) }), _jsx(Col, { xs: 12, md: 12, xl: 3, className: "d-flex justify-content-end align-items-center gap-3", children: _jsx(Button, { onClick: resetFilters, className: "custom-search-button rounded w-lg-50 w-sm-100", children: "Restablecer" }) })] }) }), _jsxs("div", { className: "mt-2 d-flex flex-column flex-xl-row gap-2", children: [_jsx("p", { className: "m-0", children: "filtros aplicados: " }), filters.operationType?.value && _jsxs("p", { role: "button", onClick: () => setFilters({ ...filters, operationType: null }), className: "px-2 rounded", style: { backgroundColor: "rgba(0,0,0,.1)", }, children: [filters.operationType.value, " x"] }), filters.propertyType?.value && _jsxs("p", { role: "button", onClick: () => setFilters({ ...filters, propertyType: null }), className: "px-2 rounded", style: { backgroundColor: "rgba(0,0,0,.1)", }, children: [filters.propertyType.value, " x"] }), filters.location?.value && _jsxs("p", { role: "button", onClick: () => setFilters({ ...filters, location: null }), className: "px-2 rounded", style: { backgroundColor: "rgba(0,0,0,.1)", }, children: [filters.location.value, " x"] })] })] })] }), _jsx("hr", { style: { color: "#B84644" } }), _jsxs("div", { className: "d-flex flex-column align-items-center", children: [_jsx(Row, { className: "container row-gap-3 w-100 d-flex align-items-center justify-content-center", children: data.map((property, index) => (_jsx(Col, { xl: 4, lg: 6, md: 6, xs: 12, className: "", children: _jsx("a", { href: `/detalle/${property.id}`, children: _jsxs("div", { className: "rounded d-flex position-relative border w-100 h-100", children: [_jsx("div", { className: "w-100", style: { aspectRatio: "4 / 3", position: "relative" }, children: _jsx("img", { className: "rounded img-fluid object-fit-cover w-100 h-100", src: property.images[property.imageOrder[0]].thumbnailUrl, alt: "" }) }), _jsx("div", { children: _jsx("img", { className: "position-absolute top-0 end-0 w-50 z-1", src: property.category === "Venta" ? "/images/Venta.webp" : "/images/Alquiler.webp", alt: "" }) }), _jsxs("div", { className: "position-absolute bottom-0 w-100 text-light mb-1 d-flex flex-column justify-content-between p-1", style: { backgroundColor: "rgba(0,0,0,.3)", height: "35%", fontSize: "1em" }, children: [_jsx("p", { className: "text-truncate m-0", children: property.name }), _jsx("p", { className: "m-0", children: property.location }), _jsxs("div", { className: "d-flex align-items-center justify-content-start gap-2", children: ["Precio:", property.price == 0 ? _jsx("p", { className: "m-0", children: "Consultar" }) : _jsxs("p", { className: "m-0 text-truncate", children: [property.currency, " ", property.price] }), _jsxs("div", { className: "d-flex gap-1", children: [(property.type === 'Casa' || property.type === 'Departamento' || property.type === 'Cabaña' || property.type === 'Duplex' || property.type === 'Monoambiente') && _jsx("img", { src: "/images/bedroom.webp" }), _jsxs("p", { className: "m-0", children: [property.bedrooms, " Hab."] })] }), _jsxs("div", { className: "d-flex gap-1", children: [(property.type === 'Casa' || property.type === 'Departamento' || property.type === 'Cabaña' || property.type === 'Duplex' || property.type === 'Monoambiente') && _jsx("img", { src: "/images/bathroom.webp" }), _jsxs("p", { className: "m-0", children: [property.bathrooms, " B\u00F1."] })] })] })] })] }) }) }, index))) }), _jsx("div", { className: "w-100 d-flex align-items-center justify-content-center", children: _jsxs(Pagination, { className: 'mt-5', children: [_jsx(Pagination.First, { onClick: () => handlePageChange(1), disabled: currentPage === 1 }), _jsx(Pagination.Prev, { onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1 }), currentPage > 2 && _jsx(Pagination.Item, { onClick: () => handlePageChange(currentPage - 2), children: currentPage - 2 }, currentPage - 2), currentPage > 1 && _jsx(Pagination.Item, { onClick: () => handlePageChange(currentPage - 1), children: currentPage - 1 }, currentPage - 1), _jsx(Pagination.Item, { linkClassName: "text-dark", active: true, onClick: () => handlePageChange(currentPage), children: currentPage }, currentPage), currentPage <= totalPages - 1 && _jsx(Pagination.Item, { onClick: () => handlePageChange(currentPage + 1), children: currentPage + 1 }, currentPage + 1), currentPage <= totalPages - 2 && _jsx(Pagination.Item, { onClick: () => handlePageChange(currentPage + 2), children: currentPage + 2 }, currentPage + 2), _jsx(Pagination.Next, { onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages }), _jsx(Pagination.Last, { onClick: () => handlePageChange(totalPages), disabled: currentPage === totalPages })] }) })] })] }) :
        _jsx("div", { className: "d-flex justify-content-center align-items-center h-100", children: _jsx(ReactLoading, { type: 'spinningBubbles', color: '#4a4a4a', height: '5%', width: '5%' }) }));
};
export default Properties;
