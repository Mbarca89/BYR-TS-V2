import "./Home.css"
import MainCarousel from "../../components/MainCarousel/MainCarousel"
import "../../Global.css"
import Search from "../../components/Search/Search"
import LastCarousel from "../../components/LastCarousel/LastCarousel"
import Contact from "../../components/Contact/Contat"

const Home = () => {


    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="d-sm-none">
                <div className="w-100 mt-1 mb-1 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#B84644", height: "75px" }}>
                    <h1 className='fs-1 ms-3 text-light text-center'>Bienvenido!</h1>
                </div>
                <div className="d-flex flex-column align-items-center overflow-hidden position-relative w-100 justify-content-center" style={{ height: "85vh" }}>
                    <img className="position-absolute w-100 h-100 object-fit-cover" src="/images/homebg.webp" alt="" style={{ opacity: ".3", zIndex: "0" }} />
                    <img className="mt-5 mb-5 z-1" src="/images/homelogo.webp" alt="" />
                    <p className="fst-italic z-1"><b>"Donde nacen tus sueños"</b></p>
                </div>
            </div>
            <div className="w-100 mt-1 mb-1 d-flex align-items-center" style={{ backgroundColor: "#B84644", height: "75px" }}>
                <h1 className='fs-1 ms-3 text-light'>Propiedades destadacas.</h1>
            </div>
            <div className="container w-100 mt-3 mb-3">
                <MainCarousel />
            </div>
            <div className="w-100 mt-1 mb-1 d-flex align-items-center" style={{ backgroundColor: "#B84644", height: "75px" }}>
                <h1 className='fs-1 ms-3 text-light'>Encontrá tu propiedad.</h1>
            </div>
            <div className="container w-100 mt-3 mb-3">
                <Search></Search>
            </div>
            <div className="w-100 mt-1 mb-1 d-flex align-items-center" style={{ backgroundColor: "#B84644", height: "75px" }}>
                <h1 className='fs-1 ms-3 text-light'>Últimas publicaciones</h1>
            </div>
            <div className="container w-100 mt-3 mb-3">
                <LastCarousel></LastCarousel>
            </div>
            <div className="w-100 mt-1 mb-1 d-flex align-items-center" style={{ backgroundColor: "#B84644", height: "75px" }}>
                <h1 className='fs-1 ms-3 text-light'>Comunicate con nosotros</h1>
            </div>
            <div className="container w-100 mt-3 mb-3">
                <Contact></Contact>
            </div>
        </div>
    )
}

export default Home