import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const cartCount = useSelector((s: RootState) => s.cart.items.length)

  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-content">
          <div className="brand">Practice</div>
          <button className="hamburger" aria-label="Menu" onClick={() => setMenuOpen(o => !o)}>
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
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  )
}

export default App
