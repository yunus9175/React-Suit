import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { type RootState } from "../../store"
import { addToCart, clearCart, decrementQty, incrementQty, removeFromCart, type CartItem, type Product } from "../../slice/cartSlice"

const PRODUCTS: Product[] = [
  { id: 'p1', title: 'Wireless Headphones', price: 59.99, image: 'https://picsum.photos/seed/phones/300/200' },
  { id: 'p2', title: 'Smart Watch', price: 89.00, image: 'https://picsum.photos/seed/watch/300/200' },
  { id: 'p3', title: 'Backpack', price: 35.50, image: 'https://picsum.photos/seed/bag/300/200' },
  { id: 'p4', title: 'Sneakers', price: 72.25, image: 'https://picsum.photos/seed/shoes/300/200' },
]

const Shopping: React.FC = () => {
  const dispatch = useDispatch()
  const items = useSelector((s: RootState) => s.cart.items)
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  return (
    <div className="shop-layout">
      <div className="products">
        {PRODUCTS.map(p => (
          <div className="product-card" key={p.id}>
            <img src={p.image} alt={p.title} loading="lazy" decoding="async" width={300} height={200} fetchPriority="low" />
            <div className="product-info">
              <div className="product-title">{p.title}</div>
              <div className="product-price">${p.price.toFixed(2)}</div>
            </div>
            <button onClick={() => dispatch(addToCart(p))}>Add to Cart</button>
          </div>
        ))}
      </div>

      <aside className="cart">
        <div className="cart-header">
          <h3>Cart</h3>
          {items.length > 0 && <button onClick={() => dispatch(clearCart())}>Clear</button>}
        </div>
        {items.length === 0 ? (
          <p className="muted">Your cart is empty.</p>
        ) : (
          <ul className="cart-list">
            {items.map((it: CartItem) => (
              <li key={it.id} className="cart-item">
                <img src={it.image} alt={it.title} loading="lazy" decoding="async" width={48} height={48} fetchPriority="low" />
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
      </aside>
    </div>
  )
}

export default Shopping


