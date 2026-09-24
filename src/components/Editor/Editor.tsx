import axios from '../../utils/api'
import { useState, useEffect } from 'react'
import others from '../../utils/others'
import services from '../../utils/services'
import amenities from '../../utils/amenities'
import { ChangeEvent } from 'react'
import { Images, PropertyType } from '../../types'
import { notifySuccess } from '../Toaster/Toaster'
import RichTextEditor from '../RichTextEditor/RichTextEditor'
import { sanitizeRichText } from '../../utils/richText'
import { propertyTypes } from '../../utils/propertyTypes'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useFormik } from 'formik'
import handleError from '../../utils/HandleErrors'
import { normalizeImageOrder, removeImageFromOrder } from '../../utils/images'
const SERVER_URL = import.meta.env.VITE_SERVER_URL

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
    const [isLoaded, setIsloaded] = useState(false)
    const [loadError, setLoadError] = useState(false)
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

    const fileHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setImages(previous => [...previous, ...files]);
        event.target.value = '';
    };
    useEffect(() => {
        const previews = images.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setSelectedImages(previews);
        return () => previews.forEach(image => URL.revokeObjectURL(image.preview));
    }, [images]);
    const deleteImage = (index: number) => setImages(previous => previous.filter((_, i) => i !== index));
    const moveImage = (index: number, direction: number) => {
        setImages(previous => {
            const next = [...previous];
            const target = index + direction;
            if (target >= 0 && target < next.length) [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    };
    const moveRight = (index: number) => moveImage(index, 1);
    const moveLeft = (index: number) => moveImage(index, -1);
    const toggleOption = (field: 'others' | 'services' | 'amenities', value: string, checked: boolean) => {
        const current = formik.values[field];
        formik.setFieldValue(field, checked ? Array.from(new Set([...current, value])) : current.filter(item => item !== value));
    };
    const [deletingImage, setDeletingImage] = useState(false);
    const deleteImageFromDb = async (index: number, id: string) => {
        if (deletingImage) return;
        setDeletingImage(true);
        try {
            await axios.delete(`${SERVER_URL}/api/images/delete`, { params: { id } });
            const removed = propertyImages.findIndex(image => image.id === id);
            if (removed < 0) return;
            await formik.setFieldValue('imageOrder', removeImageFromOrder(formik.values.imageOrder, propertyImages.length, removed));
            setPropertyImages(previous => previous.filter(image => image.id !== id));
            notifySuccess('Imagen eliminada correctamente');
        } catch (error) { handleError(error); }
        finally { setDeletingImage(false); }
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
        onSubmit: async values => {
            if (uploading || deletingImage) return;
            setUploading(true);
            try {
                const payload = { ...values, name: values.name.trim(), description: sanitizeRichText(values.description),
                    imageOrder: [...normalizeImageOrder(values.imageOrder, propertyImages.length), ...images.map((_, i) => propertyImages.length + i)] };
                for (const field of ['price', 'size', 'constructed', 'bedrooms', 'bathrooms', 'kitchen', 'garage'] as const)
                    payload[field] = Number(values[field] || 0);
                const formData = new FormData();
                images.forEach(image => formData.append('images', image));
                formData.append('propertyData', JSON.stringify(payload));
                await axios.put(`${SERVER_URL}/api/properties/edit/${propertyId}`, formData, { timeout: 120000 });
                notifySuccess('Propiedad editada correctamente');
                updateList();
            } catch (error) { handleError(error); }
            finally { setUploading(false); }
        },
    });

    useEffect(() => {
        const controller = new AbortController();
        setIsloaded(false);
        setLoadError(false);
        const getProperty = async () => {
            try {
                const { data } = await axios(`${SERVER_URL}/api/properties/getById?propertyId=${propertyId}`, { signal: controller.signal })
                setData({
                    id: data.id,
                    featured: data.featured,
                    name: data.name,
                    description: sanitizeRichText(data.description || ""),
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
                    imageOrder: normalizeImageOrder(data.imageOrder, (data.images || []).length)
                })
                setPropertyImages(data.images)

                setIsloaded(true)
            } catch (error: any) {
                if (!controller.signal.aborted) {
                    setLoadError(true);
                    handleError(error);
                }
            }
        }
        if (propertyId) getProperty()
        return () => controller.abort();
    }, [propertyId])

    const moveRightOrder = (index: number) => {
        const aux = [...formik.values.imageOrder]
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
        const aux = [...formik.values.imageOrder]
        if (aux) {
            if (index !== 0) {
                const temp = aux[index]
                aux[index] = aux[index - 1];
                aux[index - 1] = temp;
                formik.setFieldValue('imageOrder', aux)
            }
        }
    }

    if (!isLoaded) return <div className="p-4"><p>{loadError ? 'No se pudo cargar la propiedad.' : 'Cargando propiedad…'}</p><Button onClick={updateList}>Volver</Button></div>;

    return (
        <div className="d-flex flex-column justify-content-center align-items-center px-3">
            <header>
                <h2>Editar propiedad</h2>
            </header>
            <Form noValidate onSubmit={formik.handleSubmit} className='w-100'>
                <fieldset disabled={uploading || deletingImage}>
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
                            <RichTextEditor readOnly={uploading || deletingImage}
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
                                    <option key={type} value={type}>{type}</option>
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
                                    onChange={event => toggleOption('others', event.target.value, event.target.checked)}
                                    checked={formik.values.others.includes(item.name)}
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
                                    onChange={event => toggleOption('services', event.target.value, event.target.checked)}
                                    checked={formik.values.services.includes(item.name)}
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
                                    onChange={event => toggleOption('amenities', event.target.value, event.target.checked)}
                                    checked={formik.values.amenities.includes(item.name)}
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
                                            <Button disabled={deletingImage || uploading} className="" onClick={() => deleteImageFromDb(index, propertyImages[image].id)}>X</Button>
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
                                <Button variant="primary" type='submit' disabled={deletingImage}>Guardar</Button>
                            </div>
                        }
                    </Row>
                </Col>
            </fieldset>
            </Form>
        </div>
    )
}

export default Editor
