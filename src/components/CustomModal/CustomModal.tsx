import Modal from 'react-bootstrap/Modal';
import { modalState } from '../../app/store';
import { useRecoilState } from "recoil"



function CustomModal({ children, title, size, fullscreen }: any) {

  const [show, setShow] = useRecoilState(modalState)
  
  const handleClose = () => setShow(false);
  
  return (
    <>
      <Modal show={show} onHide={handleClose} size={size} fullscreen={fullscreen}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {children}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CustomModal;