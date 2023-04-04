import React from "react";
import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import AuthProvider from "./contexts/Auth";
import CustomRoutes from "./components/CustomRoutes";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    
    
    <BrowserRouter>
      <AuthProvider>
        <CustomRoutes />
      </AuthProvider>
      <Footer />
    <ToastContainer
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    </BrowserRouter>
    
  );
};

export default App;
