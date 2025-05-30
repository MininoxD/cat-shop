"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  id: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  getTotalItems: () => number;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items]);

  const addToCart = (id: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === id);
      
      if (existingItem) {
        // Si el item ya existe, incrementar la cantidad
        return prevItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Si el item no existe, añadirlo con cantidad 1
        return [...prevItems, { id, quantity: 1 }];
      }
    });
  };

  // Eliminar un item del carrito
  const removeFromCart = (id: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === id);
      
      if (existingItem && existingItem.quantity > 1) {
        // Si hay más de 1, decrementar la cantidad
        return prevItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // Si solo hay 1, eliminar el item completamente
        return prevItems.filter((item) => item.id !== id);
      }
    });
  };

  // Vaciar el carrito
  const clearCart = () => {
    setItems([]);
  };

  // Obtener la cantidad de un item específico
  const getItemQuantity = (id: string) => {
    return items.find((item) => item.id === id)?.quantity || 0;
  };

  // Obtener el total de items en el carrito
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  // Actualizar la cantidad de un item directamente
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {

      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } else {

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    getItemQuantity,
    getTotalItems,
    updateQuantity,
    removeItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
