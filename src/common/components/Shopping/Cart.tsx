import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { type RootState } from "../../store"
import { clearCart, decrementQty, incrementQty, removeFromCart, type CartItem } from "../../slice/cartSlice"
import { Link } from "react-router-dom"

const Cart: React.FC = () => {
  const dispatch = useDispatch()
  const items = useSelector((s: RootState) => s.cart.items)
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  return (
    <div className="cart-page">
      <div className="cart-hero">
        <h2>Your Cart</h2>
        <p className="muted">Review items and proceed to checkout.</p>
      </div>
      <div className="cart-panel slide-in">
        <div className="cart-header">
          <h3>Cart ({items.reduce((n, i) => n + i.quantity, 0)})</h3>
          {items.length > 0 && <button onClick={() => dispatch(clearCart())}>Clear</button>}
        </div>
        {items.length === 0 ? (
          <div className="empty">
            <p>Your cart is empty.</p>
            <Link to="/shopping" className="link">Continue shopping →</Link>
          </div>
        ) : (
          <ul className="cart-list">
            {items.map((it: CartItem) => (
              <li key={it.id} className="cart-item">
                <img src={it.image} alt={it.title} />
                <div className="cart-info">
                  <div className="cart-title">{it.title}</div>
                  <div className="cart-price">${(it.price * it.quantity).toFixed(2)}</div>
                </div>
                <div className="cart-actions">
                  <button onClick={() => dispatch(decrementQty(it.id))}>-</button>
                  <span>{it.quantity}</span>
                  <button onClick={() => dispatch(incrementQty(it.id))}>+</button>
                </div>
                <button className="cart-remove" onClick={() => dispatch(removeFromCart(it.id))}>×</button>
              </li>
            ))}
          </ul>
        )}
        <div className="cart-total">Total: ${total.toFixed(2)}</div>
        <div className="cart-cta">
          <button disabled={items.length === 0}>Checkout</button>
        </div>
      </div>
    </div>
  )
}

export default Cart


