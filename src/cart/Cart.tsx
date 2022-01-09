import CartItem from "../cartItem/CartItem";
// styles
import { Wrapper } from "./Cart.styles";
// types
import { CartItemType } from "../App";

type Props = {
  cartItems: CartItemType[];
  addToCart: (clickedItem: CartItemType) => void;
  removeFromCart: (id: number) => void;
};

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
  const calculateTotalPrice = (items: CartItemType[]) => {
    const totalPrice = items.reduce((curSum: number, item) => {
      return curSum + item.amount * item.price;
    }, 0);
    return totalPrice;
  };


  return (
    <Wrapper>
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 && <p>No items in cart</p>}
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      ))}
      <div>Total price: ${calculateTotalPrice(cartItems).toFixed(2)}</div>
    </Wrapper>
  );
};

export default Cart;
