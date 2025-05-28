import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import Forget from "./pages/User/ForgetPassword";
import Reset from "./pages/User/ResetPassword";
import Partner from "./pages/Partner";
import Profile from "./pages/User";
import SingleMovie from "./pages/Home/SingleMovie";
import BookShow from "./pages/Home/BookShow";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path={"/"}
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/register"} element={<Register />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/partner"
              element={
                <ProtectedRoute>
                  <Partner />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/forget" element={<Forget />} />
            <Route path="/reset/:email" element={<Reset />} />
            <Route
              path="/movie/:id"
              element={
                <ProtectedRoute>
                  <SingleMovie />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/book-show/:id"
              element={
                <ProtectedRoute>
                  <BookShow />
                </ProtectedRoute>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '10px',
              border: '1px solid #555',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              style: {
                background: '#10B981',
                color: '#fff',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: '#fff',
              },
            },
          }}
        />
      </div>
    </Provider>
  );
}

export default App;
