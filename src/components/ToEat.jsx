import { useContext } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import PlaceCard from "./PlaceCard";
import { PlaceCardLoader } from "./loaders";
import { MainContext } from "../context/MainContext";

// Custom Next Arrow Component
const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: 'block', background: 'black' }}
            onClick={onClick}
        />
    );
}

// Custom Previous Arrow Component
const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: 'block', background: 'black' }}
            onClick={onClick}
        />
    );
}

// Slick Carousel Responsive Options
const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const ToEat = () => {
    // Bringing the Restaurant state from the Main context and saved into variable name 'places'
    const { restaurants: places } = useContext(MainContext);
    
    return ( 
        <>
            { !places || places?.length < 1 ? (
                // if places list is empty, render a Loader
                <PlaceCardLoader />
            ) : (
                // Places are ready, hence the element below is render
                <div className="container mx-auto p-4">
                    <h2 className="font-semibold text-lg md:text-2xl">
                        Place to Eat
                    </h2>
                    <p className="text-sm text-dark mb-2">
                        These are some places you might want to visit
                    </p>

                    {/* Slick Carousel to Render Places in Carousel */}
                    <Slider {...settings}>
                        {/* Mapping through the Places Object, a place card is rendered for each data */}
                        {places?.map((place, index) => (
                            // Place card receives each place as prop
                            <PlaceCard key={index} place={place} type="restaurants" />
                        ))}
                        {/* --- */}
                    </Slider>
                    {/* --- */}
                </div>
            )}
        </>
     );
}
 
export default ToEat;
