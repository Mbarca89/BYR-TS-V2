import "./MainCarousel.css"
import { useState, useRef, useEffect } from 'react'
import axios from '../../utils/api'
import ImageGallery from "react-image-gallery";
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { CarouselItemType } from '../../types'
import handleError from '../../utils/HandleErrors'
const SERVER_URL = import.meta.env.VITE_SERVER_URL;


const MainCarousel = () => {
    const navigate = useNavigate()
    const galleryRef = useRef<ImageGallery | null>(null);

    const [isLoaded, setIsloaded] = useState<boolean>(false)
    const [slides, setSlides] = useState<CarouselItemType[]>([])

    useEffect(() => {
        const getFeatured = async () => {
            try {
                const res = await axios(`${SERVER_URL}/api/properties/featured`)
                if (res.data)
                    await setSlides(res.data.map((item: any) => {
                        return { original: (item.images?.[0]?.url || "/images/noImage.webp"), id: item.id, name: item.name, location: item.location, description: `${item.name} | ${item.location}` }
                    }))
                setIsloaded(true)
            } catch (error: any) {
                setIsloaded(true)
                handleError(error)
            }
        }
        getFeatured()
    }, [])

    const handleClick = () => {
        if (!galleryRef.current || !slides.length) return
        navigate(`/detalle/${slides[galleryRef.current.getCurrentIndex()].id}`)
    }

    return (
        isLoaded ?
            <div className="w-100">
                <ImageGallery
                    ref={galleryRef}
                    items={slides}
                    showThumbnails={false}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    autoPlay={true}
                    onClick={handleClick}
                    additionalClass="home-gallery"
                />
            </div> :
            <div className="d-flex justify-content-center"><LoadingSpinner /></div>
    )
}

export default MainCarousel
