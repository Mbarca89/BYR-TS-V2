import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { notifySuccess } from "../Toaster/Toaster";
import { modalState } from "../../app/store";
import { useRecoilState } from "recoil";
import Button from 'react-bootstrap/Button';
import handleError from "../../utils/HandleErrors";
import { Spinner } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
const DeleteProperty = ({ propertyId, propertyName, updateList }) => {
    const [loading, setloading] = useState(false);
    const [, setShow] = useRecoilState(modalState);
    const handleDelete = async () => {
        setloading(true);
        try {
            const res = await axios.delete(`${SERVER_URL}/api/properties/deleteProperty?propertyId=${propertyId}&propertyName=${propertyName}`);
            if (res.data) {
                notifySuccess(res.data);
                updateList();
            }
        }
        catch (error) {
            handleError(error);
        }
        finally {
            setShow(false);
            setloading(false);
        }
    };
    const handleCancel = () => {
        setShow(false);
    };
    return (_jsxs("div", { className: "d-flex flex-column align-items-center", children: [_jsxs("span", { children: ["\u00BFEsta seguro que quiere eliminar la propiedad ", propertyName, "?"] }), _jsxs("div", { className: "mt-3 d-flex align-items-center justify-content-center gap-4 w-100", children: [!loading ?
                        _jsx("div", { className: "w-25 d-flex align-items-center justify-content-center", children: _jsx(Button, { className: "", variant: "danger", onClick: handleDelete, children: "Si" }) })
                        :
                            _jsx("div", { className: "w-25 d-flex align-items-center justify-content-center", children: _jsx(Spinner, {}) }), _jsx("div", { className: "w-25 d-flex align-items-center justify-content-center", children: _jsx(Button, { className: "", variant: "primary", onClick: handleCancel, children: "No" }) })] })] }));
};
export default DeleteProperty;
