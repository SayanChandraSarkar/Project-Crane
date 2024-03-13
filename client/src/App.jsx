import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "./components/Layout";
import Pdf from "./components/Pdf";

function App() {
  return (
    <>
      <Router>
        <Layout />
        {/* <Pdf/> */}
      </Router>
    </>
  );
}

export default App;
