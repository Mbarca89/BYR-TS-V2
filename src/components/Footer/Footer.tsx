import { CiLocationOn } from 'react-icons/ci'

const Footer = () => {

    return (
        <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center py-3" style={{ backgroundColor: "rgb(0, 0, 0, .3)" }}>
                <div className="">
                    <img src='/images/logo.webp' alt="B&R" />
                </div>
                <div className='ps-lg-5 pe-lg-5 mx-lg-5 mt-5 mt-lg-0'  style={{color: "#4e4e4e"}}>
                    <div className="text-center">
                        <p>© B&R Desarrollos Inmobiliarios. Todos los derechos reservados.</p>
                        <p>Aviso: Toda la información y medidas provistas son aproximadas y deberán ratificarse con la documentación pertinente y no compromete contractualmente a nuestra empresa. Los precios y costos expresados refieren a la última información recabada y deberán confirmarse. Fotografías no vinculantes ni contractuales.</p>
                        <a href="https://goo.gl/maps/mcJEQ939gzahioMy8" target="_blank" rel="noopener noreferrer"> {<CiLocationOn />}Las Heras 468, San Luis, Argentina</a>
                    </div>
                    <div className="d-flex flex-column align-items-center mt-4">
                        <img src="/images/cmcpsl.webp" alt="" />
                        <p>Bruno Proto - Matricula Nº: 808</p>
                    </div>
                </div>
        </div>
    )
}

export default Footer

