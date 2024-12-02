import axios from 'axios'
import { useState, useEffect } from 'react'
import others from '../../utils/others'
import services from '../../utils/services'
import amenities from '../../utils/amenities'
import { ChangeEvent } from 'react'
import { Images, PropertyType } from '../../types'
import { notifySuccess } from '../Toaster/Toaster'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import DOMPurify from 'dompurify';
import { propertyTypes } from '../../utils/propertyTypes'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useFormik } from 'formik'
import handleError from '../../utils/HandleErrors'
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL

interface ImagePreview {
    file: File;
    preview: string;
}

interface EditorProps {
    propertyId: string
    updateList: () => void
}

const Editor: React.FC<EditorProps> = ({ propertyId, updateList }) => {
    const [uploading, setUploading] = useState(false)
    const [, setIsloaded] = useState(false)
    const [data, setData] = useState<PropertyType>({
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
    })
    const [images, setImages] = useState<File[]>([]);
    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>()
    const [propertyImages, setPropertyImages] = useState<Images[]>([])
    const [othersCheck, setOthersCheck] = useState(new Array(others.length).fill(false))
    const [servicesCheck, setServicesCheck] = useState(new Array(services.length).fill(false))
    const [amenitiesCheck, setAmenitiesCheck] = useState(new Array(amenities.length).fill(false))

    const othersHandler = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        let buffer = othersCheck
        buffer[index] = !buffer[index]
        setOthersCheck(buffer)
        if (event.target.checked === true) {
            setData({
                ...data,
                others: [...data.others, event.target.value]
            })
        } else {
            setData({
                ...data,
                others: [...data.others.filter((item) => item !== event.target.value)]
            })
        }
    }

    const servicesHandler = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        let buffer = servicesCheck
        buffer[index] = !buffer[index]
        setServicesCheck(buffer)
        if (event.target.checked === true) {
            setData({
                ...data,
                services: [...data.services, event.target.value]
            })
        } else {
            setData({
                ...data,
                services: [...data.services.filter((item) => item !== event.target.value)]
            })
        }
    }

    const amenitiesHandler = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        let buffer = amenitiesCheck
        buffer[index] = !buffer[index]
        setAmenitiesCheck(buffer)
        if (event.target.checked === true) {
            setData({
                ...data,
                amenities: [...data.amenities, event.target.value]
            })
        } else {
            setData({
                ...data,
                amenities: [...data.amenities.filter((item) => item !== event.target.value)]
            })
        }
    }

    const fileHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const imagesUpload = event.target.files
        if (imagesUpload) {
            setImages([...images, ...imagesUpload])
            const files = Array.from(imagesUpload);
            const imagesPreview = files.map((file) => ({
                file,
                preview: URL.createObjectURL(file), // Generar una URL para la vista previa
            }));
            setSelectedImages((selectedImages || []).concat(imagesPreview));
        }
    }

    useEffect(() => {
        // Limpia las URLs de vista previa cuando el componente se desmonta
        return () => {
            selectedImages && selectedImages.forEach((image) => URL.revokeObjectURL(image.preview));
        };
    }, [selectedImages]);

    const deleteImageFromDb = async (index: number, id:string) => {
        try {
            const res = await axios.delete(`${SERVER_URL}/api/images/delete?id=${id}`)
            if(res.data) {
                notifySuccess(res.data)
            }
            const newImages = [...propertyImages]
            newImages.splice(index, 1)
            setPropertyImages(newImages)
            const newOrder = [...formik.values.imageOrder]
            newOrder.splice(index,1)
            formik.setFieldValue("imageOrder", newOrder)
        } catch (error) {
            handleError(error)
        }
    }

    const deleteImage = (index: number) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)
        const newImagesPreview: ImagePreview[] = selectedImages?.slice() || [];
        newImagesPreview.splice(index, 1);
        setSelectedImages(newImagesPreview);
    }

    const moveRight = (index: number) => {
        const aux = images
        if (aux) {
            if (index !== aux.length - 1) {
                const temp = aux[index]
                aux[index] = aux[index + 1];
                aux[index + 1] = temp;
                setImages(aux)
                const files = Array.from(aux);
                const imagesPreview = files.map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                }));
                setSelectedImages(imagesPreview);
            }
        }
    }

    const moveLeft = (index: number) => {
        const aux = images
        if (aux) {
            if (index !== 0) {
                const temp = aux[index]
                aux[index] = aux[index - 1];
                aux[index - 1] = temp;
                setImages(aux)
                const files = Array.from(aux);
                const imagesPreview = files.map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                }));
                setSelectedImages(imagesPreview);
            }
        }
    }

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
        onSubmit: async values => {
            setUploading(true)
            try {
                values.others = data.others
                values.services = data.services
                values.amenities = data.amenities
                const formData = new FormData()
                if (images) {
                    let limit = values.imageOrder.length
                    for (let i = 0; i < images.length; i++) {
                        values.imageOrder.push(i + limit)
                        formData.append('images', images[i])
                    }
                }
                formData.append('propertyData', JSON.stringify(values))
                setData({
                    ...data,
                    description: DOMPurify.sanitize(data.description)
                })
                const res = await axios.put(`${SERVER_URL}/api/properties/edit/${propertyId}`, formData)
                if (res.data) {
                    notifySuccess(res.data)
                }
                setUploading(false)
                updateList()
            } catch (error: any) {
                handleError(error)
                setUploading(false)
            }
        },
    });

    useEffect(() => {
        const getProperty = async () => {
            try {
                const { data } = await axios(`${SERVER_URL}/api/properties/getById?propertyId=${propertyId}`)
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
                })
                setPropertyImages(data.images)

                let othersCheckBuffer = othersCheck
                others.map((item, index) => {
                    if (data.others.toString().includes(item.name)) othersCheckBuffer[index] = true
                    return null
                })
                setOthersCheck(othersCheckBuffer)
                let servicesCheckBuffer = servicesCheck
                services.map((item, index) => {
                    if (data.services.toString().includes(item.name)) servicesCheckBuffer[index] = true
                    return null
                })
                setServicesCheck(servicesCheckBuffer)

                let amenitiesCheckBuffer = amenitiesCheck
                amenities.map((item, index) => {
                    if (data.amenities.toString().includes(item.name)) amenitiesCheckBuffer[index] = true
                    return null
                })
                setAmenitiesCheck(amenitiesCheckBuffer)
                setIsloaded(true)
            } catch (error: any) {
                handleError(error)
            }
        }
        if (propertyId) getProperty()
    }, [])

    const moveRightOrder = (index: number) => {
        const aux = formik.values.imageOrder
        if (aux) {
            if (index !== aux.length - 1) {
                const temp = aux[index]
                aux[index] = aux[index + 1];
                aux[index + 1] = temp;
                formik.setFieldValue('imageOrder', aux)
            }
        }
    }

    const moveLeftOrder = (index: number) => {
        const aux = formik.values.imageOrder
        if (aux) {
            if (index !== 0) {
                const temp = aux[index]
                aux[index] = aux[index - 1];
                aux[index - 1] = temp;
                formik.setFieldValue('imageOrder', aux)
            }
        }
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center px-3">
            <header>
                <h2>Editar propiedad</h2>
            </header>
            <Form noValidate onSubmit={formik.handleSubmit} className='w-100'>
                <h3>Información Básica</h3>
                <Col lg={6}>
                    <Row className='mb-3'>
                        <Form.Label>Propiedad destacada</Form.Label>
                        <Form.Group>
                            <Form.Check
                                type="switch"
                                id="featured"
                                value={formik.values.featured ? "true" : "false"}
                                checked={formik.values.featured}
                                onChange={e => {
                                    formik.setFieldValue("featured", e.target.checked === true)
                                }}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Nombre"
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <Row className='mb-5'>
                        <Form.Label>Descripción</Form.Label>
                        <div className="">
                            <ReactQuill style={{ height: '300px' }}
                                theme='snow'
                                className=""
                                id='description'
                                value={formik.values.description}
                                onChange={value => formik.setFieldValue('description', value)}
                            />
                        </div>
                    </Row>
                    <Row>
                        <h3 className='mt-3'>Información adicional</h3>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label className="">Tipo</Form.Label>
                            <Form.Select
                                id="type"
                                name="type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                {propertyTypes.map(type => (
                                    <option value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label className="">Categoría</Form.Label>
                            <Form.Select
                                id="category"
                                name="category"
                                value={formik.values.category}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="Alquiler">Alquiler</option>
                                <option value="Alquiler temporario">Alquiler temporario</option>
                                <option value="Permuta">Permuta</option>
                                <option value="Venta">Venta</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label>Precio</Form.Label>
                            <Form.Control type="number"
                                id="price"
                                name="price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label className="">Moneda</Form.Label>
                            <Form.Select
                                id="currency"
                                name="currency"
                                value={formik.values.currency}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="$">Pesos</option>
                                <option value="US$">Dolares</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label className="">Ubicación</Form.Label>
                            <Form.Select
                                id="location"
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="San Luis">San Luis</option>
                                <option value="Juana Koslay">Juana Koslay</option>
                                <option value="Potrero De Los Funes">Potrero</option>
                                <option value="El Volcan">El Volcan</option>
                                <option value="Estancia Grande">Estancia Grande</option>
                                <option value="El Trapiche">El Trapiche</option>
                                <option value="La Florida">La Florida</option>
                                <option value="La Punta">La Punta</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label>Superficie</Form.Label>
                            <Form.Control type="number"
                                id="size"
                                name="size"
                                value={formik.values.size}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label>Superficie cubierta</Form.Label>
                            <Form.Control type="number"
                                id="constructed"
                                name="constructed"
                                value={formik.values.constructed}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label>Habitaciones</Form.Label>
                            <Form.Control type="number"
                                id="bedrooms"
                                name="bedrooms"
                                value={formik.values.bedrooms}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label>Baños</Form.Label>
                            <Form.Control type="number"
                                id="bathrooms"
                                name="bathrooms"
                                value={formik.values.bathrooms}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label>Cocina</Form.Label>
                            <Form.Control type="number"
                                id="kitchen"
                                name="kitchen"
                                value={formik.values.kitchen}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label>Garaje</Form.Label>
                            <Form.Control type="number"
                                id="garage"
                                name="garage"
                                value={formik.values.garage}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <h3>Otros Ambientes</h3>
                    <hr />
                    <Row className='mb-3'>
                        {others.map((item, index) => (
                            <Col key={index} md={4} className="mb-3">
                                <input
                                    type="checkbox"
                                    name={item.name}
                                    value={item.name}
                                    onChange={(event) => othersHandler(event, index)}
                                    checked={othersCheck[index]}
                                />
                                <label className='ms-1' htmlFor={item.name}>{item.name}</label>
                            </Col>
                        ))}
                    </Row>
                    <h3>Servicios</h3>
                    <hr />
                    <Row className='mb-3'>
                        {services.map((item, index) => (
                            <Col key={index} md={4} className="mb-3">
                                <input
                                    type="checkbox"
                                    name={item.name}
                                    value={item.name}
                                    onChange={(event) => servicesHandler(event, index)}
                                    checked={servicesCheck[index]}
                                />
                                <label className='ms-1' htmlFor={item.name}>{item.name}</label>
                            </Col>
                        ))}
                    </Row>
                    <h3>Comodidades</h3>
                    <hr />
                    <Row className='mb-3'>
                        {amenities.map((item, index) => (
                            <Col key={index} md={4} className="mb-3">
                                <input
                                    type="checkbox"
                                    name={item.name}
                                    value={item.name}
                                    onChange={(event) => amenitiesHandler(event, index)}
                                    checked={amenitiesCheck[index]}
                                />
                                <label className='ms-1' htmlFor={item.name}>{item.name}</label>
                            </Col>
                        ))}
                    </Row>
                    </Col>
                    <Col lg={12}>
                    <Row>
                        <h3>Imágenes subidas</h3>
                        <div className="d-flex flex-row gap-2 mb-0">
                            <Row >
                                {formik.values.imageOrder.map((image, index) => (
                                    <Col lg={3} md={4} key={index} style={{ height: "250px" }} className='d-flex flex-column justify-content-evenly align-items-center'>
                                        <img src={propertyImages[image]?.thumbnailUrl} alt="Preview" className='w-50 h-50' />
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <Button onClick={() => moveLeftOrder(index)}>{'<'}</Button>
                                            <Button className="" onClick={() => deleteImageFromDb(index, propertyImages[image].id)}>X</Button>
                                            <Button onClick={() => moveRightOrder(index)}>{'>'}</Button>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                        <hr />
                        <h3>Agregar imágenes</h3>
                        <Row className='mb-5'>
                            <div className="">
                                <input type="file" name="uploader" accept="image/png, image/jpeg" multiple onChange={fileHandler} />
                            </div>
                        </Row>
                        <h3>Imágenes elegidas</h3>
                        <hr />
                        <Row className="mb-5">
                            {selectedImages ? selectedImages.map((image, index) => (
                                <Col lg={3} key={index} style={{ height: "250px" }} className='d-flex flex-column justify-content-evenly align-items-center'>
                                    <img src={image.preview} alt="Preview" className='w-50 h-50'/>
                                    <div className="d-flex flex-row justify-content-evenly">
                                        <Button onClick={() => moveLeft(index)}>{'<'}</Button>
                                        <Button className="" onClick={() => deleteImage(index)}>X</Button>
                                        <Button onClick={() => moveRight(index)}>{'>'}</Button>
                                    </div>
                                </Col>
                            ))
                                : <div className='d-flex flex-row justify-content-center'>
                                    <h6>No se han cargado imágenes</h6>
                                </div>
                            }
                        </Row>
                    </Row>
                    <Row>
                        {uploading ?
                            <div className='d-flex flex-row justify-content-around mt-5 mb-5'>
                                <Spinner></Spinner>
                            </div>
                            :
                            <div className='d-flex flex-row justify-content-around mt-5 mb-5'>
                                <Button variant='danger' onClick={updateList}>Cancelar</Button>
                                <Button variant="primary" type='submit'>Guardar</Button>
                            </div>
                        }
                    </Row>
                </Col>
            </Form>
        </div>
    )
}

export default Editor