import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  useContext,
} from "react";
import ShoppingList from "../models/ShoppingList";
import {
  ShoppingListReducerAction,
  ShoppingListReducerState,
} from "./reducers/shoppingListsReducer";

interface ShoppingListState {
  state: ShoppingListReducerState;
  dispatch: Dispatch<ShoppingListReducerAction>;
}
// Give initial empty values to avoid not null. // XXX: Fix senere med library
export const ShoppingListsContext = createContext<
  ShoppingListState | undefined
>(undefined);

export function useShoppingListsContext() {
  const context = useContext(ShoppingListsContext);

  if (!context) {
    throw new Error(
      "Component was not wrapped in the required context provider: ShoppingListsContext"
    );
  }
  return context;
}
