import { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Header, Map, Sidebar, Filter } from "../components/map";
import { MainContext } from "../context/MainContext";

const MapView = () => {
    const { places = [], coordinates, setCoordinates, setBounds, filteredPlaces } = useContext(MainContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Coordinates updated:", coordinates);
    }, [coordinates]);

    useEffect(() => {
        console.log("Places data:", filteredPlaces ? filteredPlaces : places);
    }, [filteredPlaces, places]);

    return ( 
        <div className="w-full flex flex-wrap-reverse md:flex-nowrap md:h-screen">
            <div className="h-auto md:h-full w-full md:w-[35%] lg:w-[23%]">
                <div className="w-full text-center">
                    <button 
                        className="bg-black text-white py-2 px-8 rounded my-2 hover:bg-gray-600 transition ease-in duration-100"
                        onClick={() => navigate(-1)}
                    >
                        <p>Close Map View</p>
                    </button>
                </div>
                <div className="h-[calc(100vh-60px)] overflow-y-auto">
                    <Sidebar places={filteredPlaces ? filteredPlaces : places} />
                </div>
            </div>
            <div className="h-[50vh] md:h-full w-full md:w-[65%] lg:w-[77%] relative">
                <Header setCoordinates={setCoordinates} />
                <Map 
                    setBounds={setBounds}
                    setCoordinates={setCoordinates}
                    coordinates={coordinates}
                    places={filteredPlaces ? filteredPlaces : places}
                />
                <Filter />
            </div>
        </div>
    );
}

export default MapView;
