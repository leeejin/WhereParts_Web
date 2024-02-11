import React, { Component } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
// import '../css/TopPage.css';


import { Link } from 'react-router-dom';
export default class TopTemplate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="top">
        <Navbar bg="light" variant="light">
          <Navbar.Brand href='/' style={{ color: '#0066FF', marginLeft: '15px' }}>LogoImage</Navbar.Brand>
          <Nav className="ms-auto">
            <Link to="/" style={{ marginRight: '15px' }}>Logout</Link>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

