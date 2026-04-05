'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  categoria: string;
  quantidade: number;
  estoque: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantidade'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantidade: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('@bigot-imports/cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('@bigot-imports/cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Omit<CartItem, 'quantidade'>) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantidade >= product.estoque) return prev;
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantidade: item.quantidade + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantidade: 1 }];
    });
    openCart();
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantidade: number) => {
    setCart((prev) => 
      prev.map(item => {
        if (item.id === id) {
          const validQty = Math.min(Math.max(1, quantidade), item.estoque);
          return { ...item, quantidade: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = cart.reduce((total, item) => total + item.preco * item.quantidade, 0);
  const cartCount = isLoaded ? cart.reduce((count, item) => count + item.quantidade, 0) : 0;

  return (
    <CartContext.Provider value={{
      cart: isLoaded ? cart : [],
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal: isLoaded ? cartTotal : 0,
      cartCount,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
