import "./Admin.css"
import { useState, useEffect } from 'react'
import Uploader from "../../components/Uploader/Uploader"
import List from "../../components/List/List"
import { ChangeEvent } from 'react'
import { notifyError } from '../../components/Toaster/Toaster'
import { Container, Nav, Navbar } from 'react-bootstrap'
import Editor from "../../components/Editor/Editor"
const ADMIN_USER = import.meta.env.VITE_REACT_APP_ADMIN_USER
const ADMIN_PASSWORD = import.meta.env.VITE_REACT_APP_ADMIN_PASSWORD

const AdminV2 = () => {

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user==="ByRadmin") setLogged(true)
    }, [])

    const [logged, setLogged] = useState<boolean>(false)
    const [remember, setRemember] = useState<boolean>(false)
    const [selectedProperty, setSelectedProperty] = useState<string>("")
    const [loginData, setLoginData] = useState({
        user: '',
        password: ''
    })
    const [loginError, setLoginError] = useState('')

    const setTab = () => {
        setCurrentTab("home")
    }

    const [currentTab, setCurrentTab] = useState("home")

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab)
    }

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value
        })
        setLoginError('')
    }

    const loginHandler = () => {
        if (loginData.user === ADMIN_USER && loginData.password === ADMIN_PASSWORD) {
            setLogged(true)
            if (remember) localStorage.setItem('user', 'ByRadmin')
        } else {
            notifyError('Usuario o contraseña incorrecta')
        }
    }

    const logoutHandler = () => {
        setLogged(false)
        setLoginData({
            user: '',
            password: ''
        })
        localStorage.removeItem('user')
    }

    const rememberHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) setRemember(true)
        else setRemember(false)
    }

    const enableEdit = (propertyId: string) => {
        setSelectedProperty(propertyId)
        setCurrentTab("edit")
    }

    return (!logged ?
        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
            <h1>Admin Login</h1>
            <div className="loginCard">
                <h4 className="title">Iniciar sesión</h4>
                <form onSubmit={loginHandler}>
                    <div className="field">
                        <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                        <input autoComplete="off" id="logemail" placeholder="Usuario" className="input-field" name="user" type="text" value={loginData.user} onChange={changeHandler} />
                    </div>
                    <div className="field">
                        <svg className="input-icon" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                            <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"></path></svg>
                        <input autoComplete="off" id="logpass" placeholder="Contraseña" className="input-field" name="password" type="password" value={loginData.password} onChange={changeHandler} />
                    </div>
                    <div className="field d-flex justify-content-start">
                        <input autoComplete="off" id="remember" name="remember" type="checkbox" onChange={rememberHandler} />
                        <span className='' style={{ color: "gray" }}>Recordarme</span>
                    </div>
                    <button className="loginbtn" type="submit">Login</button>
                </form>
            </div>
        </div>
        :
        <div className='w-100 h-100 overflow-auto'>
            <Container fluid className="p-1">
                <Nav variant="tabs" defaultActiveKey="patients" activeKey={currentTab}>
                    <Navbar.Brand>
                        <img
                            src="/images/logo.webp"
                            width="auto"
                            height="30"
                            className="d-inline-block align-top"
                            alt="ByR Inmobiliaria"
                        />
                    </Navbar.Brand>
                    <Nav.Item>
                        <Nav.Link className="text-dark" eventKey="home" onClick={() => handleTabChange("home")}>Propiedades</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="text-dark" eventKey="createProperty" onClick={() => handleTabChange("createProperty")}>Cargar propiedad</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="text-dark" onClick={logoutHandler}>Salir</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
            <div className="mt-3 w-100 h-100">
                {currentTab === "home" ? <List enableEdit={enableEdit}/> : null}
                {currentTab === "edit" ? <Editor updateList={setTab} propertyId={selectedProperty}/> : null}
                {currentTab === "createProperty" ? <Uploader updateList={setTab} /> : null}
            </div>
        </div>
    )
}

export default AdminV2