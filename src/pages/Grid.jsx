import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Grid.css'; // Assuming you save the CSS in Grid.css
import MyNavbar from './MyNavbar';
import Footer1 from './Footer1';
import { WhereTo } from '../components';
import Spinner from 'react-bootstrap/Spinner'; // Importing Spinner for the loader

const cities = [
  { id: 1, name: 'HYDERABAD', description: "Hyderabad, known for its rich history, vibrant culture, and exquisite cuisine. Famous for its iconic Charminar and as the hub of the IT industry.", image: 'attractions/HYDERABAD.jpg', latitude: 17.385044, longitude: 78.486671 },
  { id: 2, name: 'BANGALORE', description: "Bangalore is the Silicon Valley of India. Known for its pleasant climate, lush greenery, tradition, and its historic landmarks.", image: 'attractions/Bangalore-Palace_600.jpg', latitude: 12.971599, longitude: 77.594566 },
  { id: 3, name: 'MUMBAI', description: "Mumbai, the financial capital of India, known for Bollywood glamour, and iconic landmarks like the Gateway of India.", image: 'attractions/mumbaii.jpg', latitude: 19.076090, longitude: 72.877426 },
  { id: 4, name: 'DELHI', description: "Delhi, the capital city of India, with architectural marvels like the Red Fort, India Gate, magnificent temples and mosques with having great food.", image: 'attractions/shutterstock-redfort1.jpg', latitude: 28.704060, longitude: 77.102493 },
  { id: 5, name: 'MANALI', description: "Experience the breathtaking beauty and adventure of Manali, nestled in the Himalayas, perfect for nature lovers and thrill-seekers alike. Have the best time having maggie.", image: 'attractions/Manali.webp', latitude: 32.243187, longitude: 77.189176 },
  { id: 6, name: 'JAIPUR', description: "Jaipur, the Pink City of India, mesmerizes with its majestic palaces, vibrant bazaars, and rich Rajasthani culture, making it a royal destination for travelers.", image: 'attractions/jj.jpg', latitude: 26.912434, longitude: 75.787270 },
  { id: 7, name: 'CHENNAI', description: "Chennai, the capital of Tamil Nadu, is a bustling metropolis known for its beautiful beaches, rich heritage, and vibrant cultural scene.", image: 'attractions/chn.jpg', latitude: 13.082680, longitude: 80.270718 },
  { id: 8, name: 'KOLKATA', description: "Kolkata, the cultural capital of India, delights with its colonial architecture and rich cultural heritage, offering a unique blend of history for travelers to experience.", image: 'attractions/kk.jpg', latitude: 22.572646, longitude: 88.363895 },
  { id: 9, name: 'SURAT', description: "Surat is a diamond polishing and textile center on the banks of the Tapi River in Gujarat, India. It's known for its Dutch Cemetery, 16th-century Surat Castle, and Mughal-era chowks (markets).", image: 'attractions/su.webp', latitude: 21.170240, longitude: 72.831061 },
  { id: 10, name: 'PUNE', description: "Pune, also known as Poona, is the second-largest city in Maharashtra, India, after Mumbai. It was the cultural capital of the Maratha Empire in early 19th centuries. It is known for its historical sites such as Shaniwar Wada.", image: 'attractions/pu.jpeg', latitude: 18.520430, longitude: 73.856743 },
  { id: 11, name: 'VISHAKAPATNAM', description: "Visakhapatnam, also known as Vizag, is a coastal gem of Andhra Pradesh, boasting pristine beaches, scenic hills, rich cultural heritage, and its delicious seafood.", image: 'attractions/vk.jpg', latitude: 17.686816, longitude: 83.218482 },
  { id: 12, name: 'LUCKNOW', description: "Lucknow, the capital of Uttar Pradesh, is a city renowned for its rich history, elegant architecture, and mouthwatering cuisine. Explore the city's majestic monuments.", image: 'attractions/lk.jpg', latitude: 26.846709, longitude: 80.946159 },
  { id: 13, name: 'DHANUSHKOTI', description: "Dhanushkoti, a ghost town at the southern tip of Rameshwaram island in India, was once a thriving town connecting India to Sri Lanka. A 1964 cyclone devastated the town.", image: 'attractions/DK.jpeg', latitude: 9.231872, longitude: 79.319469 },
  { id: 14, name: 'SHILONG', description: "Shillong, the capital of Meghalaya state in northeastern India, is a hill station renowned for its scenic beauty. Waterfalls like Shillong Falls and Elephant Falls are popular attractions.", image: 'attractions/shilong.jpeg', latitude: 25.578773, longitude: 91.893254 },
  { id: 15, name: 'BHOPAL', description: "Discover the rich history and cultural heritage of Bhopal, a city of lakes and magnificent Mughal architecture. Visit its historic sites, vibrant bazaars, and serene lakes.", image: 'attractions/bp.jpg', latitude: 23.259933, longitude: 77.412615 },
  { id: 16, name: 'DARJEELING', description: "Experience the enchanting allure of Darjeeling, nestled in the Himalayas, renowned for its lush tea gardens and panoramic views of Kanchenjunga. Enjoy a ride on the Darjeeling Himalayan.", image: 'attractions/dar.jpeg', latitude: 27.036007, longitude: 88.262675 }
];


const COHERE_API_KEY = '4DXFsPiFWGRBusJhGMRWSw6VO848SKbliQ09CCz0';
const GENERATE_URL = 'https://api.cohere.ai/v1/generate';
const SUMMARIZE_URL = 'https://api.cohere.ai/v1/summarize';

const Grid = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityRecommendations, setCityRecommendations] = useState({ bulletPoints: [], fullText: '' });
  const [loading, setLoading] = useState(false); // Loading state for the loader
  const [showFullText, setShowFullText] = useState(false);
  const navigate = useNavigate();

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const generateText = async (cityName) => {
    try {
      const response = await fetch(GENERATE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Provide a detailed travel guide for ${cityName}. Highlight key attractions, historical sites, cultural experiences, and local cuisine.`,
          max_tokens: 500,
          temperature: 0.7,
          stop_sequences: [],
          return_likelihoods: 'NONE',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.generations || !data.generations[0] || !data.generations[0].text) {
        throw new Error('Invalid response format');
      }

      return data.generations[0].text.trim();
    } catch (error) {
      console.error('Error generating text:', error);
      return '';
    }
  };

  const summarizeText = async (text) => {
    try {
      const response = await fetch(SUMMARIZE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          length: 'medium',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.summary) {
        throw new Error('Invalid response format');
      }

      return data.summary;
    } catch (error) {
      console.error('Error summarizing data:', error);
      return text;
    }
  };

  const formatToBulletPoints = (text) => {
    return text
      .split(/[\.\n]/) // Split by periods or new lines
      .map((point) => point.trim()) // Remove extra spaces
      .filter((point) => point.length > 0); // Remove empty points
  };

  const getRecommendations = async (cityName) => {
    setLoading(true); // Start loading when fetching recommendations
    try {
      const generatedText = await generateText(cityName);
      if (generatedText) {
        const summarizedText = await summarizeText(generatedText);
        const bulletPoints = formatToBulletPoints(summarizedText);
        setCityRecommendations({ bulletPoints, fullText: summarizedText });
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false); // Stop loading when the data is fetched
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const closestCity = cities.reduce((prevCity, currCity) => {
        const prevDistance = calculateDistance(
          latitude,
          longitude,
          prevCity.latitude,
          prevCity.longitude
        );
        const currDistance = calculateDistance(
          latitude,
          longitude,
          currCity.latitude,
          currCity.longitude
        );
        return currDistance < prevDistance ? currCity : prevCity;
      });
      setSelectedCity(closestCity);
    }, () => {
      setSelectedCity(cities[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedCity) {
      getRecommendations(selectedCity.name);
    }
  }, [selectedCity]);

  const handleCityClick = (city) => {
    setSelectedCity(city);
    navigate(`/search?location=${city.name.toLowerCase()}`);
  };

  const handleToggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div>
      {/* <MyNavbar /> */}
      <div className="container my-4">
        <h1 className="text-center mb-4">Explore Cities</h1>

        <WhereTo className="mb-4" />

        {selectedCity && (
          <div className="recommended-city-container">
            <h2 className="recommended-city-header">
              Recommended City: {selectedCity.name}
            </h2>
            <img
              src={selectedCity.image}
              alt={selectedCity.name}
              className="recommended-city-image"
            />
            <div className="recommendation-text">
              {loading ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : showFullText ? (
                <p>{cityRecommendations.fullText}</p>
              ) : (
                <ul>
                  {cityRecommendations.bulletPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              )}
              {!loading && (
                <Button variant="link" onClick={handleToggleText}>
                  {showFullText ? 'Show Less' : 'Show More'}
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="row">
          {cities.map((city) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={city.id}>
              <Card
                onClick={() => handleCityClick(city)}
                className={selectedCity?.id === city.id ? 'border-primary' : ''}
              >
                <Card.Img variant="top" src={city.image} alt={city.name} />
                <Card.Body>
                  <Card.Title>{city.name}</Card.Title>
                  <Card.Text>{city.description}</Card.Text>
                  <Button variant="primary">Explore</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <Footer1 />
    </div>
  );
};

export default Grid;
