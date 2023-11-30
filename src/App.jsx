import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './pages/login'
import Home from './pages/home'
import { Navbar } from './pages/NAvbar'
import { NavbarAT } from './pages/NavbarAT'
import { User } from './pages/user'
import PengaduanPage from './pages/Pengaduan'
import { Profile } from './pages/Profile'
import Masyarakat from './pages/Masyarakat'
import Petugas from './pages/Petugas'
import { InputProfile } from './pages/inputprofile'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Navbar />
      <NavbarAT />
      <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/Home' element={<Home />}/>
          <Route path='/User' element={<User />}/>
          <Route path='/Pengaduan' element={<PengaduanPage />}/>
          <Route path='/Profile' element={<Profile />}/>
          <Route path='/Masyarakat' element={<Masyarakat />}/>
          <Route path='/Petugas' element={<Petugas />}/>
          <Route path='/InputProfile' element={<InputProfile />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
