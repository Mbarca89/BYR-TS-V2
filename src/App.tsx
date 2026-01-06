import "./Global.css"
import { Route, Routes, Outlet, useLocation } from 'react-router-dom';
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
import { useLayoutEffect } from "react";

const Wrapper = ({ children }: any) => {
  const location = useLocation();

  useLayoutEffect(() => {
    // Scroll to the top of the page when the route changes
    const scrollToOptions = { top: -10, left: 0, behavior: 'instant' };
    window.scrollTo(scrollToOptions as unknown as ScrollToOptions);
  }, [location.pathname]);

  return children;
};

function App() {
  return (
    <Wrapper>

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
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </div>
    </Wrapper>
  );
}

export default App;
