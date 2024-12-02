import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Detail.css";
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ImageGallery from "react-image-gallery";
import handleError from '../../utils/HandleErrors';
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import CustomModal from "../../components/CustomModal/CustomModal";
import { Col, Row } from "react-bootstrap";
const webUrl = import.meta.env.VITE_REACT_APP_URL;
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
const Detail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [propertyData, setPropertyData] = useState({
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
    });
    const [slides, setSlides] = useState([]);
    const [show, setShow] = useRecoilState(modalState);
    useEffect(() => {
        const getProperty = async () => {
            try {
                const { data } = await axios(`${SERVER_URL}/api/properties/getById?propertyId=${id}`);
                setPropertyData(data);
                await setSlides(data.images.map((item) => {
                    return { original: item.url, thumbnail: item.thumbnailUrl, originalHeight: "50%" };
                }));
            }
            catch (error) {
                handleError(error);
            }
        };
        if (id)
            getProperty();
    }, []);
    const openModal = () => {
        setShow(true);
    };
    return (_jsxs("div", { className: "container d-flex flex-column justify-content-center align-items-center", children: [_jsxs("div", { className: 'd-flex flex-column flex-xl-row w-100 mt-5 gap-1', style: { minHeight: "500px" }, children: [_jsx("div", { className: 'w-100 w-lg-50 rounded h-sm-50 h-lg-100', children: _jsx(ImageGallery, { items: slides, showThumbnails: false, showFullscreenButton: false, showPlayButton: false, autoPlay: true, additionalClass: 'detail', onClick: openModal }) }), _jsxs("div", { className: 'w-100 w-lg-50 border border-2 rounded text-center d-flex flex-column align-items-center justify-content-between', children: [_jsx("h2", { children: propertyData.name }), _jsx("hr", { style: { width: "90%", color: "#B84644" } }), _jsxs("h3", { className: "fs-4", children: [propertyData.category, " - ", propertyData.location] }), _jsx("hr", { style: { width: "90%", color: "#B84644" } }), _jsxs("div", { className: "w-100 d-flex flex-row gap-1 p-2 justify-content-between text-light", children: [_jsxs("div", { className: "w-25 p-2 rounded border border-2", style: { backgroundColor: "#B84644" }, children: [_jsx("h3", { className: "fs-4", children: propertyData.size }), _jsx("img", { src: '/images/size.webp', alt: "" }), _jsx("div", { className: "" })] }), _jsxs("div", { className: "w-25 p-2 rounded border border-2", style: { backgroundColor: "#B84644" }, children: [_jsx("h3", { className: "fs-4", children: propertyData.bedrooms }), _jsx("img", { src: '/images/bedroom.webp', alt: "" })] }), _jsxs("div", { className: "w-25 p-2 rounded border border-2", style: { backgroundColor: "#B84644" }, children: [_jsx("h3", { className: "fs-4", children: propertyData.bathrooms }), _jsx("img", { src: '/images/bathroom.webp', alt: "" })] }), _jsxs("div", { className: "w-25 p-2 rounded border border-2", style: { backgroundColor: "#B84644" }, children: [_jsx("h3", { className: "fs-4", children: propertyData.kitchen }), _jsx("img", { src: '/images/kitchen.webp', alt: "" })] }), _jsxs("div", { className: "w-25 p-2 rounded border border-2", style: { backgroundColor: "#B84644" }, children: [_jsx("h3", { className: "fs-4", children: propertyData.garage }), _jsx("img", { src: '/images/garage.webp', alt: "" })] })] }), _jsx("hr", { style: { width: "90%", color: "#B84644" } }), _jsxs("div", { className: "d-flex w-100 justify-content-between py-1 px-2", children: [_jsxs("h3", { className: "", children: [propertyData.currency, " ", _jsx("b", { children: propertyData.price })] }), _jsx("a", { href: `https://api.whatsapp.com/send?phone=5492664570187&text=Hola,%20me%20interesa%20saber%20mas%20sobre%20esta%20propiedad:%20${webUrl}${location.pathname}`, target: "_blank", rel: "noopener noreferrer", children: _jsx("img", { className: "", src: '/images/whatsapp.webp', alt: "" }) })] })] })] }), _jsx("hr", { className: "w-100 mt-5", style: { width: "90%", color: "#B84644" } }), _jsx("div", { className: "", children: _jsx("div", { dangerouslySetInnerHTML: { __html: propertyData.description } }) }), _jsx("hr", { className: "w-100", style: { width: "90%", color: "#B84644" } }), _jsx("div", { className: "w-100", children: _jsxs(Row, { className: "w-100 mb-5", children: [_jsxs(Col, { className: "d-flex flex-column gap-1 mt-2", lg: 4, xs: 12, children: [_jsx("p", { className: "mb-0 mt-3", children: _jsx("b", { children: "Otros ambientes:" }) }), propertyData.others.map(item => {
                                    return (_jsxs("div", { className: "d-flex flex-row align-items-center justify-content-start", children: [_jsx("img", { src: '/images/checksmall.webp', alt: "" }), _jsx("p", { className: "my-0 ms-2", children: item })] }, item));
                                })] }), _jsxs(Col, { className: "d-flex flex-column gap-1 mt-2", lg: 4, xs: 12, children: [_jsx("p", { className: "mb-0 mt-3", children: _jsx("b", { children: "Comodidades:" }) }), propertyData.amenities.map(item => {
                                    return (_jsxs("div", { className: "d-flex flex-row align-items-center justify-content-start", children: [_jsx("img", { src: '/images/checksmall.webp', alt: "" }), _jsx("p", { className: "my-0 ms-2", children: item })] }, item));
                                })] }), _jsxs(Col, { className: "d-flex flex-column gap-1 mt-2", lg: 4, xs: 12, children: [_jsx("p", { className: "mb-0 mt-3", children: _jsx("b", { children: "Servicios:" }) }), propertyData.services.map(item => {
                                    return (_jsxs("div", { className: "d-flex flex-row align-items-center justify-content-start", children: [_jsx("img", { src: '/images/checksmall.webp', alt: "" }), _jsx("p", { className: "my-0 ms-2", children: item })] }, item));
                                })] })] }) }), show && _jsx(CustomModal, { size: "xl", backdrop: "", fullscreen: true, children: _jsx(ImageGallery, { items: slides, showThumbnails: false, showFullscreenButton: false, showPlayButton: true, autoPlay: false, additionalClass: 'fullscreen', onClick: openModal }) })] }));
};
export default Detail;
