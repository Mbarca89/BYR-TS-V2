const About = () => {
    return (
        <div className="d-flex flex-column align-items-center">
            <div className="w-100 mt-1 mb-1 d-flex align-items-center" style={{ backgroundColor: "#B84644", height: "75px" }}>
                <h1 className='fs-1 ms-3 text-light'>Nuestra empresa</h1>
            </div>
            <div className="container d-flex gap-3 text-center mt-3 flex-column flex-lg-row ">
                <img className="w-sm-100 w-lg-25 rounded" src='/images/renzoybruno.webp' alt="" />
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <h2>Quienes Somos</h2>
                    <p>Somos una empresa familiar comprometida con ofrecer servicios inmobiliarios de calidad. En ByR Desarrollos Inmobiliarios, entendemos que cada cliente tiene necesidades únicas, y por eso trabajamos con dedicación para comprenderlas a fondo. Nos destacamos por nuestra cercanía, ética y atención personalizada, valores que nos han permitido construir relaciones basadas en la confianza y el respeto mutuo. Nuestro objetivo es ser el socio ideal para nuestros clientes en cada etapa de su experiencia inmobiliaria.</p>
                </div>
            </div>
            <hr className="" style={{ width: "90%", color: "#B84644" }} />
            <div className="container d-flex flex-column align-items-center">
                <div>
                    <h3>Misión</h3>
                    <p>Brindar servicios inmobiliarios de excelencia que se adapten a las necesidades específicas de nuestros clientes, superando sus expectativas en cada interacción. Nos esforzamos por construir relaciones sólidas y duraderas, adaptándonos al dinamismo y las exigencias del mercado actual. Con una combinación de conocimiento, innovación y pasión, buscamos ofrecer soluciones que generen valor y satisfacción.</p>
                    <h3>Visión</h3>
                    <p>Convertirnos en una empresa líder y referente en el mercado de bienes raíces, reconocida por nuestro compromiso, profesionalismo y excelencia en cada servicio que ofrecemos. Aspiramos a ser la primera opción para nuestros clientes, marcando la diferencia con un enfoque humano, transparente y ético.</p>
                    <h3>Valores</h3>
                    <p>Pasión: En todo lo que hacemos, desde el trato con nuestros clientes hasta cada detalle del servicio.
                        Compromiso: Trabajamos con dedicación y responsabilidad para cumplir nuestros objetivos y los de nuestros clientes.
                        Profesionalismo: Mantenemos altos estándares de calidad y rigor en todas nuestras operaciones.
                        Excelencia: Nos esforzamos por superar las expectativas en cada paso, ofreciendo siempre lo mejor.
                        Transparencia: Fomentamos relaciones basadas en la confianza y la comunicación abierta.
                        Innovación: Nos mantenemos a la vanguardia, incorporando nuevas herramientas y estrategias para atender un mercado en constante evolución.</p>
                </div>
                <img className="w-sm-100 w-lg-50 object-fit-scale rounded" src='/images/about.webp' alt="" />
            </div>
            <hr className="" style={{ width: "90%", color: "#B84644" }} />

            <div className="container d-flex flex-column flex-lg-row w-100 justify-content-around text-center mb-5 mt-5">
                <div className="">
                    <img className="rounded w-50" src='/images/bruno.webp' alt="" />
                    <div className="">
                        <h2>Bruno Proto</h2>
                        <h5>Agente Inmobiliario.</h5>
                        <h5>Martillero Público.</h5>
                        <h5>Matrícula N° 808.</h5>
                    </div>
                </div>
                <div className="">
                    <img className="rounded w-50" src='/images/renzo.webp' alt="" />
                    <div className="">
                        <h2>Renzo Proto</h2>
                        <h5>Administrativo Inmobiliario.</h5>
                        <h5>Lic. En Administración de Empresas.</h5>
                    </div>
                </div>
            </div>
            <div className=""></div>
            <div className=""></div>

        </div>
    )
}

export default About