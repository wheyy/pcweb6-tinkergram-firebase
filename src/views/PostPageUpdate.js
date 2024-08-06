import React, { useEffect, useState } from "react";
import { Button, Container, Form, Image } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,db, storage } from "../firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import SiteNav from "../templates/SiteNav";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export default function PostPageUpdate() {
  const params = useParams();
  const id = params.id;
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [user, loading] = useAuthState(auth);
  const [previewImage, setPreviewImage] = useState(
    "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
  );
  const navigate = useNavigate();

  async function updatePost() {
    const imageReference = ref(storage, `images/${image.name}`);
    const response = await uploadBytes(imageReference, image);
    const imageUrl = await getDownloadURL(response.ref);
    await updateDoc(doc(db, "posts", id), { caption, image: imageUrl });
    navigate("/");
  }


  async function getPost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();
    setCaption(post.caption);
    setImage(post.image);
    setPreviewImage(post.image)
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    getPost(id);
  }, [id, navigate, user, loading]);


  return (
    <div>
      <SiteNav/>
      <Container>
        <h1 style={{ marginBlock: "1rem" }}>Update Post</h1>
        <Form>
          <Form.Group className="mb-3" controlId="caption">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lovely day"
              value={caption}
              onChange={(text) => setCaption(text.target.value)}
            />
          </Form.Group>


          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => {
                const imageFile = e.target.files[0];
                const previewImage = URL.createObjectURL(imageFile);
                setImage(imageFile);
                setPreviewImage(previewImage);
              }}
            />
            <Form.Text className="text-muted">
              Make sure the file has a image type at the end: jpg, jpeg, png.
            </Form.Text>
          </Form.Group>
          <Image
            src={previewImage}
            style={{
              objectFit: "cover",
              width: "10rem",
              height: "10rem",
            }}
          /><br/><br/>
          <Button variant="primary" onClick={(e) => updatePost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
}
