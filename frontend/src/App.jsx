import { Routes, Route } from "react-router-dom"
import Header from "./components/layouts/header"
import Home from "./pages/home"
import Event from "./pages/event"
import Login from "./pages/login"
import Register from "./pages/register"

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event" element={<Event />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}
