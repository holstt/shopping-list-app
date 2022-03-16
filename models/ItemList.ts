import Item from "./Item";
import uuid from "react-native-uuid";

export default class ShoppingList {
  id: string;
  title: string;
  items: Item[];

  constructor(title: string, items: Item[]) {
    this.id = uuid.v4().toString();
    this.title = title;
    this.items = items;
  }
}
