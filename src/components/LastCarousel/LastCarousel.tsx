import './LastCarousel.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselModule from 'react-multi-carousel';
import type { CarouselProps } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from '../../utils/api';
import handleError from '../../utils/HandleErrors';
import { CarouselItemType } from '../../types';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const Carousel = ((CarouselModule as any).default || CarouselModule) as React.ComponentType<CarouselProps>;

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4, slidesToSlide: 2 },
    tablet: { breakpoint: { max: 1025, min: 576 }, items: 3, slidesToSlide: 2 },
    mobile: { breakpoint: { max: 576, min: 0 }, items: 2, slidesToSlide: 1 },
};

const LastCarousel = () => {
    const navigate = useNavigate();
    const [slides, setSlides] = useState<CarouselItemType[]>([]);
    const [isLoaded, setIsloaded] = useState(false);

    useEffect(() => {
        const getLastProperties = async () => {
            try {
                const res = await axios(`${SERVER_URL}/api/properties/last`);
                if (res.data) {
                    setSlides(res.data.map((item: any) => ({
                        thumbnail: item.images?.[0]?.thumbnailUrl || '/images/noImage.webp',
                        id: item.id,
                        name: item.name,
                        location: item.location,
                        description: `${item.name} | ${item.location}`,
                    })));
                }
            } catch (error: any) {
                handleError(error);
            } finally {
                setIsloaded(true);
            }
        };
        getLastProperties();
    }, []);

    const CustomRightArrow = ({ onClick }: any) => (
        <button className="last-right-arrow" onClick={() => onClick()}>{'>'}</button>
    );

    const CustomLeftArrow = ({ onClick }: any) => (
        <button className="last-left-arrow" onClick={() => onClick()}>{'<'}</button>
    );

    if (!isLoaded) return <div className="d-flex justify-content-center"><LoadingSpinner /></div>;

    return (
        <div className="position-relative" style={{ paddingBottom: '30px' }}>
            <Carousel
                responsive={responsive}
                infinite
                containerClass="container ps-4 ps-lg-5"
                removeArrowOnDeviceType="mobile"
                autoPlay
                autoPlaySpeed={4000}
                showDots
                renderDotsOutside
                customRightArrow={<CustomRightArrow />}
                customLeftArrow={<CustomLeftArrow />}
            >
                {slides.map((property, index) => (
                    <div className="w-100 h-100" style={{ cursor: 'pointer' }} key={index} onClick={() => navigate(`/detalle/${property.id}`)}>
                        <div className="d-flex flex-column align-items-center justify-content-center rounded p-1" style={{ width: '70%', height: '90%', backgroundColor: 'rgba(0,0,0,.1)' }}>
                            <div className="rounded h-50 w-100">
                                <img
                                    src={property.thumbnail || '/images/noImage.webp'}
                                    alt=""
                                    className="h-100 w-100 rounded"
                                />
                            </div>
                            <hr className="w-100 p-0 mb-0" style={{ color: '#B84644' }} />
                            <div className="h-50 text-center d-flex flex-column align-items-center justify-content-center">
                                <p className="m-0" style={{ color: '#4a4a4a' }}>{property.name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default LastCarousel;
