import { useFormik } from "formik";
import { useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap"
import ReactLoading from "react-loading";
import handleError from "../../utils/HandleErrors";
import { notifySuccess } from "../../components/Toaster/Toaster";
import emailjs from '@emailjs/browser'

interface Data {
    name: string,
    mail: string,
    phone: string,
    comments: string,
}

const ContactView = () => {

    const [sending, setSending] = useState<boolean>(false)

    const formRef = useRef<HTMLFormElement>(null);

    const validate = (values: Data): Data => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }

        if (!values.mail.trim()) {
            errors.mail = 'Ingrese su correo electrónico';
        } else if (!/\S+@\S+\.\S+/.test(values.mail)) {
            errors.mail = 'Ingrese un mail válido'
        }

        if (!values.phone.trim()) {
            errors.phone = 'Ingrese su número de teléfono';
        } else if (!/^\d+$/.test(values.phone)) {
            errors.phone = 'Ingrese solo números'
        }

        if (!values.comments.trim()) {
            errors.comments = 'Escriba algún comentario';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            mail: '',
            phone: '',
            comments: '',
        },
        validate,
        onSubmit: async values => {
            setSending(true)
            try {
                if (formRef.current) {
                    await emailjs.sendForm('service_2rg7tis', 'template_3omezxo', formRef.current, 'fup4O1b1tN2Rfnirg')
                    notifySuccess('Mensaje enviado correctamente.')
                    setSending(false)
                }
            } catch (error: any) {
                handleError(error)
                setSending(false)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="w-100 mt-1 mb-1 d-flex align-items-center" style={{ backgroundColor: "#B84644", height: "75px" }}>
                <h1 className='fs-1 ms-3 text-light'>Comunicate con nosotros</h1>
            </div>
            <div className="mt-5">
                <div className="">
                    <div className="text-center" style={{ color: "#4a4a4a" }}>
                        <h2>¿Querés comprar o vender una propiedad?</h2>
                        <p> Completá tus datos y comentanos en que podemos ayudarte. Un agente de B&R se pondrá en contacto con vos y te asesorará en tu consulta.</p>
                    </div>
                </div>
                <div className="">
                    <Form noValidate onSubmit={formik.handleSubmit} ref={formRef} className='w-100 mt-0 mb-3 p-2'>
                        <Form.Group as={Col} xs={12} lg={{ span: 6, offset: 3 }}>
                            <Form.Label >Nombre</Form.Label>
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
                        <Form.Group as={Col} xs={12} lg={{ span: 6, offset: 3 }}>
                            <Form.Label >Mail</Form.Label>
                            <Form.Control type="mail" placeholder="Mail"
                                id="mail"
                                name="mail"
                                value={formik.values.mail}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!(formik.touched.mail && formik.errors.mail)}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.mail}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} xs={12} lg={{ span: 6, offset: 3 }}>
                            <Form.Label >Teléfono</Form.Label>
                            <Form.Control type="text" placeholder="Teléfono"
                                id="phone"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} xs={12} lg={{ span: 6, offset: 3 }}>
                            <Form.Label >Comentarios</Form.Label>
                            <Form.Control type="text"
                                as='textarea'
                                id="comments"
                                name="comments"
                                value={formik.values.comments}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!(formik.touched.comments && formik.errors.comments)}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.comments}</Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-center mt-5">
                            {!sending && <button className="custom-contact-button rounded" type="submit">Enviar</button>}
                        </div>
                        {sending && <ReactLoading type='spinningBubbles' color='#4a4a4a' height={'4%'} width={'4%'} />}
                    </Form>
                </div>
            </div>
            <div className="w-100 mt-1 mb-1 d-flex align-items-center" style={{ backgroundColor: "#B84644", height: "75px" }}>
                <h1 className='fs-1 ms-3 text-light'>Otras formas de contacto</h1>
            </div>
            <div className="d-flex flex-column justify-content-evenly mt-5 mb-5 w-100 container text-center" style={{color: "#4a4a4a"}}>
                <div className="d-flex flex-column justify-content-center align-items-center gap-3">
                    <h2>Por teléfono: </h2>
                    <div className="d-flex gap-5">
                        <a className="d-flex flex-column justify-content-center align-items-center" href="tel:+549 266 570187">
                            <img src='/images/phone.webp' alt="" />
                            <p>Llamadas: +549 266 570187</p>
                        </a>
                        <a className="d-flex flex-column justify-content-center align-items-center" href={`https://api.whatsapp.com/send?phone=5492664570187&text=Hola, Necesito asesoramiento sobre una propiedad`} target="_blank" rel="noopener noreferrer">
                            <img src='/images/whatsapp.webp' alt='B&R Inmobiliaria'></img>
                            <p>Whatsapp: +549 266 570187</p>
                        </a>
                    </div>
                </div>
                <div className="d-flex flex-column mt-3 gap-3">
                    <h2>Correo electrónico: </h2>
                    <div>
                        <a className="d-flex flex-column justify-content-center align-items-center" href={`mailto:administracion@inmobiliariabyr.com.ar`} target="_blank" rel="noopener noreferrer">
                            <img src='/images/mail.webp' alt='B&R Inmobiliaria'></img>
                            <p>Mail: administracion@inmobiliariabyr.com.ar</p>
                        </a>
                    </div>
                </div>
                <div className="mt-3 d-flex flex-column gap-3">
                    <h2>Redes sociales: </h2>
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <a className="d-flex flex-column justify-content-center align-items-center" href={`https://www.instagram.com/byrinmobiliaria/`} target="_blank" rel="noopener noreferrer">
                            <img src='/images/instagram.webp' alt='B&R Inmobiliaria'></img>
                            <p>Instagram: @byrinmobiliaria</p>
                        </a>
                        <a className="d-flex flex-column justify-content-center align-items-center" href={`https://www.facebook.com/ByRdesarrollosinmobiliarios`} target="_blank" rel="noopener noreferrer">
                            <img src='/images/facebook.webp' alt='B&R Inmobiliaria'></img>
                            <p>Facebook: ByRdesarrollosinmobiliarios</p>
                        </a>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ContactView