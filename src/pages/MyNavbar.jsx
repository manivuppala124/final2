import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContent';

function MyNavbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-warning">TRIP PLANNER</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/home" className="text-warning">Home</Nav.Link>
          <Nav.Link as={Link} to="/attractions" className="text-warning">Attractions</Nav.Link>
          <Nav.Link as={Link} to="/hotels" className="text-warning">Hotels</Nav.Link>
          <Nav.Link as={Link} to="/restaurants" className="text-warning">Restaurants</Nav.Link>
          <Nav.Link as={Link} to="/map" className="text-warning">Map View</Nav.Link>
          {!isAuthenticated ? (
            <>
              <Nav.Link as={Link} to="/login" className="text-warning">Login</Nav.Link>
              <Nav.Link as={Link} to="/register" className="text-warning">Register</Nav.Link>
            </>
          ) : (
            <Nav.Link onClick={handleLogout} className="text-warning">Logout</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
