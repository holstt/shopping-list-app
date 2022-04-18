import Category from "../../models/Category";
import ShoppingItem from "../../models/ShoppingItem";
import ShoppingList from "../../models/ShoppingList";

export type ItemReducerAction =
  | { type: "ITEM_QUANTITY_CHANGED"; id: string; changedBy: number }
  | { type: "ITEM_CATEGORY_CHANGED"; id: string; category: Category | null }
  | { type: "ITEM_TITLE_CHANGED"; id: string; newTitle: string }
  | { type: "ITEM_CHECKED_TOGGLED"; id: string };

export function itemReducer(
  state: ShoppingItem,
  action: ItemReducerAction
): ShoppingItem {
  switch (action.type) {
    case "ITEM_QUANTITY_CHANGED": {
      const newQuantity = state.quantity + action.changedBy;
      return {
        ...state,
        quantity: newQuantity < 1 ? state.quantity : newQuantity,
      };
    }
    case "ITEM_CATEGORY_CHANGED":
      return {
        ...state,
        category: action.category,
      };

    case "ITEM_TITLE_CHANGED":
      return {
        ...state,
        title: action.newTitle,
      };

    case "ITEM_CHECKED_TOGGLED":
      return {
        ...state,
        isChecked: !state.isChecked,
      };
  }
}
