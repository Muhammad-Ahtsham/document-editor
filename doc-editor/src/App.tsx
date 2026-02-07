import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import Login from "./pages/Login";
import Auth from "./components/Auth";
import { lazy } from "react";
const Signup = lazy(() => import("./pages/SignUp"));
const Document = lazy(() => import("./pages/Document")); 
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Auth>
                <Home />
              </Auth>
            }
          ></Route>
          <Route
            path="/document/:id"
            element={
              <Auth>
                <Document />
              </Auth>
            }
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
