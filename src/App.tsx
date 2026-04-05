import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Hooks from "./pages/Hooks";
import Skills from "./pages/Skills";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hooks" element={<Hooks />} />
        <Route path="/skills" element={<Skills />} />
      </Routes>
    </BrowserRouter>
  );
}
