import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./LastCarousel.css";
import axios from "axios";
import { useEffect, useState } from "react";
import handleError from "../../utils/HandleErrors";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
const LastCarousel = () => {
    const navigate = useNavigate();
    const [slides, setSlides] = useState([]);
    const [isLoaded, setIsloaded] = useState(false);
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4,
            slidesToSlide: 2, // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1025, min: 576 },
            items: 3,
            slidesToSlide: 2, // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 576, min: 0 },
            items: 2,
            slidesToSlide: 1, // optional, default to 1.
        },
    };
    useEffect(() => {
        const getLastProperties = async () => {
            try {
                const res = await axios(`${SERVER_URL}/api/properties/last`);
                if (res.data)
                    await setSlides(res.data.map((item) => {
                        return { thumbnail: item.images[item.imageOrder[0]].thumbnailUrl, id: item.id, name: item.name, location: item.location, description: `${item.name} | ${item.location}` };
                    }));
                setIsloaded(true);
            }
            catch (error) {
                handleError(error);
            }
        };
        getLastProperties();
    }, []);
    const CustomRightArrow = ({ onClick }) => {
        return _jsx("button", { className: "last-right-arrow", onClick: () => onClick(), children: "\u232A" });
    };
    const CustomLeftArrow = ({ onClick }) => {
        return _jsx("button", { className: "last-left-arrow", onClick: () => onClick(), children: "\u2329" });
    };
    return (isLoaded ?
        _jsx("div", { className: "position-relative", style: {
                paddingBottom: '30px'
            }, children: _jsx(Carousel, { responsive: responsive, infinite: true, className: "", containerClass: "container ps-4 ps-lg-5", removeArrowOnDeviceType: 'mobile', autoPlay: true, autoPlaySpeed: 4000, showDots: true, renderDotsOutside: true, customRightArrow: _jsx(CustomRightArrow, {}), customLeftArrow: _jsx(CustomLeftArrow, {}), children: slides.map((property, index) => {
                    return (_jsx("div", { className: "w-100 h-100", style: { cursor: "pointer" }, onClick: () => navigate(`/detalle/${property.id}`), children: _jsxs("div", { className: "d-flex flex-column align-items-center justify-content-center rounded p-1", style: { width: "70%", height: "90%", backgroundColor: "rgba(0,0,0,.1)" }, children: [_jsx("div", { className: "rounded h-50 w-100", style: {}, children: _jsx("img", { src: property.thumbnail, alt: "", className: "h-100 w-100 rounded" }) }), _jsx("hr", { className: "w-100 p-0 mb-0", style: { color: "#B84644" } }), _jsx("div", { className: "h-50 text-center d-flex flex-column align-items-center justify-content-center", children: _jsx("p", { className: "m-0", style: { color: "#4a4a4a" }, children: property.name }) })] }, index) }, index));
                }) }) }) :
        _jsx("div", { className: "d-flex justify-content-center", children: _jsx(ReactLoading, { type: 'spinningBubbles', color: '#4a4a4a', height: '5%', width: '5%' }) }));
};
export default LastCarousel;
