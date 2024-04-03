import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

export type CartActions =
  | { type: "add-to-cart"; payload: { item: Guitar } }
  | { type: "remove-from-cart"; payload: { id: Guitar["id"] } }
  | { type: "increase-quantity"; payload: { id: Guitar["id"] } }
  | { type: "decrease-quantity"; payload: { id: Guitar["id"] } }
  | { type: "clear-cart" };

export type CartState = {
  data: Guitar[];
  cart: CartItem[];
};

const localStorageInitialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem("cart");
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export const initialState: CartState = {
  data: db,
  cart: localStorageInitialCart(),
};

const MIN_ITEMS = 1;
const MAX_ITEMS = 5;

export function cartReducer(
  state: CartState = initialState,
  action: CartActions
) {
  if (action.type === "add-to-cart") {
    const itemExists = state.cart.some(
      (guitar) => guitar.id === action.payload.item.id
    );
    let updatedCart: CartItem[] = [];
    if (itemExists) {
      updatedCart = state.cart.map((item) => {
        if (item.id === action.payload.item.id && item.quantity < MAX_ITEMS) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    } else {
      updatedCart = [...state.cart, { ...action.payload.item, quantity: 1 }];
    }
    return {
      ...state,
      cart: updatedCart,
    };
  }

  if (action.type === "remove-from-cart") {
    return {
      ...state,
      cart: state.cart.filter((item) => item.id !== action.payload.id),
    };
  }

  if (action.type === "increase-quantity") {
    return {
      ...state,
      cart: state.cart.map((item) => {
        if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      }),
    };
  }

  if (action.type === "decrease-quantity") {
    return {
      ...state,
      cart: state.cart.map((item) => {
        if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      }),
    };
  }

  if (action.type === "clear-cart") {
    // Limpiar el storage
    localStorage.removeItem("cart");
    // Limpiamos todos los valores
    return {
      ...state,
      cart: [],
    };
  }
}
