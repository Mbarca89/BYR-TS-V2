import "./Detail.css"
import axios from 'axios'
import { useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ImageGallery from "react-image-gallery";
import { CarouselItemType, PropertyDetailType } from '../../types'
import handleError from '../../utils/HandleErrors'
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import CustomModal from "../../components/CustomModal/CustomModal";
import { Col, Row } from "react-bootstrap";
import Footer from "../../components/Footer/Footer";

const webUrl = import.meta.env.VITE_REACT_APP_URL
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL

const Detail = () => {

    const { id } = useParams()
    const location = useLocation()

    const [propertyData, setPropertyData] = useState<PropertyDetailType>({
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
    })
    const [imageIndex, setImageIndex] = useState<number>(0)
    const [showGallery, setShowGallery] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [imageLoading, setImageLoading] = useState<boolean>(true)
    const [slides, setSlides] = useState<CarouselItemType[]>([])
    const [show, setShow] = useRecoilState(modalState)

    useEffect(() => {
        const getProperty = async () => {
            try {
                const { data } = await axios(`${SERVER_URL}/api/properties/getById?propertyId=${id}`)
                setPropertyData(data)
                await setSlides(data.images.map((item: any) => {
                    return { original: item.url, thumbnail: item.thumbnailUrl, originalHeight: "50%" }
                }))
            } catch (error) {
                handleError(error)
            }
        }
        if (id) getProperty()
    }, [])

    const openModal = () => {
        setShow(true)
    }

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center">
            <div className='d-flex flex-column flex-xl-row w-100 mt-5 gap-1' style={{ minHeight: "500px" }}>
                <div className='w-100 w-lg-50 rounded h-sm-50 h-lg-100'>
                    <ImageGallery
                        items={slides}
                        showThumbnails={false}
                        showFullscreenButton={false}
                        showPlayButton={false}
                        autoPlay={true}
                        additionalClass='detail'
                        onClick={openModal}
                    />
                </div>
                <div className='w-100 w-lg-50 border border-2 rounded text-center d-flex flex-column align-items-center justify-content-between'>
                    <h2>{propertyData.name}</h2>
                    <hr style={{ width: "90%", color: "#B84644" }} />
                    <h3 className="fs-4">{propertyData.category} - {propertyData.location}</h3>
                    <hr style={{ width: "90%", color: "#B84644" }} />
                    <div className="w-100 d-flex flex-row gap-1 p-2 justify-content-between text-light">
                        <div className="w-25 p-2 rounded border border-2" style={{ backgroundColor: "#B84644" }}>
                            <h3 className="fs-4">{propertyData.size}</h3>
                            <img src='/images/size.webp' alt="" />
                            <div className=""></div>
                        </div>
                        <div className="w-25 p-2 rounded border border-2" style={{ backgroundColor: "#B84644" }}>
                            <h3 className="fs-4">{propertyData.bedrooms}</h3>
                            <img src='/images/bedroom.webp' alt="" />
                        </div>
                        <div className="w-25 p-2 rounded border border-2" style={{ backgroundColor: "#B84644" }}>
                            <h3 className="fs-4">{propertyData.bathrooms}</h3>
                            <img src='/images/bathroom.webp' alt="" />
                        </div>
                        <div className="w-25 p-2 rounded border border-2" style={{ backgroundColor: "#B84644" }}>
                            <h3 className="fs-4">{propertyData.kitchen}</h3>
                            <img src='/images/kitchen.webp' alt="" />
                        </div>
                        <div className="w-25 p-2 rounded border border-2" style={{ backgroundColor: "#B84644" }}>
                            <h3 className="fs-4">{propertyData.garage}</h3>
                            <img src='/images/garage.webp' alt="" />
                        </div>
                    </div>
                    <hr style={{ width: "90%", color: "#B84644" }} />
                    <div className="d-flex w-100 justify-content-between py-1 px-2">
                        <h3 className="">{propertyData.currency} <b>{propertyData.price}</b></h3>
                        <a href={`https://api.whatsapp.com/send?phone=5492664570187&text=Hola,%20me%20interesa%20saber%20mas%20sobre%20esta%20propiedad:%20${webUrl}${location.pathname}`} target="_blank" rel="noopener noreferrer">
                            <img className="" src='/images/whatsapp.webp' alt="" />
                        </a>
                    </div>
                </div>
            </div>
            <hr className="w-100 mt-5" style={{ width: "90%", color: "#B84644" }} />
            <div className="">
                <div dangerouslySetInnerHTML={{ __html: propertyData.description }}></div>
            </div>
            <hr className="w-100" style={{ width: "90%", color: "#B84644" }} />
            <div className="w-100">
                <Row className="w-100 mb-5">
                    <Col className="d-flex flex-column gap-1 mt-2" lg={4} xs={12}>
                        <p className="mb-0 mt-3"><b>Otros ambientes:</b></p>
                        {propertyData.others.map(item => {
                            return (<div key={item} className="d-flex flex-row align-items-center justify-content-start">
                                <img src='/images/checksmall.webp' alt="" />
                                <p className="my-0 ms-2">{item}</p>
                            </div>)
                        })}
                    </Col>
                    <Col className="d-flex flex-column gap-1 mt-2" lg={4} xs={12}>
                        <p className="mb-0 mt-3"><b>Comodidades:</b></p>
                        {propertyData.amenities.map(item => {
                            return (<div key={item} className="d-flex flex-row align-items-center justify-content-start">
                                <img src='/images/checksmall.webp' alt="" />
                                <p className="my-0 ms-2">{item}</p>
                            </div>)
                        })}
                    </Col>
                    <Col className="d-flex flex-column gap-1 mt-2" lg={4} xs={12}>
                        <p className="mb-0 mt-3"><b>Servicios:</b></p>
                        {propertyData.services.map(item => {
                            return (<div key={item} className="d-flex flex-row align-items-center justify-content-start">
                                <img src='/images/checksmall.webp' alt="" />
                                <p className="my-0 ms-2">{item}</p>
                            </div>)
                        })}
                    </Col>
                </Row>
            </div>
            {show && <CustomModal size="xl" backdrop="" fullscreen={true}>
                <ImageGallery
                    items={slides}
                    showThumbnails={false}
                    showFullscreenButton={false}
                    showPlayButton={true}
                    autoPlay={false}
                    additionalClass='fullscreen'
                    onClick={openModal}
                />
            </CustomModal>}
        </div>
    )
}

export default Detail