import { jsx as _jsx } from "react/jsx-runtime";
import "react-image-gallery/styles/css/image-gallery.css";
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ImageGallery from "react-image-gallery";
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import handleError from '../../utils/HandleErrors';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
const MainCarousel = () => {
    const navigate = useNavigate();
    const galleryRef = useRef(null);
    const [isLoaded, setIsloaded] = useState(false);
    const [slides, setSlides] = useState([]);
    useEffect(() => {
        const getFeatured = async () => {
            try {
                const res = await axios(`${SERVER_URL}/api/properties/featured`);
                if (res.data)
                    await setSlides(res.data.map((item) => {
                        return { original: item.images[item.imageOrder[0]].url, id: item.id, name: item.name, location: item.location, description: `${item.name} | ${item.location}` };
                    }));
                setIsloaded(true);
            }
            catch (error) {
                handleError(error);
            }
        };
        getFeatured();
    }, []);
    const handleClick = () => {
        if (!galleryRef.current)
            return;
        navigate(`/detalle/${slides[galleryRef.current.getCurrentIndex()].id}`);
    };
    return (isLoaded ?
        _jsx("div", { className: "w-100 home-gallery", children: _jsx(ImageGallery, { ref: galleryRef, items: slides, showThumbnails: false, showFullscreenButton: false, showPlayButton: false, autoPlay: true, onClick: handleClick, additionalClass: "home-gallery" }) }) :
        _jsx("div", { className: "d-flex justify-content-center", children: _jsx(ReactLoading, { type: 'spinningBubbles', color: '#4a4a4a', height: '5%', width: '5%' }) }));
};
export default MainCarousel;
