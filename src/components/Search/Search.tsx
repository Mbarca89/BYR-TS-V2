import "./Search.css"
import { Button, Col, Form, Row } from "react-bootstrap"
import { propertyTypes } from "../../utils/propertyTypes";
import { propertyLocations } from "../../utils/propertylocations";
import { operationTypes } from "../../utils/operationType";
import Select from "react-select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Filters {
    operationType: {value: string | undefined, label: string | undefined} | null,
    propertyType: {value: string | undefined, label: string | undefined} | null,
    location: {value: string | undefined, label: string | undefined} | null
}

const Search = () => {

    const navigate = useNavigate()

    const [filters, setFilters] = useState<Filters>({
        operationType: null,
        propertyType: null,
        location: null,
    })

    const operationType = operationTypes.map(type => ({value: type, label: type}))

    const propertyType = propertyTypes.map(type => ({value: type, label: type}))

    const propertyLocation = propertyLocations.map(type => ({value: type, label: type}))

    const customStyles = {
        option: (provided: any, state: { isFocused: boolean; isSelected: boolean }) => ({
            ...provided,
            backgroundColor:'#d7d7d7',
            color: state.isFocused ? '#B84644' : 'black',
            borderLeft: state.isFocused ? "solid 2px #B84644" : "none",
            padding: 10,
        }),
        control: (provided: any) => ({
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
        singleValue: (provided: any) => ({
            ...provided,
            color: "white",
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: "white",
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            color: "white",
        })
    };

    const handleTypeChange = (value:any) => {
        setFilters({
            ...filters,
            operationType: value
        })
    }

    const handlePropertyTypeChange = (value:any) => {
        setFilters({
            ...filters,
            propertyType: value
        })
    }

    const handlePropertyLocationChange = (value:any) => {
        setFilters({
            ...filters,
            location: value
        })
    }


    const handleSubmit = () => {
        navigate(`/propiedades?type=${filters.operationType?.value}&category=${filters.propertyType?.value || ""}&location=${filters.location?.value || ""}`)
    }

    return (
        <Form noValidate onSubmit={handleSubmit}>
            <Row className="gap-3 gap-md-0">
                <Col xs={12} md={3}>
                    <Select
                        options={operationType}
                        value={filters.operationType}
                        styles={customStyles}
                        placeholder="Tipo de operación"
                        onChange={(value)=>handleTypeChange(value)}
                    />
                </Col>
                <Col xs={12} md={3}>
                    <Select
                        options={propertyType}
                        value={filters.propertyType}
                        styles={customStyles}
                        placeholder="Tipo de propiedad"
                        onChange={(value)=>handlePropertyTypeChange(value)}
                    />
                </Col><Col xs={12} md={3}>
                    <Select
                        options={propertyLocation}
                        value={filters.location}
                        styles={customStyles}
                        placeholder="Ubicación"
                        onChange={(value)=>handlePropertyLocationChange(value)}
                    />
                </Col>
                <Col xs={12} md={3} className="d-flex justify-content-end align-items-center">
                    <Button type="submit" className="custom-search-button rounded w-lg-50 w-sm-100">
                        Buscar</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default Search