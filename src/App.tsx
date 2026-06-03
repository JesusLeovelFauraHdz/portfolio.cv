import { Routes, Route, Navigate } from 'react-router'
import Home from './pages/Home'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cpanel" element={<Navigate to="/cpanel" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
