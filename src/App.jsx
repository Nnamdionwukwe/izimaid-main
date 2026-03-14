import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./component/HomePage";
import RequestEstimate from "./component/RequestEstimate";
import LearnMore from "./component/LearnMore/LearnMore";
import Login from "./component/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<HomePage />} />

        <Route index path="/login" element={<Login />} />

        <Route path="/request-a-free-estimate" element={<RequestEstimate />} />

        <Route path="/why-hire-us" element={<LearnMore />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
