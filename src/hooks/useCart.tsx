import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')
  

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {

   await api.get("http://localhost:3333/products")
    .then((response)=>{
      response.data.map((product:Product) => {
       if(product.id === productId){
          setCart([...cart,...[product]])
         localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart,...[product]]))
       }
      })
    })
  };
  const removeProduct = (productId: number) => {

      for(let i in cart){
        console.log(i)
        if(cart[i].id === productId){
          setCart(cart.splice(Number(i), 1));
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart.splice(Number(i),1)))
          console.log(cart[i])
        }
      }

  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
