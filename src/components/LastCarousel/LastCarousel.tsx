import "./LastCarousel.css"
import axios from "axios"
import { useEffect, useState } from "react"
import handleError from "../../utils/HandleErrors"
import { useNavigate } from "react-router-dom"
import { CarouselItemType } from "../../types"
import ReactLoading from "react-loading"
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const LastCarousel = () => {

    const navigate = useNavigate()
    const [slides, setSlides] = useState<CarouselItemType[]>([])
    const [isLoaded, setIsloaded] = useState<boolean>(false)

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
                const res = await axios(`${SERVER_URL}/api/properties/last`)
                if (res.data)
                    await setSlides(res.data.map((item: any) => {
                        return { thumbnail: item.images[item.imageOrder[0]].thumbnailUrl, id: item.id, name: item.name, location: item.location, description: `${item.name} | ${item.location}` }
                    }))
                setIsloaded(true)
            } catch (error: any) {
                handleError(error)
            }
        }
        getLastProperties()
    }, [])

    const CustomRightArrow = ({ onClick }: any) => {
        return <button className="last-right-arrow" onClick={() => onClick()}>〉</button>;
    };

    const CustomLeftArrow = ({ onClick }: any) => {
        return <button className="last-left-arrow" onClick={() => onClick()}>〈</button>;
    };

    return (
        isLoaded ?
            <div className="position-relative" style={{
                paddingBottom: '30px'
            }}>
                <Carousel
                    responsive={responsive}
                    infinite={true}
                    className=""
                    containerClass="container ps-4 ps-lg-5"
                    removeArrowOnDeviceType='mobile'
                    autoPlay={true}
                    autoPlaySpeed={4000}
                    showDots
                    renderDotsOutside
                    customRightArrow={<CustomRightArrow />}
                    customLeftArrow={<CustomLeftArrow />}
                >
                    {slides.map((property, index) => {
                        return (
                            <div className="w-100 h-100" style={{cursor:"pointer"}} key={index} onClick={() => navigate(`/detalle/${property.id}`)}>
                                <div className="d-flex flex-column align-items-center justify-content-center rounded p-1" style={{ width: "70%", height: "90%", backgroundColor: "rgba(0,0,0,.1)" }} key={index}>
                                    <div className="rounded h-50 w-100" style={{}}>
                                        <img
                                            src={property.thumbnail? property.thumbnail : "/images/noimage.webp"}
                                            alt=""
                                            className="h-100 w-100 rounded"
                                        />
                                    </div>
                                    <hr className="w-100 p-0 mb-0" style={{ color: "#B84644" }} />
                                    <div className="h-50 text-center d-flex flex-column align-items-center justify-content-center">
                                        <p className="m-0" style={{ color: "#4a4a4a" }}>{property.name}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </Carousel>
            </div> :
            <div className="d-flex justify-content-center"><ReactLoading type='spinningBubbles' color='#4a4a4a' height={'5%'} width={'5%'} /></div>
    )
}

export default LastCarousel