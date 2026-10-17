import { Link, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Splash from './pages/Splash'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import MapPage from './pages/MapPage'
import Donate from './pages/Donate'

function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-brand-800">الصفحة غير موجودة</h1>
      <Link to="/home" className="mt-6 inline-block rounded-full bg-brand-700 px-6 py-3 text-white">
        العودة للرئيسية
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
