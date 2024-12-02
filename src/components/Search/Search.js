import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Search.css";
import { Button, Col, Form, Row } from "react-bootstrap";
import { propertyTypes } from "../../utils/propertyTypes";
import { propertyLocations } from "../../utils/propertylocations";
import { operationTypes } from "../../utils/operationType";
import Select from "react-select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Search = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        operationType: null,
        propertyType: null,
        location: null,
    });
    const operationType = operationTypes.map(type => ({ value: type, label: type }));
    const propertyType = propertyTypes.map(type => ({ value: type, label: type }));
    const propertyLocation = propertyLocations.map(type => ({ value: type, label: type }));
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
    const handleSubmit = () => {
        navigate(`/propiedades?type=${filters.operationType?.value}&category=${filters.propertyType?.value || ""}&location=${filters.location?.value || ""}`);
    };
    return (_jsx(Form, { noValidate: true, onSubmit: handleSubmit, children: _jsxs(Row, { className: "gap-3 gap-md-0", children: [_jsx(Col, { xs: 12, md: 3, children: _jsx(Select, { options: operationType, value: filters.operationType, styles: customStyles, placeholder: "Tipo de operaci\u00F3n", onChange: (value) => handleTypeChange(value) }) }), _jsx(Col, { xs: 12, md: 3, children: _jsx(Select, { options: propertyType, value: filters.propertyType, styles: customStyles, placeholder: "Tipo de propiedad", onChange: (value) => handlePropertyTypeChange(value) }) }), _jsx(Col, { xs: 12, md: 3, children: _jsx(Select, { options: propertyLocation, value: filters.location, styles: customStyles, placeholder: "Ubicaci\u00F3n", onChange: (value) => handlePropertyLocationChange(value) }) }), _jsx(Col, { xs: 12, md: 3, className: "d-flex justify-content-end align-items-center", children: _jsx(Button, { type: "submit", className: "custom-search-button rounded w-lg-50 w-sm-100", children: "Buscar" }) })] }) }));
};
export default Search;
