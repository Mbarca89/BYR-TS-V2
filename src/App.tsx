import "./Global.css"
import { Route, Routes, Outlet } from 'react-router-dom';
import Home from './views/Home/Home'
import Nav from './components/Nav/Nav'
import Detail from './views/Detail/Detail';
import Admin from './views/Admin/Admin';
import Properties from './views/Properties/Properties';
import ContactView from './views/ContactView/ContactView';
import Footer from './components/Footer/Footer';
import About from './views/About/About';
import { Toaster } from 'react-hot-toast';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import './App.css';
import { Col } from 'react-bootstrap';

function App() {

  return (
    <div className="d-flex flex-column flex-xl-row App overflow-hidden">
      <Toaster></Toaster>
      <TawkMessengerReact
        propertyId="64db6042cc26a871b02f5cbd"
        widgetId="1h7sf00ve" />
      <Routes>
        <Route element={(
          <>
            <Col xs={2} className='d-flex'>
              <Nav />
            </Col>
            <Col className='overflow-auto'>
              <Outlet />
              <Footer></Footer>
            </Col>
          </>
        )}>
          <Route path='/' element={<Home />} />
          <Route path='/propiedades' element={<Properties />} />
          <Route path='/contacto' element={<ContactView />} />
          <Route path='/detalle/:id' element={<Detail />} />
          <Route path='/empresa' element={<About />} />
        </Route>
        <Route path='/admin' element={<Admin/>} />
      </Routes>
    </div>
  )
}

export default App;
