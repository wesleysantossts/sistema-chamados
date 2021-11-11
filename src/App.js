import {BrowserRouter} from "react-router-dom";
import Routes from "./routes";
import AuthProvider from "./contexts/auth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoClose={2500}/>
        <Routes/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
