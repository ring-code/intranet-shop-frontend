import React from 'react';
import { FaShoppingCart } from 'react-icons/fa'; 
import { Badge } from 'react-bootstrap';
import { useCart } from './CartContext';

const CartIcon = () => {
  const { cart } = useCart(); 

  // Calculate the total number of items in the cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div data-testid="cart-icon" style={{ position: 'relative', display: 'inline-block' }}>
      <FaShoppingCart size={30} />
      {/* Display badge with the total cart count */}
      {cartItemCount > 0 && (
        <Badge
          pill
          bg="danger"
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            fontSize: '0.75rem',
            minWidth: '20px',
            textAlign: 'center',
          }}
        >
          {cartItemCount}
        </Badge>
      )}
    </div>
  );
};

export default CartIcon;
