import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PostPageHome from './views/PostPageHome';
import LoginPage from './views/LoginPage';
import SignUpPage from './views/SignUpPage';

function App() {

  const router = createBrowserRouter([
    { path: "/", element:<PostPageHome /> },
    { path: "/login", element:<LoginPage /> },
    { path: "/signup", element:<SignUpPage /> },
  ])
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
