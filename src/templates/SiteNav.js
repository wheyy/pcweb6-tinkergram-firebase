import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useLocation } from "react-router-dom" ;
import { auth } from "../firebase";
import { signOut } from "firebase/auth";



export default function SiteNav() {
  const [user,loading] = useAuthState(auth);
  const {hash, pathname, search} = useLocation();
  const [navbar, setNavbar] = useState(
    <>
    <Navbar variant="light" bg="light">
    <Container>
        <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
        <Nav>
        <Nav.Link href="/login">Log in</Nav.Link>
        <Nav.Link href="/signup">Sign Up</Nav.Link>
        </Nav>
    </Container>
    </Navbar>
    </>
    );
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
        if (pathname == '/signup'){
            return navigate("/signup")
        } else return navigate("/login")
    } else return setNavbar(
        <>
        <Navbar variant="light" bg="light">
            <Container>
            <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
            <Nav>
                <Nav.Link href="/add">New Post</Nav.Link>
                <Nav.Link onClick={(e) => signOut(auth)}>Sign Out</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
        </>
    );
  }, [navigate, user, loading, pathname]);

  return (
    navbar
  );
}
