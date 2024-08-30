import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { HotelsList, MapView, RestaurantsList, AttractionsList, SearchResult } from "./pages";
import { PlaceDetails } from "./pages/templates";
import Grid from './pages/Grid';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatButton from "./pages/ChatButton";
import Logout from './pages/Logout';
import MyNavbar from "./pages/MyNavbar";

const App = () => {
  const location = useLocation();

  // List of routes where the Navbar should be hidden
  const hideNavbarRoutes = ['/', '/login', '/register'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <MyNavbar />}
      <Routes>
        <Route path="/home/*" element={<Grid />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/restaurants" element={<RestaurantsList />} />
        <Route path="/hotels" element={<HotelsList />} />
        <Route path="/attractions" element={<AttractionsList />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/:type/:id" element={<PlaceDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logged" element={<Grid />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      <ChatButton />
    </>
  );
};

export default App;
