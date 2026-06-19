import { Routes, Route } from 'react-router-dom'
import InvitationPage from './pages/InvitationPage'
import AdminPage from './pages/AdminPage'
import RsvpPage from "./pages/RsvpPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/invite/:id" element={<InvitationPage />} />
      <Route path="/rsvp/:id" element={<RsvpPage />} />
    </Routes>
  )
}