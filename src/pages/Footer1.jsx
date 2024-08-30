import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {FaHome,FaPhoneAlt} from 'react-icons/fa'

function Footer1() {
    return (
            <div className="bg-dark">
            <div className="container ">
                <div className='row py-5 text-white'>
                    <div className='col-md-3 col-sm-12'>
                        <h4 className="text-warning">TRIP PLANNER</h4>
                        <p>Trip Planner website helps you to effortlessly plan a trip and enjoy with ease at your dream vacation places </p>
                    </div>

                    <div className='col-md-3 col-sm-12'>
                        <h4 className="text-warning">Services</h4>
                        <p>About</p>
                        <p>Trip</p>
                        <p>Customer</p>
                    </div>

                    <div className='col-md-3 col-sm-12'>
                    <h4 className="text-warning">USEFUL LINKS</h4>
                        <p>Sitemap</p>
                        <p>Booking</p>
                        <p>Program</p>
                    </div>

                    <div className='col-md-3 col-sm-12'>
                    <h4 className="text-warning">ADDRESS</h4>
                        <FaHome className='me-1'/>G58 Team Members<br/>
                        <FaPhoneAlt className='me-2'/>202-B<br/>
                    </div>
            </div>
            <p className='text-white pb-5'>@copywrite code with G58</p>
        </div >
    </div >
  )
}
export default Footer1;
