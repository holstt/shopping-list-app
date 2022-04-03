import ShoppingItem from "./ShoppingItem";
import uuid from "react-native-uuid";

export default class ShoppingList {
  id: string;
  title: string;
  items: ShoppingItem[];
  index: number; // How the list should be ordered relative to other lists // XXX: Ensure no dups?

  // XXX: make items default empty arr
  constructor(title: string, items: ShoppingItem[], index: number) {
    this.id = uuid.v4().toString();
    this.title = title;
    this.items = items;
    this.index = index;
  }
}
