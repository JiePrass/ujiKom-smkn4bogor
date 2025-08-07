import { Routes, Route } from "react-router-dom"
import Header from "./components/layouts/header"
import Home from "./pages/home"
import Event from "./pages/event" // pastikan file ini ada

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event" element={<Event />} />
      </Routes>
    </>
  )
}
