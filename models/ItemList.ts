import ListItem from "./ListItem";
import uuid from "react-native-uuid";

// XXX: Checklist/ShoppingList?
export default class ItemList {
  id: string;
  title: string;
  items: ListItem[];
  index: number; // How the list should be ordered relative to other lists // XXX: Ensure no dups?

  // XXX: make items default empty arr
  constructor(title: string, items: ListItem[], index: number) {
    this.id = uuid.v4().toString();
    this.title = title;
    this.items = items;
    this.index = index;
  }
}
