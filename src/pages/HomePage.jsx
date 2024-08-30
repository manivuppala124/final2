import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Ensure the correct path to App.css'
// import MyNavbar from './MyNavbar'; // Import MyNavbar component
import {motion} from 'framer-motion';
import Footer1 from './Footer1'; // Import Footer1 component

const Homepage = () => {
  const navigate = useNavigate(); // Get history object

  const handleExploreClick = () => {
    navigate('/login'); // Use history.push for navigation
  };

  return (
    <div>
      {/* <MyNavbar />  */}
      <div className="video-container">
        <video className="fullscreen-video" autoPlay muted loop>
          <source src="/vid-1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="explore-overlay">
          <h1 className='text-white text-5xl font-semi-bold font-poppins '>ADVENTURE IS WORTHWHILE</h1>
          <h4>Discover New Places With us,Adventure Awaits</h4>
          <div className=" ">
            <motion.button
            whileHover={{ scale: 1.1}}
            whileTap={{ scale: 0.9 }}
            
             className='text-white py-2 px-8 rounded my-6 bg-orange-400' onClick={handleExploreClick}>Explore With Us</motion.button>
          </div>
        </div>
      </div>
      <Footer1 /> 
    </div>
  );
};

export default Homepage;
