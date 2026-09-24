import axios from '../../utils/api'
import { useState, useEffect } from 'react'
import others from '../../utils/others'
import services from '../../utils/services'
import amenities from '../../utils/amenities'
import { ChangeEvent } from 'react'
import { PropertyType } from '../../types'
import { notifySuccess } from '../Toaster/Toaster'
import RichTextEditor from '../RichTextEditor/RichTextEditor'
import { sanitizeRichText } from '../../utils/richText'
import { propertyTypes } from '../../utils/propertyTypes'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useFormik } from 'formik'
import handleError from '../../utils/HandleErrors'
const SERVER_URL = import.meta.env.VITE_SERVER_URL

interface ImagePreview {
    file: File;
    preview: string;
}

interface UploaderProps {
    updateList: () => void
}

const Uploader: React.FC<UploaderProps> = ({ updateList }) => {
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<File[]>([]);
    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>()

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
    const validate = (values: PropertyType) => {
        const errors: Partial<Record<keyof PropertyType, string>> = {};
        if (!values.name.trim()) errors.name = 'Ingrese el nombre de la propiedad';
        return errors;
    };

    const formik = useFormik<PropertyType>({
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
            others: [],
            services: [],
            amenities: [],
            imageOrder: [] as number[]
        },
        validate,
        enableReinitialize: true,
        onSubmit: async values => {
            if (uploading) return;
            setUploading(true);
            try {
                const payload = { ...values, name: values.name.trim(), description: sanitizeRichText(values.description),
                    imageOrder: images.map((_, i) => i) };
                for (const field of ['price', 'size', 'constructed', 'bedrooms', 'bathrooms', 'kitchen', 'garage'] as const)
                    payload[field] = Number(values[field] || 0);
                const formData = new FormData();
                images.forEach(image => formData.append('images', image));
                formData.append('propertyData', JSON.stringify(payload));
                await axios.post(`${SERVER_URL}/api/properties/publish`, formData, { timeout: 120000 });
                notifySuccess('Propiedad publicada correctamente');
                updateList();
            } catch (error) { handleError(error); }
            finally { setUploading(false); }
        },
    });

    return (
        <div className="d-flex flex-column justify-content-center align-items-center px-3">
            <header>
                <h2>Publicar propiedad</h2>
            </header>
            <Form noValidate onSubmit={formik.handleSubmit} className='w-100'>
                <fieldset disabled={uploading}>
                <h3>Información Básica</h3>
                <Col lg={6}>
                    <Row className='mb-3'>
                        <Form.Label>Propiedad destacada</Form.Label>
                        <Form.Group>

                            <Form.Check
                                type="switch"
                                id="featured"
                                value={formik.values.featured ? "true" : "false"}
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
                                isInvalid={!!(formik.touched.name && formik.errors.name)}
                            />
                             <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mb-5'>
                        <Form.Label>Descripción</Form.Label>
                        <div className="">
                            <RichTextEditor readOnly={uploading}
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
                    <Row>
                        <h3>Cargar imágenes</h3>
                        <hr />
                        <Row className='mb-5'>
                            <div className="">
                                <input type="file" name="uploader" accept="image/png, image/jpeg, image/png" multiple onChange={fileHandler} />
                            </div>
                        </Row>
                        <h3>Imágenes elegidas</h3>
                        <hr />
                        <Row className="mb-5">
                            {selectedImages ? selectedImages.map((image, index) => (
                                <Col lg={2} key={index}>
                                    <img className='w-100' src={image.preview} alt="Preview" />
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
                                <Button variant="primary" type='submit'>Publicar</Button>
                            </div>
                        }
                    </Row>
                </Col>
            </fieldset>
            </Form>
        </div>
    )
}

export default Uploader
