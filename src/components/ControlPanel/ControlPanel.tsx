import style from './ControlPanel.module.css'
import { useNavigate } from 'react-router-dom'
const logo = require('../../img/logo.webp')

const ControlPanel = () => {

    const navigate = useNavigate()

    return(
        <div className={style.controlPanel}>
            <h1>Panel de Administrador</h1>
            <hr />
            <div>
                <button onClick={() => {navigate('/upload')}}>Cargar propiedad</button>
                <button onClick={() => {navigate('/list')}}>Ver propiedades</button>
                <button onClick={() => {navigate('')}}>Cargar inversión</button>
                <button onClick={() => {navigate('')}}>Ver inversiones</button>
            </div>
            <hr />
            <img src={logo} alt="" />
        </div>
    )
}

export default ControlPanel