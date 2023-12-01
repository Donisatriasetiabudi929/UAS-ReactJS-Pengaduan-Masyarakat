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
import ProtectedRoute from './pages/roleAuth'
import Error from './pages/errorpage'

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
          <Route path='/error' element={<Error />}/>
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Infrastruktur', 'Sosial']} />}>
            <Route path='/Masyarakat' element={<Masyarakat />}/>
            <Route path='/Petugas' element={<Petugas />}/>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Infrastruktur', 'Sosial']} />}>
            <Route path='/Pengaduan' element={<PengaduanPage  />}></Route>
            <Route path='/Profile' element={<Profile />}/>
            <Route path='/InputProfile' element={<InputProfile />}/>
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
