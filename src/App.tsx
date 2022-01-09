import { useState } from "react";
import { useQuery } from "react-query";
// components
import Cart from "./cart/Cart";
import Item from "./items/Items";
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";
// styles
import { Wrapper, StyledButton } from "./App.styles";
// types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch("https://fakestoreapi.com/products")).json();

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  );
  //console.log(data)

  const getTotalItems = (items: CartItemType[]) => {
    return items.reduce((curNumber: number, item) => {
      return curNumber + item.amount;
    }, 0);
  };
  const handleAddToCart = (clickedItem: CartItemType) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === clickedItem.id
    );
    const existingItem = cartItems[existingItemIndex];
    let updatedItems = [...cartItems];
    if (existingItem) {
      const updatedItem = { ...existingItem, amount: existingItem.amount + 1 };
      updatedItems[existingItemIndex] = updatedItem;
    } else {
      const newItem = { ...clickedItem, amount: 1 };
      updatedItems.push(newItem);
    }
    return setCartItems(updatedItems);
  };
  const handleRemoveFromCart = (id: number) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === id
    );
    const existingItem = cartItems[existingItemIndex];
    let updatedItems = [...cartItems];
    if (existingItem.amount ===1) {
      updatedItems = updatedItems.filter(item => item.id !==id);
    } else {
      const updatedItem = {...existingItem, amount: existingItem.amount -1};
      updatedItems[existingItemIndex]=updatedItem;
    }
    return setCartItems(updatedItems);
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong...</div>;

  // pridame tam ten otaznik za data, jinak by to hazelo error, kdyz by to bylo undefined
  return (
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
