import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import { Col, Form } from "react-bootstrap";
import ReactLoading from "react-loading";
import handleError from "../../utils/HandleErrors";
import { notifySuccess } from "../../components/Toaster/Toaster";
import emailjs from '@emailjs/browser';
const ContactView = () => {
    const [sending, setSending] = useState(false);
    const formRef = useRef(null);
    const validate = (values) => {
        const errors = {};
        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        if (!values.mail.trim()) {
            errors.mail = 'Ingrese su correo electrónico';
        }
        else if (!/\S+@\S+\.\S+/.test(values.mail)) {
            errors.mail = 'Ingrese un mail válido';
        }
        if (!values.phone.trim()) {
            errors.phone = 'Ingrese su número de teléfono';
        }
        else if (!/^\d+$/.test(values.phone)) {
            errors.phone = 'Ingrese solo números';
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
        onSubmit: async () => {
            setSending(true);
            try {
                if (formRef.current) {
                    await emailjs.sendForm('service_2rg7tis', 'template_3omezxo', formRef.current, 'fup4O1b1tN2Rfnirg');
                    notifySuccess('Mensaje enviado correctamente.');
                    setSending(false);
                }
            }
            catch (error) {
                handleError(error);
                setSending(false);
            }
        },
    });
    return (_jsxs("div", { className: "d-flex flex-column justify-content-center align-items-center", children: [_jsx("div", { className: "w-100 mt-1 mb-1 d-flex align-items-center", style: { backgroundColor: "#B84644", height: "75px" }, children: _jsx("h1", { className: 'fs-1 ms-3 text-light', children: "Comunicate con nosotros" }) }), _jsxs("div", { className: "mt-5", children: [_jsx("div", { className: "", children: _jsxs("div", { className: "text-center", style: { color: "#4a4a4a" }, children: [_jsx("h2", { children: "\u00BFQuer\u00E9s comprar o vender una propiedad?" }), _jsx("p", { children: " Complet\u00E1 tus datos y comentanos en que podemos ayudarte. Un agente de B&R se pondr\u00E1 en contacto con vos y te asesorar\u00E1 en tu consulta." })] }) }), _jsx("div", { className: "", children: _jsxs(Form, { noValidate: true, onSubmit: formik.handleSubmit, ref: formRef, className: 'w-100 mt-0 mb-3 p-2', children: [_jsxs(Form.Group, { as: Col, xs: 12, lg: { span: 6, offset: 3 }, children: [_jsx(Form.Label, { children: "Nombre" }), _jsx(Form.Control, { type: "text", placeholder: "Nombre", id: "name", name: "name", value: formik.values.name, onChange: formik.handleChange, onBlur: formik.handleBlur, isInvalid: !!(formik.touched.name && formik.errors.name) }), _jsx(Form.Control.Feedback, { type: "invalid", children: formik.errors.name })] }), _jsxs(Form.Group, { as: Col, xs: 12, lg: { span: 6, offset: 3 }, children: [_jsx(Form.Label, { children: "Mail" }), _jsx(Form.Control, { type: "mail", placeholder: "Mail", id: "mail", name: "mail", value: formik.values.mail, onChange: formik.handleChange, onBlur: formik.handleBlur, isInvalid: !!(formik.touched.mail && formik.errors.mail) }), _jsx(Form.Control.Feedback, { type: "invalid", children: formik.errors.mail })] }), _jsxs(Form.Group, { as: Col, xs: 12, lg: { span: 6, offset: 3 }, children: [_jsx(Form.Label, { children: "Tel\u00E9fono" }), _jsx(Form.Control, { type: "text", placeholder: "Tel\u00E9fono", id: "phone", name: "phone", value: formik.values.phone, onChange: formik.handleChange, onBlur: formik.handleBlur, isInvalid: !!(formik.touched.phone && formik.errors.phone) }), _jsx(Form.Control.Feedback, { type: "invalid", children: formik.errors.phone })] }), _jsxs(Form.Group, { as: Col, xs: 12, lg: { span: 6, offset: 3 }, children: [_jsx(Form.Label, { children: "Comentarios" }), _jsx(Form.Control, { type: "text", as: 'textarea', id: "comments", name: "comments", value: formik.values.comments, onChange: formik.handleChange, onBlur: formik.handleBlur, isInvalid: !!(formik.touched.comments && formik.errors.comments) }), _jsx(Form.Control.Feedback, { type: "invalid", children: formik.errors.comments })] }), _jsx("div", { className: "d-flex justify-content-center mt-5", children: !sending && _jsx("button", { className: "custom-contact-button rounded", type: "submit", children: "Enviar" }) }), sending && _jsx(ReactLoading, { type: 'spinningBubbles', color: '#4a4a4a', height: '4%', width: '4%' })] }) })] }), _jsx("div", { className: "w-100 mt-1 mb-1 d-flex align-items-center", style: { backgroundColor: "#B84644", height: "75px" }, children: _jsx("h1", { className: 'fs-1 ms-3 text-light', children: "Otras formas de contacto" }) }), _jsxs("div", { className: "d-flex flex-column justify-content-evenly mt-5 mb-5 w-100 container text-center", style: { color: "#4a4a4a" }, children: [_jsxs("div", { className: "d-flex flex-column justify-content-center align-items-center gap-3", children: [_jsx("h2", { children: "Por tel\u00E9fono: " }), _jsxs("div", { className: "d-flex gap-5", children: [_jsxs("a", { className: "d-flex flex-column justify-content-center align-items-center", href: "tel:+549 266 570187", children: [_jsx("img", { src: '/images/phone.webp', alt: "" }), _jsx("p", { children: "Llamadas: +549 266 570187" })] }), _jsxs("a", { className: "d-flex flex-column justify-content-center align-items-center", href: `https://api.whatsapp.com/send?phone=5492664570187&text=Hola, Necesito asesoramiento sobre una propiedad`, target: "_blank", rel: "noopener noreferrer", children: [_jsx("img", { src: '/images/whatsapp.webp', alt: 'B&R Inmobiliaria' }), _jsx("p", { children: "Whatsapp: +549 266 570187" })] })] })] }), _jsxs("div", { className: "d-flex flex-column mt-3 gap-3", children: [_jsx("h2", { children: "Correo electr\u00F3nico: " }), _jsx("div", { children: _jsxs("a", { className: "d-flex flex-column justify-content-center align-items-center", href: `mailto:administracion@inmobiliariabyr.com.ar`, target: "_blank", rel: "noopener noreferrer", children: [_jsx("img", { src: '/images/mail.webp', alt: 'B&R Inmobiliaria' }), _jsx("p", { children: "Mail: administracion@inmobiliariabyr.com.ar" })] }) })] }), _jsxs("div", { className: "mt-3 d-flex flex-column gap-3", children: [_jsx("h2", { children: "Redes sociales: " }), _jsxs("div", { className: "d-flex justify-content-center align-items-center gap-3", children: [_jsxs("a", { className: "d-flex flex-column justify-content-center align-items-center", href: `https://www.instagram.com/byrinmobiliaria/`, target: "_blank", rel: "noopener noreferrer", children: [_jsx("img", { src: '/images/instagram.webp', alt: 'B&R Inmobiliaria' }), _jsx("p", { children: "Instagram: @byrinmobiliaria" })] }), _jsxs("a", { className: "d-flex flex-column justify-content-center align-items-center", href: `https://www.facebook.com/ByRdesarrollosinmobiliarios`, target: "_blank", rel: "noopener noreferrer", children: [_jsx("img", { src: '/images/facebook.webp', alt: 'B&R Inmobiliaria' }), _jsx("p", { children: "Facebook: ByRdesarrollosinmobiliarios" })] })] })] })] })] }));
};
export default ContactView;
