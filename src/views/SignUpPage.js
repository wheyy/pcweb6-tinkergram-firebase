import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import SiteNav from "../templates/SiteNav";


export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user,loading] = useAuthState(auth);
  const navigate= useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) {
      alert("You are already logged in"); 
      navigate("/");
    }
  });

  return (
    <>
    <SiteNav/>
    <Container>
      <h1 className="my-3">Sign up for an account</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="/login">Have an existing account? Login here.</a>
        </Form.Group>
        <Button variant="primary"
        onClick={async (e) => {
          setError("");
          const canSignUp = username && password;
          if (canSignUp)
            try {
              await createUserWithEmailAndPassword(auth, username, password);
              navigate("/");
            } catch (error) {
              setError(error.message);
            }
        }}>
          Sign Up
          </Button>
      </Form>
      <p>{error}</p>
    </Container>
    </>
  );
}
