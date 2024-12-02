import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Contact.css";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import { Col, Form } from "react-bootstrap";
import ReactLoading from "react-loading";
import handleError from "../../utils/HandleErrors";
import { notifySuccess } from "../Toaster/Toaster";
import emailjs from '@emailjs/browser';
const Contact = () => {
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
    return (_jsxs("div", { children: [_jsx("div", { className: "", children: _jsxs("div", { className: "text-center", style: { color: "#4a4a4a" }, children: [_jsx("h2", { children: "\u00BFEstas buscando tu proximo hogar?" }), _jsx("h2", { children: "\u00BFQuer\u00E9s comprar o vender una propiedad?" }), _jsx("p", { children: " Complet\u00E1 tus datos y comentanos en que podemos ayudarte. Un agente de B&R se pondr\u00E1 en contacto con vos y te asesorar\u00E1 en tu consulta." })] }) }), _jsx("div", { className: "", children: _jsxs(Form, { noValidate: true, onSubmit: formik.handleSubmit, ref: formRef, className: 'w-100 mt-0 mb-3 border rounded p-2', children: [_jsxs(Form.Group, { as: Col, xs: 12, lg: { span: 6, offset: 3 }, children: [_jsx(Form.Label, { children: "Nombre" }), _jsx(Form.Control, { type: "text", placeholder: "Nombre", id: "name", name: "name", value: formik.values.name, onChange: formik.handleChange, onBlur: formik.handleBlur, isInvalid: !!(formik.touched.name && formik.errors.name) }), _jsx(Form.Control.Feedback, { type: "invalid", children: formik.errors.name })] }), _jsxs(Form.Group, { as: Col, xs: 12, lg: { span: 6, offset: 3 }, children: [_jsx(Form.Label, { children: "Mail" }), _jsx(Form.Control, { type: "mail", placeholder: "Mail", id: "mail", name: "mail", value: formik.values.mail, onChange: formik.handleChange, onBlur: formik.handleBlur, isInvalid: !!(formik.touched.mail && formik.errors.mail) }), _jsx(Form.Control.Feedback, { type: "invalid", children: formik.errors.mail })] }), _jsxs(Form.Group, { as: Col, xs: 12, lg: { span: 6, offset: 3 }, children: [_jsx(Form.Label, { children: "Tel\u00E9fono" }), _jsx(Form.Control, { type: "text", placeholder: "Tel\u00E9fono", id: "phone", name: "phone", value: formik.values.phone, onChange: formik.handleChange, onBlur: formik.handleBlur, isInvalid: !!(formik.touched.phone && formik.errors.phone) }), _jsx(Form.Control.Feedback, { type: "invalid", children: formik.errors.phone })] }), _jsxs(Form.Group, { as: Col, xs: 12, lg: { span: 6, offset: 3 }, children: [_jsx(Form.Label, { children: "Comentarios" }), _jsx(Form.Control, { type: "text", as: 'textarea', id: "comments", name: "comments", value: formik.values.comments, onChange: formik.handleChange, onBlur: formik.handleBlur, isInvalid: !!(formik.touched.comments && formik.errors.comments) }), _jsx(Form.Control.Feedback, { type: "invalid", children: formik.errors.comments })] }), _jsx("div", { className: "d-flex justify-content-center mt-5", children: !sending && _jsx("button", { className: "custom-contact-button rounded", type: "submit", children: "Enviar" }) }), sending && _jsx(ReactLoading, { type: 'spinningBubbles', color: '#4a4a4a', height: '4%', width: '4%' })] }) })] }));
};
export default Contact;
