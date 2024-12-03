import { notifySuccess } from "../Toaster/Toaster";
import { modalState } from "../../app/store";
import { useRecoilState } from "recoil"
import Button from 'react-bootstrap/Button';
import handleError from "../../utils/HandleErrors";
import { Spinner } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL

interface DeletePropertyProps {
    propertyId: string
    propertyName: string
    updateList: () => void;
}

const DeleteProperty: React.FC<DeletePropertyProps> = ({ propertyId, propertyName, updateList }) => {
    const [loading, setloading] = useState<boolean>(false)
    const [, setShow] = useRecoilState(modalState)

    const handleDelete = async () => {
        setloading(true)
        try {
            const res = await axios.delete(`${SERVER_URL}/api/properties/deleteProperty?propertyId=${propertyId}&propertyName=${propertyName}`)
            if (res.data) {
                notifySuccess(res.data)
                updateList()
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setShow(false)
            setloading(false)
        }
    }

    const handleCancel = () => {
        setShow(false)
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <span>¿Esta seguro que quiere eliminar la propiedad {propertyName}?</span>
            <div className="mt-3 d-flex align-items-center justify-content-center gap-4 w-100">
                {!loading ?
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Button className="" variant="danger" onClick={handleDelete}>Si</Button>
                    </div>
                    :
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Spinner />
                    </div>
                }
                <div className="w-25 d-flex align-items-center justify-content-center">
                    <Button className="" variant="primary" onClick={handleCancel}>No</Button>
                </div>
            </div>
        </div>
    )
}

export default DeleteProperty