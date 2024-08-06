import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";
import { auth,db,storage } from "../firebase";
import { signOut } from "firebase/auth";
import { deleteDoc,doc,getDoc } from "firebase/firestore";
import SiteNav from "../templates/SiteNav";
import { getStorage, ref, deleteObject } from "firebase/storage";


export default function PostPageDetails() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const params = useParams();
  const id = params.id;
  const [user,loading] = useAuthState(auth);
  const navigate = useNavigate();

  async function deletePost(id) {
    const postDocument = await getDoc(doc(db,"posts", id));
    const post = postDocument.data();
    const deleteRef = ref(storage,`images/${post.imageName}`);
    await deleteObject(deleteRef).then(() => {
      // File deleted successfully
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
    await deleteDoc(doc(db, "posts", id));
    navigate("/");
  }


  async function getPost(id) {
    const postDocument = await getDoc(doc(db,"posts", id));
    const post = postDocument.data();
    setCaption(post.caption);
    setImage(post.image);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    getPost(id);
  }, [id, navigate, user, loading]);



  return (
    <>
      <SiteNav/>
      <Container>
        <Row style={{ marginTop: "2rem" }}>
          <Col md="6">
            <Image src={image} style={{ width: "100%" }} />
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>{caption}</Card.Text>
                <Card.Link href={`/update/${id}`}>Edit</Card.Link>
                <Card.Link
                  onClick={() => deletePost(id)}
                  style={{ cursor: "pointer" }}
                >
                  Delete
                </Card.Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
