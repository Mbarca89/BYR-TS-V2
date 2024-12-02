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
const Uploader = ({ updateList }) => {
    const [uploading, setUploading] = useState(false);
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
    const [othersCheck, setOthersCheck] = useState(new Array(others.length).fill(false));
    const [servicesCheck, setServicesCheck] = useState(new Array(services.length).fill(false));
    const [amenitiesCheck, setAmenitiesCheck] = useState(new Array(amenities.length).fill(false));
    const [inputKey, setInputKey] = useState('asd');
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
    const resetHandler = () => {
        setData({
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
        setOthersCheck(new Array(others.length).fill(false));
        setServicesCheck(new Array(services.length).fill(false));
        setAmenitiesCheck(new Array(amenities.length).fill(false));
        setImages([]);
        setSelectedImages([]);
        setInputKey('123');
        formik.resetForm();
    };
    const validate = (values) => {
        const errors = {};
        if (!values.name.trim())
            errors.name = "Ingrese el nombre de la propiedad";
        return errors;
    };
    const formik = useFormik({
        initialValues: {
            id: "",
            featured: false,
            name: "",
            description: "",
            type: "Cabaña",
            category: "Alquiler",
            price: undefined,
            currency: "$",
            location: "San Luis",
            size: undefined,
            constructed: undefined,
            bedrooms: undefined,
            bathrooms: undefined,
            kitchen: undefined,
            garage: undefined,
            others: othersCheck,
            services: servicesCheck,
            amenities: amenitiesCheck,
            imageOrder: new Array
        },
        validate,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setUploading(true);
            values.others = data.others;
            values.services = data.services;
            values.amenities = data.amenities;
            values.size = values.size || 0;
            values.price = values.price || 0;
            values.constructed = values.constructed || 0;
            values.bedrooms = values.bedrooms || 0;
            values.bathrooms = values.bathrooms || 0;
            values.kitchen = values.kitchen || 0;
            values.garage = values.garage || 0;
            const formData = new FormData();
            if (images) {
                for (let i = 0; i < images.length; i++) {
                    values.imageOrder.push(i);
                    formData.append('images', images[i]);
                }
            }
            formData.append('propertyData', JSON.stringify(values));
            setData({
                ...data,
                description: DOMPurify.sanitize(data.description)
            });
            try {
                const res = await axios.post(`${SERVER_URL}/api/properties/publish`, formData);
                if (res.data) {
                    notifySuccess(res.data);
                }
                resetHandler();
                setUploading(false);
                updateList();
            }
            catch (error) {
                handleError(error);
                setUploading(false);
            }
        },
    });
    return (_jsxs("div", { className: "d-flex flex-column justify-content-center align-items-center px-3", children: [_jsx("header", { children: _jsx("h2", { children: "Publicar propiedad" }) }), _jsxs(Form, { noValidate: true, onSubmit: formik.handleSubmit, className: 'w-100', children: [_jsx("h3", { children: "Informaci\u00F3n B\u00E1sica" }), _jsxs(Col, { lg: 6, children: [_jsxs(Row, { className: 'mb-3', children: [_jsx(Form.Label, { children: "Propiedad destacada" }), _jsx(Form.Group, { children: _jsx(Form.Check, { type: "switch", id: "featured", value: formik.values.featured ? "true" : "false", onChange: e => {
                                                formik.setFieldValue("featured", e.target.checked === true);
                                            }, onBlur: formik.handleBlur }) })] }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Nombre" }), _jsx(Form.Control, { type: "text", placeholder: "Nombre", id: "name", name: "name", value: formik.values.name, onChange: formik.handleChange, onBlur: formik.handleBlur, isInvalid: !!(formik.touched.name && formik.errors.name) }), _jsx(Form.Control.Feedback, { type: "invalid", children: formik.errors.name })] }) }), _jsxs(Row, { className: 'mb-5', children: [_jsx(Form.Label, { children: "Descripci\u00F3n" }), _jsx("div", { className: "", children: _jsx(ReactQuill, { style: { height: '300px' }, theme: 'snow', className: "", id: 'description', onChange: value => formik.setFieldValue('description', value) }) })] }), _jsx(Row, { children: _jsx("h3", { className: 'mt-3', children: "Informaci\u00F3n adicional" }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { className: "", children: "Tipo" }), _jsx(Form.Select, { id: "type", name: "type", value: formik.values.type, onChange: formik.handleChange, onBlur: formik.handleBlur, children: propertyTypes.map(type => (_jsx("option", { value: type, children: type }))) })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { className: "", children: "Categor\u00EDa" }), _jsxs(Form.Select, { id: "category", name: "category", value: formik.values.category, onChange: formik.handleChange, onBlur: formik.handleBlur, children: [_jsx("option", { value: "Alquiler", children: "Alquiler" }), _jsx("option", { value: "Alquiler temporario", children: "Alquiler temporario" }), _jsx("option", { value: "Permuta", children: "Permuta" }), _jsx("option", { value: "Venta", children: "Venta" })] })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Precio" }), _jsx(Form.Control, { type: "number", id: "price", name: "price", value: formik.values.price, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { className: "", children: "Moneda" }), _jsxs(Form.Select, { id: "currency", name: "currency", value: formik.values.currency, onChange: formik.handleChange, onBlur: formik.handleBlur, children: [_jsx("option", { value: "$", children: "Pesos" }), _jsx("option", { value: "US$", children: "Dolares" })] })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { className: "", children: "Ubicaci\u00F3n" }), _jsxs(Form.Select, { id: "location", name: "location", value: formik.values.location, onChange: formik.handleChange, onBlur: formik.handleBlur, children: [_jsx("option", { value: "San Luis", children: "San Luis" }), _jsx("option", { value: "Juana Koslay", children: "Juana Koslay" }), _jsx("option", { value: "Potrero De Los Funes", children: "Potrero" }), _jsx("option", { value: "El Volcan", children: "El Volcan" }), _jsx("option", { value: "Estancia Grande", children: "Estancia Grande" }), _jsx("option", { value: "El Trapiche", children: "El Trapiche" }), _jsx("option", { value: "La Florida", children: "La Florida" }), _jsx("option", { value: "La Punta", children: "La Punta" })] })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Superficie" }), _jsx(Form.Control, { type: "number", id: "size", name: "size", value: formik.values.size, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Superficie cubierta" }), _jsx(Form.Control, { type: "number", id: "constructed", name: "constructed", value: formik.values.constructed, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Habitaciones" }), _jsx(Form.Control, { type: "number", id: "bedrooms", name: "bedrooms", value: formik.values.bedrooms, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Ba\u00F1os" }), _jsx(Form.Control, { type: "number", id: "bathrooms", name: "bathrooms", value: formik.values.bathrooms, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Cocina" }), _jsx(Form.Control, { type: "number", id: "kitchen", name: "kitchen", value: formik.values.kitchen, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx(Row, { className: 'mb-3', children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Garaje" }), _jsx(Form.Control, { type: "number", id: "garage", name: "garage", value: formik.values.garage, onChange: formik.handleChange, onBlur: formik.handleBlur })] }) }), _jsx("h3", { children: "Otros Ambientes" }), _jsx("hr", {}), _jsx(Row, { className: 'mb-3', children: others.map((item, index) => (_jsxs(Col, { md: 4, className: "mb-3", children: [_jsx("input", { type: "checkbox", name: item.name, value: item.name, onChange: (event) => othersHandler(event, index), checked: othersCheck[index] }), _jsx("label", { className: 'ms-1', htmlFor: item.name, children: item.name })] }, index))) }), _jsx("h3", { children: "Servicios" }), _jsx("hr", {}), _jsx(Row, { className: 'mb-3', children: services.map((item, index) => (_jsxs(Col, { md: 4, className: "mb-3", children: [_jsx("input", { type: "checkbox", name: item.name, value: item.name, onChange: (event) => servicesHandler(event, index), checked: servicesCheck[index] }), _jsx("label", { className: 'ms-1', htmlFor: item.name, children: item.name })] }, index))) }), _jsx("h3", { children: "Comodidades" }), _jsx("hr", {}), _jsx(Row, { className: 'mb-3', children: amenities.map((item, index) => (_jsxs(Col, { md: 4, className: "mb-3", children: [_jsx("input", { type: "checkbox", name: item.name, value: item.name, onChange: (event) => amenitiesHandler(event, index), checked: amenitiesCheck[index] }), _jsx("label", { className: 'ms-1', htmlFor: item.name, children: item.name })] }, index))) }), _jsxs(Row, { children: [_jsx("h3", { children: "Cargar im\u00E1genes" }), _jsx("hr", {}), _jsx(Row, { className: 'mb-5', children: _jsx("div", { className: "", children: _jsx("input", { type: "file", name: "uploader", accept: "image/png, image/jpeg, image/png", multiple: true, onChange: fileHandler }, inputKey) }) }), _jsx("h3", { children: "Im\u00E1genes elegidas" }), _jsx("hr", {}), _jsx(Row, { className: "mb-5", children: selectedImages ? selectedImages.map((image, index) => (_jsxs(Col, { lg: 2, children: [_jsx("img", { className: 'w-100', src: image.preview, alt: "Preview" }), _jsxs("div", { className: "d-flex flex-row justify-content-evenly", children: [_jsx(Button, { onClick: () => moveLeft(index), children: '<' }), _jsx(Button, { className: "", onClick: () => deleteImage(index), children: "X" }), _jsx(Button, { onClick: () => moveRight(index), children: '>' })] })] }, index)))
                                            : _jsx("div", { className: 'd-flex flex-row justify-content-center', children: _jsx("h6", { children: "No se han cargado im\u00E1genes" }) }) })] }), _jsx(Row, { children: uploading ?
                                    _jsx("div", { className: 'd-flex flex-row justify-content-around mt-5 mb-5', children: _jsx(Spinner, {}) })
                                    :
                                        _jsxs("div", { className: 'd-flex flex-row justify-content-around mt-5 mb-5', children: [_jsx(Button, { variant: 'danger', onClick: updateList, children: "Cancelar" }), _jsx(Button, { variant: "primary", type: 'submit', children: "Publicar" })] }) })] })] })] }));
};
export default Uploader;
