import "./Nav.css"
import { useState } from "react";
import { GiHamburgerMenu } from 'react-icons/gi'
import { GrFormClose } from 'react-icons/gr'
import { Offcanvas } from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'

const Nav = () => {

    const [show, setShow] = useState(false);

    const location = useLocation()

    const handleClose = () => setShow(false)

    const showNavHandler = () => {
        setShow(!show)
    }

    return (
        <>
            <div className="position-relative m-1 z-5 d-xl-none d-flex" onClick={showNavHandler} >
                <div>
                    {!show ?
                        <GiHamburgerMenu size={35} color={'#4a4a4a'} />
                        : <GrFormClose size={35} color={'#4a4a4a'} />}
                </div>
            </div>
            <div className="d-flex flex-row justify-content-evenly position-absolute end-0 m-2 d-xl-none gap-3">
                <a className="" href={`https://www.instagram.com/byrinmobiliaria/`} target="_blank" rel="noopener noreferrer">
                    <img src='/images/instagram.webp' alt='B&R Inmobiliaria'></img>
                </a>
                <a className="" href={`https://www.facebook.com/ByRdesarrollosinmobiliarios`} target="_blank" rel="noopener noreferrer">
                    <img src='/images/facebook.webp' alt='B&R Inmobiliaria'></img>
                </a>
                <a className="" href={`https://api.whatsapp.com/send?phone=5492664570187&text=Hola, Necesito asesoramiento sobre una propiedad`} target="_blank" rel="noopener noreferrer">
                    <img src='/images/whatsapp.webp' alt='B&R Inmobiliaria'></img>
                </a>
                <a href="tel:+549 266 570187">
                    <img src='/images/phone.webp' alt="" />
                </a>
            </div>

            <Offcanvas show={show} onHide={handleClose} responsive="xl" style={{ width: "100%" }}>
                <Offcanvas.Header className='position-absolute' closeButton>
                </Offcanvas.Header>
                <div className="d-flex flex-column h-100" style={{ backgroundColor: "#eaeaea" }}>
                    <div className="w-100 h-25 d-flex justify-content-center align-items-center">
                        <NavLink to='/'>
                            <img className="" src='/images/logo.webp' alt='B&R Inmobiliaria' />
                        </NavLink>
                    </div>
                    <div className="line" />
                    <div className="d-flex flex-column gap-5 h-50 mt-5" onClick={showNavHandler}>
                        <NavLink to='/' className={location.pathname === '/' ? "buttonActive" : "button"}>Inicio</NavLink>
                        <NavLink to='/propiedades' className={location.pathname === '/propiedades' ? "buttonActive" : "button"}>Propiedades</NavLink>
                        <NavLink to='/contacto' className={location.pathname === '/contacto' ? "buttonActive" : "button"}>Contacto</NavLink>
                        <NavLink to='/empresa' className={location.pathname === '/empresa' ? "buttonActive" : "button"}>¿Quienes somos?</NavLink>
                    </div>
                    <div className="line" />
                    <div className="d-flex flex-row justify-content-evenly mt-5">
                        <a className="" href={`https://www.instagram.com/byrinmobiliaria/`} target="_blank" rel="noopener noreferrer">
                            <img src='/images/instagram.webp' alt='B&R Inmobiliaria'></img>
                        </a>
                        <a className="" href={`https://www.facebook.com/ByRdesarrollosinmobiliarios`} target="_blank" rel="noopener noreferrer">
                            <img src='/images/facebook.webp' alt='B&R Inmobiliaria'></img>
                        </a>
                        <a className="" href={`https://api.whatsapp.com/send?phone=5492664570187&text=Hola, Necesito asesoramiento sobre una propiedad`} target="_blank" rel="noopener noreferrer">
                            <img src='/images/whatsapp.webp' alt='B&R Inmobiliaria'></img>
                        </a>
                        <a href="tel:+549 266 570187">
                            <img src='/images/phone.webp' alt="" />
                        </a>
                    </div>
                </div>
            </Offcanvas>
        </>
    )
}

export default Nav