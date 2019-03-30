// src/components/Layout.js
import React from 'react';
import { Link } from 'react-router';
import { Button, Container, Row, Col, Navbar, Nav, NavItem, NavLink } from 'reactstrap';

export default class Layout extends React.Component {
  render() {
    return (
        <Container>
            <Row>
                <Col xs={{ offset: 4, size: 4 }}>
                    <Navbar>
                        <Nav>
                            <NavItem>
                                <NavLink>
                                    <Link to="/">
                                        Insert words
                                    </Link>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink>
                                    <Link to="/exercise">
                                        Exercise
                                    </Link>
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Navbar>
                </Col>
            </Row>
            <Row>
                {this.props.children}
            </Row>
        </Container>
    );
  }
}