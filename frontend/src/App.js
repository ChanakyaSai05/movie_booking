import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import Forget from "./pages/User/ForgetPassword";
import Reset from "./pages/User/ResetPassword";
import Partner from "./pages/Partner";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <Routes>
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
            <Route path="/forget" element={<Forget />} />
            <Route path="/reset/:email" element={<Reset />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
