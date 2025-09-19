import { useEffect, useState, useRef } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Dogs from './features/dogs/Dogs'
import DogDetails from './features/dogs/DogDetails'
const Todo = lazy(() => import('./common/components/Todo'))
const Calculator = lazy(() => import('./common/components/Calculator'))
const Shopping = lazy(() => import('./common/components/Shopping'))
const Cart = lazy(() => import('./common/components/Shopping/Cart.tsx'))
import { useSelector } from 'react-redux'
import { type RootState } from './common/store'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) return saved
    return 'dark'
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const cartCount = useSelector((s: RootState) => s.cart.items.length)

  return (
    <BrowserRouter>
      <nav ref={navRef} className="navbar">
        <div className="nav-content">
          <div className="brand">Practice</div>
          <button className={`hamburger ${menuOpen ? 'active' : ''}`} aria-label="Menu" onClick={() => setMenuOpen(o => !o)}>
            <span />
            <span />
            <span />
          </button>
          <div className={`links ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'link active' : 'link'}>
              Todo App
            </NavLink>
            <NavLink to="/calculator" className={({ isActive }) => isActive ? 'link active' : 'link'}>
              Calculator
            </NavLink>
            <NavLink to="/shopping" className={({ isActive }) => isActive ? 'link active' : 'link'}>
              Shopping
            </NavLink>
            <NavLink to="/dogs" className={({ isActive }) => isActive ? 'link active' : 'link'}>
              Dogs
            </NavLink>
            <Link to="/cart" className="cart-badge" aria-label="Cart">
              🛒<span className="badge">{cartCount}</span>
            </Link>
            <button aria-label="Toggle theme" className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </nav>
      <main className="container">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Todo />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/shopping" element={<Shopping />} />
            <Route path="/dogs" element={<Dogs />} />
            <Route path="/dogs/:id" element={<DogDetails />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  )
}

export default App
