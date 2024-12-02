import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Modal from 'react-bootstrap/Modal';
import { modalState } from '../../app/store';
import { useRecoilState } from "recoil";
function CustomModal({ children, title, size, fullscreen }) {
    const [show, setShow] = useRecoilState(modalState);
    const handleClose = () => setShow(false);
    return (_jsx(_Fragment, { children: _jsxs(Modal, { show: show, onHide: handleClose, size: size, fullscreen: fullscreen, "aria-labelledby": "contained-modal-title-vcenter", centered: true, children: [_jsx(Modal.Header, { closeButton: true, children: _jsx(Modal.Title, { children: title }) }), _jsx(Modal.Body, { children: children })] }) }));
}
export default CustomModal;
