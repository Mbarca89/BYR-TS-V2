import "./Properties.css"
import { useEffect, useState } from "react"
import { PropertyDetailType } from "../../types"
import axios from "axios"
import handleError from "../../utils/HandleErrors";
import { Button, Col, Form, Offcanvas, Pagination, Row } from "react-bootstrap";
import ReactLoading from "react-loading";
import { propertyTypes } from "../../utils/propertyTypes";
import { propertyLocations } from "../../utils/propertylocations";
import { operationTypes } from "../../utils/operationType";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

interface Filters {
    category: { value: string | undefined, label: string | undefined } | null,
    type: { value: string | undefined, label: string | undefined } | null,
    location: { value: string | undefined, label: string | undefined } | null
}

const Properties = () => {

    const operationType = operationTypes.map(type => ({ value: type, label: type }))

    const propertyType = propertyTypes.map(type => ({ value: type, label: type }))

    const propertyLocation = propertyLocations.map(type => ({ value: type, label: type }))

    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [data, setData] = useState<PropertyDetailType[]>([])
    const [filters, setFilters] = useState<Filters>({
        category: null,
        type: null,
        location: null,
    })

    useEffect(() => {
        const getProperties = async () => {
            setLoading(true);
            try {
                const { data } = await axios(
                    `${SERVER_URL}/api/properties/paginated?limit=6&offset=${currentPage - 1}&category=${filters.category?.value || ""}&type=${filters.type?.value || ""}&location=${filters.location?.value || ""}`
                );
                setCurrentPage(data.page.number + 1);
                setTotalPages(data.page.totalPages);
                setData(data._embedded?.propertyResponseDtoList || []);
                setLoading(false);
            } catch (error: any) {
                handleError(error);
            }
        };
        getProperties();
    }, [currentPage, filters]);

    useEffect(() => {
        const category = searchParams.get('category') || '';
        const type = searchParams.get('type') || '';
        const location = searchParams.get('location') || '';
        setFilters({
            type: type ? { value: type, label: type } : null,
            category: category ? { value: category, label: category } : null,
            location: location ? { value: location, label: location } : null,
        });
    }, [searchParams]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const customStyles = {
        option: (provided: any, state: { isFocused: boolean; isSelected: boolean }) => ({
            ...provided,
            backgroundColor: '#d7d7d7',
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
            border: '1px solid #B84644',
            cursor: "pointer",
            boxShadow: 'none',
            '&:hover': {
                border: '1px solid #B84644',
                backgroundColor: "#B84644",
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

    const handleSubmit = () => {

    }

    const updateSearchParams = (newFilters: Filters) => {
        const params: Record<string, string> = {};
        if (newFilters.type?.value) params.type = newFilters.type.value;
        if (newFilters.category?.value) params.category = newFilters.category.value;
        if (newFilters.location?.value) params.location = newFilters.location.value;
        setSearchParams(params);
    };

    const handleFilterChange = (key: keyof Filters, value: Filters[keyof Filters]) => {
        const updatedFilters = { ...filters, [key]: value };
        setFilters(updatedFilters);
        updateSearchParams(updatedFilters); // Actualiza las queries en la URL.
    };

    const resetFilters = () => {
        const reset = { category: null, type: null, location: null };
        setFilters(reset);
        setSearchParams({}); // Limpia las queries en la URL.
    };

    const handleFilterClick = (key: keyof Filters) => {
        const newFilters = { ...filters, [key]: null };
        setFilters(newFilters);

        const updatedParams = new URLSearchParams(searchParams);
        updatedParams.delete(key);
        setSearchParams(updatedParams);
    };

    return (
        !loading ? <div className="w-100 d-flex flex-column justify-content-even">
            <div className="container">
                <Button className="d-xl-none custom-properties-button rounded w-lg-100 w-sm-100 mt-3 variant-none" onClick={handleShow}>Filtrar</Button>
            </div>
            <Offcanvas show={show} onHide={handleClose} responsive="xl" placement="end">
                <Offcanvas.Header closeButton />
                <div className="w-100 h-25 px-3 z-3">
                    <div className="w-100 mt-1 mb-1 d-flex align-items-center" style={{ backgroundColor: "#B84644", height: "75px" }}>
                        <h1 className='fs-1 ms-3 text-light'>Aplicar filtros</h1>
                    </div>
                    <hr className="d-xl-none" />
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row className="gap-3 gap-md-0">
                            <Col xs={12} md={12} xl={3}>
                                <Select className="z-2"
                                    options={operationType}
                                    value={filters.category}
                                    styles={customStyles}
                                    placeholder="Tipo de operación"
                                    onChange={(value) => handleFilterChange("category", value)}
                                />
                            </Col>
                            <Col xs={12} md={12} xl={3}>
                                <Select className="z-2"
                                    options={propertyType}
                                    value={filters.type}
                                    styles={customStyles}
                                    placeholder="Tipo de propiedad"
                                    onChange={(value) => handleFilterChange("type", value)}
                                />
                            </Col>
                            <Col xs={12} md={12} xl={3}>
                                <Select className="z-2"
                                    options={propertyLocation}
                                    value={filters.location}
                                    styles={customStyles}
                                    placeholder="Ubicación"
                                    onChange={(value) => handleFilterChange("location", value)}
                                />
                            </Col>
                            <Col xs={12} md={12} xl={3} className="d-flex justify-content-end align-items-center gap-3">
                                <Button onClick={resetFilters} className="custom-search-button rounded w-lg-50 w-sm-100 variant-none">
                                    Restablecer</Button>
                            </Col>
                        </Row>
                    </Form>
                    <div className="mt-2 d-flex flex-column flex-xl-row gap-2">
                        <p className="m-0">Filtros aplicados: </p>
                        {filters.category?.value && (
                            <p
                                role="button"
                                onClick={() => handleFilterClick("category")}
                                className="px-2 rounded"
                                style={{ backgroundColor: "rgba(0,0,0,.1)" }}
                            >
                                {filters.category.value} x
                            </p>
                        )}
                        {filters.type?.value && (
                            <p
                                role="button"
                                onClick={() => handleFilterClick("type")}
                                className="px-2 rounded"
                                style={{ backgroundColor: "rgba(0,0,0,.1)" }}
                            >
                                {filters.type.value} x
                            </p>
                        )}
                        {filters.location?.value && (
                            <p
                                role="button"
                                onClick={() => handleFilterClick("location")}
                                className="px-2 rounded"
                                style={{ backgroundColor: "rgba(0,0,0,.1)" }}
                            >
                                {filters.location.value} x
                            </p>
                        )}
                    </div>
                </div>
            </Offcanvas>
            <hr style={{ color: "#B84644" }} />
            <div className="d-flex flex-column align-items-center">
                <Row className="container row-gap-3 w-100 d-flex align-items-center justify-content-center">
                    {data.map((property, index) => (
                        <Col
                            key={index}
                            xl={4}
                            lg={6}
                            md={6}
                            xs={12}
                            className=""
                        >
                            <a href={`/detalle/${property.id}`}>
                                <div className="rounded d-flex position-relative border w-100 h-100">
                                    <div className="w-100" style={{ aspectRatio: "4 / 3", position: "relative" }}>
                                        <img
                                            className="rounded img-fluid object-fit-cover w-100 h-100"
                                            src={property.images[property.imageOrder[0]].thumbnailUrl}
                                            alt=""
                                        />
                                    </div>
                                    <div>
                                        <img
                                            className="position-absolute top-0 end-0 w-50 z-1"
                                            src={property.category === "Venta" ? "/images/Venta.webp" : "/images/Alquiler.webp"}
                                            alt=""
                                        />
                                    </div>
                                    <div className="position-absolute bottom-0 w-100 text-light mb-1 d-flex flex-column justify-content-between p-1" style={{ backgroundColor: "rgba(0,0,0,.3)", height: "35%", fontSize: "1em" }}>
                                        <p className="text-truncate m-0">{property.name}</p>
                                        <p className="m-0">{property.location}</p>
                                        <div className="d-flex align-items-center justify-content-start gap-2">
                                            Precio:{property.price == 0 ? <p className="m-0">Consultar</p> : <p className="m-0 text-truncate">{property.currency} {property.price}</p>}
                                            <div className="d-flex gap-1">
                                                {(property.type === 'Casa' || property.type === 'Departamento' || property.type === 'Cabaña' || property.type === 'Duplex' || property.type === 'Monoambiente') && <img src="/images/bedroom.webp" />}
                                                <p className="m-0">{property.bedrooms} Hab.</p>
                                            </div>
                                            <div className="d-flex gap-1">
                                                {(property.type === 'Casa' || property.type === 'Departamento' || property.type === 'Cabaña' || property.type === 'Duplex' || property.type === 'Monoambiente') && <img src="/images/bathroom.webp" />}
                                                <p className="m-0">{property.bathrooms} Bñ.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </Col>
                    ))}
                </Row>
                <div className="w-100 d-flex align-items-center justify-content-center">
                    <Pagination className='mt-5' >
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {currentPage > 2 && <Pagination.Item
                            key={currentPage - 2}
                            onClick={() => handlePageChange(currentPage - 2)}
                        >
                            {currentPage - 2}
                        </Pagination.Item>}
                        {currentPage > 1 && <Pagination.Item
                            key={currentPage - 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            {currentPage - 1}
                        </Pagination.Item>}
                        <Pagination.Item
                            key={currentPage}
                            linkClassName="text-dark"
                            active
                            onClick={() => handlePageChange(currentPage)}
                        >
                            {currentPage}
                        </Pagination.Item>
                        {currentPage <= totalPages - 1 && <Pagination.Item
                            key={currentPage + 1}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            {currentPage + 1}
                        </Pagination.Item>}
                        {currentPage <= totalPages - 2 && <Pagination.Item
                            key={currentPage + 2}
                            onClick={() => handlePageChange(currentPage + 2)}
                        >
                            {currentPage + 2}
                        </Pagination.Item>}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            </div>
        </div> :
            <div className="d-flex justify-content-center align-items-center h-100">
                <ReactLoading type='spinningBubbles' color='#4a4a4a' height={'5%'} width={'5%'} />
            </div>
    )
}

export default Properties