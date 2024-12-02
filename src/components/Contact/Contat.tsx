import "./Contact.css"
import { useFormik } from "formik";
import { useRef, useState } from "react";
import { Col, Form } from "react-bootstrap"
import ReactLoading from "react-loading";
import handleError from "../../utils/HandleErrors";
import { notifySuccess } from "../Toaster/Toaster";
import emailjs from '@emailjs/browser'

interface Data {
    name: string,
    mail: string,
    phone: string,
    comments: string,
}

const Contact = () => {

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
        <div>
            <div className="">
                <div className="text-center" style={{ color: "#4a4a4a" }}>
                    <h2>¿Estas buscando tu proximo hogar?</h2>
                    <h2>¿Querés comprar o vender una propiedad?</h2>
                    <p> Completá tus datos y comentanos en que podemos ayudarte. Un agente de B&R se pondrá en contacto con vos y te asesorará en tu consulta.</p>
                </div>
            </div>
            <div className="">
                <Form noValidate onSubmit={formik.handleSubmit} ref={formRef} className='w-100 mt-0 mb-3 border rounded p-2'>
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
    )
}

export default Contact
