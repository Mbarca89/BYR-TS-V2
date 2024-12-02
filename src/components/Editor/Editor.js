import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import axios from 'axios';
import { useState, useEffect } from 'react';
import others from '../../utils/others';
import services from '../../utils/services';
import amenities from '../../utils/amenities';
import { notifySuccess } from '../Toaster/Toaster';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { propertyTypes } from '../../utils/propertyTypes';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import handleError from '../../utils/HandleErrors';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
const Editor = ({ propertyId, updateList }) => {
    const [uploading, setUploading] = useState(false);
    const [, setIsloaded] = useState(false);
    const [data, setData] = useState({
        id: '',
        featured: false,
        name: '',
        description: '',
        type: 'Cabaña',
        category: 'Alquiler',
        price: 0,
        currency: '$',
        location: 'San Luis',
        size: 0,
        constructed: 0,
        bedrooms: 0,
        bathrooms: 0,
        kitchen: 0,
        garage: 0,
        others: [],
        services: [],
        amenities: [],
        imageOrder: []
    });
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState();
    const [propertyImages, setPropertyImages] = useState([]);
    const [othersCheck, setOthersCheck] = useState(new Array(others.length).fill(false));
    const [servicesCheck, setServicesCheck] = useState(new Array(services.length).fill(false));
    const [amenitiesCheck, setAmenitiesCheck] = useState(new Array(amenities.length).fill(false));
    const othersHandler = (event, index) => {
        let buffer = othersCheck;
        buffer[index] = !buffer[index];
        setOthersCheck(buffer);
        if (event.target.checked === true) {
            setData({
                ...data,
                others: [...data.others, event.target.value]
            });
        }
        else {
            setData({
                ...data,
                others: [...data.others.filter((item) => item !== event.target.value)]
            });
        }
    };
    const servicesHandler = (event, index) => {
        let buffer = servicesCheck;
        buffer[index] = !buffer[index];
        setServicesCheck(buffer);
        if (event.target.checked === true) {
            setData({
                ...data,
                services: [...data.services, event.target.value]
            });
        }
        else {
            setData({
                ...data,
                services: [...data.services.filter((item) => item !== event.target.value)]
            });
        }
    };
    const amenitiesHandler = (event, index) => {
        let buffer = amenitiesCheck;
        buffer[index] = !buffer[index];
        setAmenitiesCheck(buffer);
        if (event.target.checked === true) {
            setData({
                ...data,
                amenities: [...data.amenities, event.target.value]
            });
        }
        else {
            setData({
                ...data,
                amenities: [...data.amenities.filter((item) => item !== event.target.value)]
            });
        }
    };
    const fileHandler = (event) => {
        const imagesUpload = event.target.files;
        if (imagesUpload) {
            setImages([...images, ...imagesUpload]);
            const files = Array.from(imagesUpload);
            const imagesPreview = files.map((file) => ({
                file,
                preview: URL.createObjectURL(file), // Generar una URL para la vista previa
            }));
            setSelectedImages((selectedImages || []).concat(imagesPreview));
        }
    };
    useEffect(() => {
        // Limpia las URLs de vista previa cuando el componente se desmonta
        return () => {
            selectedImages && selectedImages.forEach((image) => URL.revokeObjectURL(image.preview));
        };
    }, [selectedImages]);
    const deleteImageFromDb = async (index, id) => {
        try {
            const res = await axios.delete(`${SERVER_URL}/api/images/delete?id=${id}`);
            if (res.data) {
                notifySuccess(res.data);
            }
            const newImages = [...propertyImages];
            newImages.splice(index, 1);
            setPropertyImages(newImages);
            const newOrder = [...formik.values.imageOrder];
            newOrder.splice(index, 1);
            formik.setFieldValue("imageOrder", newOrder);
        }
        catch (error) {
            handleError(error);
        }
    };
    const deleteImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
        const newImagesPreview = selectedImages?.slice() || [];
        newImagesPreview.splice(index, 1);
        setSelectedImages(newImagesPreview);
    };
    const moveRight = (index) => {
        const aux = images;
        if (aux) {
            if (index !== aux.length - 1) {
                const temp = aux[index];
                aux[index] = aux[index + 1];
                aux[index + 1] = temp;
                setImages(aux);
                const files = Array.from(aux);
                const imagesPreview = files.map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                }));
                setSelectedImages(imagesPreview);
            }
        }
    };
    const moveLeft = (index) => {
        const aux = images;
        if (aux) {
            if (index !== 0) {
                const temp = aux[index];
                aux[index] = aux[index - 1];
                aux[index - 1] = temp;
                setImages(aux);
                const files = Array.from(aux);
                const imagesPreview = files.map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                }));
                setSelectedImages(imagesPreview);
            }
        }
    };
    const formik = useFormik({
        initialValues: {
            id: data.id,
            featured: data.featured,
            name: data.name,
            description: data.description,
            type: data.type,
            category: data.category,
            price: data.price,
            currency: data.currency,
            location: data.location,
            size: data.size,
            constructed: data.constructed,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            kitchen: data.kitchen,
            garage: data.garage,
            others: data.others,
            services: data.services,
            amenities: data.amenities,
            imageOrder: data.imageOrder
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            setUploading(true);
            try {
                values.others = data.others;
                values.services = data.services;
                values.amenities = data.amenities;
                const formData = new FormData();
                if (images) {
                    let limit = values.imageOrder.length;
                    for (let i = 0; i < images.length; i++) {
                        values.imageOrder.push(i + limit);
                        formData.append('images', images[i]);
                    }
                }
                formData.append('propertyData', JSON.stringify(values));
                setData({
                    ...data,
                    description: DOMPurify.sanitize(data.description)
                });
                const res = await axios.put(`${SERVER_URL}/api/properties/edit/${propertyId}`, formData);
                if (res.data) {
                    notifySuccess(res.data);
                }
                setUploading(false);
                updateList();
            }
            catch (error) {
                handleError(error);
                setUploading(false);
            }
        },
    });
    useEffect(() => {
        const getProperty = async () => {
            try {
                const { data } = await axios(`${SERVER_URL}/api/properties/getById?propertyId=${propertyId}`);
                setData({
                    id: data.id,
                    featured: data.featured,
                    name: data.name,
                    description: data.description,
                    type: data.type,
                    category: data.category,
                    price: data.price,
                    currency: data.currency,
                    location: data.location,
                    size: data.size,
                    constructed: data.constructed,
                    bedrooms: data.bedrooms,
                    bathrooms: data.bathrooms,
                    kitchen: data.kitchen,
                    garage: data.garage,
                    others: data.others,
                    services: data.services,
                    amenities: data.amenities,
                    imageOrder: data.imageOrder
                });
                setPropertyImages(data.images);
                let othersCheckBuffer = othersCheck;
                others.map((item, index) => {
                    if (data.others.toString().includes(item.name))
                        othersCheckBuffer[index] = true;
                    return null;
                });
                setOthersCheck(othersCheckBuffer);
                let servicesCheckBuffer = servicesCheck;
                services.map((item, index) => {
                    if (data.services.toString().includes(item.name))
                        servicesCheckBuffer[index] = true;
                    return null;
                });
                setServicesCheck(servicesCheckBuffer);
                let amenitiesCheckBuffer = amenitiesCheck;
                amenities.map((item, index) => {
                    if (data.amenities.toString().includes(item.name))
                        amenitiesCheckBuffer[index] = true;
                    return null;
                });
                setAmenitiesCheck(amenitiesCheckBuffer);
                setIsloaded(true);
            }
            catch (error) {
                handleError(error);
            }
        };
        if (propertyId)
            getProperty();
    }, []);
    const moveRightOrder = (index) => {
        const aux = formik.values.imageOrder;
        if (aux) {
            if (index !== aux.length - 1) {
                const temp = aux[index];
                aux[index] = aux[index + 1];
                aux[index + 1] = temp;
                formik.setFieldValue('imageOrder', aux);
            }
        }
    };
    const moveLeftOrder = (index) => {
        const aux = formik.values.imageOrder;
        if (aux) {
            if (index !== 0) {
                const temp = aux[index];
                aux[index] = aux[index - 1];
                aux[index - 1] = temp;
                formik.setFieldValue('imageOrder', aux);
            }
        }
    };
    return (_jsxs("div", { className: "d-flex flex-column justify-content-center align-items-center px-3", children: [_jsx("header", { children: _jsx("h2", { children: "Editar propiedad" }) }), _jsxs(Form, { noValidate: true, onSubmit: formik.handleSubmit, className: 'w-100', children: [_jsx("h3", { children: "Informaci\u00F3n B\u00E1sica" }), _jsxs(Col, { lg: 6, children: [_jsxs(Row, { className: 'mb-3', children: [_jsx(Form.Label, { children: "Propiedad destacada" }), _jsx(Form.Group, { children: _jsx(Form.Check, { type: "switch", id: "featured", value: formik.values.featured ? "true" : "false", checked: formik.values.featured, onChange: e => {
                                                formik.setFieldValue("featured", e.target.checked === true);
                                            }, onBlur: formik.handleBlur }) })] }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Nombre" }), _jsx(Form.Control, { type: "text", placeholder: "Nombre", id: "name", name: "name", value: formik.values.name, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsxs(Row, { className: 'mb-5', children: [_jsx(Form.Label, { children: "Descripci\u00F3n" }), _jsx("div", { className: "", children: _jsx(ReactQuill, { style: { height: '300px' }, theme: 'snow', className: "", id: 'description', value: formik.values.description, onChange: value => formik.setFieldValue('description', value) }) })] }), _jsx(Row, { children: _jsx("h3", { className: 'mt-3', children: "Informaci\u00F3n adicional" }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { className: "", children: "Tipo" }), _jsx(Form.Select, { id: "type", name: "type", value: formik.values.type, onChange: formik.handleChange, onBlur: formik.handleBlur, children: propertyTypes.map(type => (_jsx("option", { value: type, children: type }))) })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { className: "", children: "Categor\u00EDa" }), _jsxs(Form.Select, { id: "category", name: "category", value: formik.values.category, onChange: formik.handleChange, onBlur: formik.handleBlur, children: [_jsx("option", { value: "Alquiler", children: "Alquiler" }), _jsx("option", { value: "Alquiler temporario", children: "Alquiler temporario" }), _jsx("option", { value: "Permuta", children: "Permuta" }), _jsx("option", { value: "Venta", children: "Venta" })] })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Precio" }), _jsx(Form.Control, { type: "number", id: "price", name: "price", value: formik.values.price, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { className: "", children: "Moneda" }), _jsxs(Form.Select, { id: "currency", name: "currency", value: formik.values.currency, onChange: formik.handleChange, onBlur: formik.handleBlur, children: [_jsx("option", { value: "$", children: "Pesos" }), _jsx("option", { value: "US$", children: "Dolares" })] })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { className: "", children: "Ubicaci\u00F3n" }), _jsxs(Form.Select, { id: "location", name: "location", value: formik.values.location, onChange: formik.handleChange, onBlur: formik.handleBlur, children: [_jsx("option", { value: "San Luis", children: "San Luis" }), _jsx("option", { value: "Juana Koslay", children: "Juana Koslay" }), _jsx("option", { value: "Potrero De Los Funes", children: "Potrero" }), _jsx("option", { value: "El Volcan", children: "El Volcan" }), _jsx("option", { value: "Estancia Grande", children: "Estancia Grande" }), _jsx("option", { value: "El Trapiche", children: "El Trapiche" }), _jsx("option", { value: "La Florida", children: "La Florida" }), _jsx("option", { value: "La Punta", children: "La Punta" })] })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Superficie" }), _jsx(Form.Control, { type: "number", id: "size", name: "size", value: formik.values.size, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Superficie cubierta" }), _jsx(Form.Control, { type: "number", id: "constructed", name: "constructed", value: formik.values.constructed, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Habitaciones" }), _jsx(Form.Control, { type: "number", id: "bedrooms", name: "bedrooms", value: formik.values.bedrooms, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Ba\u00F1os" }), _jsx(Form.Control, { type: "number", id: "bathrooms", name: "bathrooms", value: formik.values.bathrooms, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Cocina" }), _jsx(Form.Control, { type: "number", id: "kitchen", name: "kitchen", value: formik.values.kitchen, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Garaje" }), _jsx(Form.Control, { type: "number", id: "garage", name: "garage", value: formik.values.garage, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx("h3", { children: "Otros Ambientes" }), _jsx("hr", {}), _jsx(Row, { className: 'mb-3', children: others.map((item, index) => (_jsxs(Col, { md: 4, className: "mb-3", children: [_jsx("input", { type: "checkbox", name: item.name, value: item.name, onChange: (event) => othersHandler(event, index), checked: othersCheck[index] }), _jsx("label", { className: 'ms-1', htmlFor: item.name, children: item.name })] }, index))) }), _jsx("h3", { children: "Servicios" }), _jsx("hr", {}), _jsx(Row, { className: 'mb-3', children: services.map((item, index) => (_jsxs(Col, { md: 4, className: "mb-3", children: [_jsx("input", { type: "checkbox", name: item.name, value: item.name, onChange: (event) => servicesHandler(event, index), checked: servicesCheck[index] }), _jsx("label", { className: 'ms-1', htmlFor: item.name, children: item.name })] }, index))) }), _jsx("h3", { children: "Comodidades" }), _jsx("hr", {}), _jsx(Row, { className: 'mb-3', children: amenities.map((item, index) => (_jsxs(Col, { md: 4, className: "mb-3", children: [_jsx("input", { type: "checkbox", name: item.name, value: item.name, onChange: (event) => amenitiesHandler(event, index), checked: amenitiesCheck[index] }), _jsx("label", { className: 'ms-1', htmlFor: item.name, children: item.name })] }, index))) })] }), _jsxs(Col, { lg: 12, children: [_jsxs(Row, { children: [_jsx("h3", { children: "Im\u00E1genes subidas" }), _jsx("div", { className: "d-flex flex-row gap-2 mb-0", children: _jsx(Row, { children: formik.values.imageOrder.map((image, index) => (_jsxs(Col, { lg: 3, md: 4, style: { height: "250px" }, className: 'd-flex flex-column justify-content-evenly align-items-center', children: [_jsx("img", { src: propertyImages[image]?.thumbnailUrl, alt: "Preview", className: 'w-50 h-50' }), _jsxs("div", { className: 'd-flex justify-content-center align-items-center', children: [_jsx(Button, { onClick: () => moveLeftOrder(index), children: '<' }), _jsx(Button, { className: "", onClick: () => deleteImageFromDb(index, propertyImages[image].id), children: "X" }), _jsx(Button, { onClick: () => moveRightOrder(index), children: '>' })] })] }, index))) }) }), _jsx("hr", {}), _jsx("h3", { children: "Agregar im\u00E1genes" }), _jsx(Row, { className: 'mb-5', children: _jsx("div", { className: "", children: _jsx("input", { type: "file", name: "uploader", accept: "image/png, image/jpeg", multiple: true, onChange: fileHandler }) }) }), _jsx("h3", { children: "Im\u00E1genes elegidas" }), _jsx("hr", {}), _jsx(Row, { className: "mb-5", children: selectedImages ? selectedImages.map((image, index) => (_jsxs(Col, { lg: 3, style: { height: "250px" }, className: 'd-flex flex-column justify-content-evenly align-items-center', children: [_jsx("img", { src: image.preview, alt: "Preview", className: 'w-50 h-50' }), _jsxs("div", { className: "d-flex flex-row justify-content-evenly", children: [_jsx(Button, { onClick: () => moveLeft(index), children: '<' }), _jsx(Button, { className: "", onClick: () => deleteImage(index), children: "X" }), _jsx(Button, { onClick: () => moveRight(index), children: '>' })] })] }, index)))
                                            : _jsx("div", { className: 'd-flex flex-row justify-content-center', children: _jsx("h6", { children: "No se han cargado im\u00E1genes" }) }) })] }), _jsx(Row, { children: uploading ?
                                    _jsx("div", { className: 'd-flex flex-row justify-content-around mt-5 mb-5', children: _jsx(Spinner, {}) })
                                    :
                                        _jsxs("div", { className: 'd-flex flex-row justify-content-around mt-5 mb-5', children: [_jsx(Button, { variant: 'danger', onClick: updateList, children: "Cancelar" }), _jsx(Button, { variant: "primary", type: 'submit', children: "Guardar" })] }) })] })] })] }));
};
export default Editor;
