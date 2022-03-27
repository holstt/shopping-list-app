import uuid from "react-native-uuid";
import Category from "./Category";

// Represents an item part of the shared item library.
// A LibraryItem can act as a reference for multiple ListItem
export default class LibraryItem {
  id: string;
  title: string;
  category: Category | null;

  constructor(title: string, category: Category | null = null) {
    this.id = uuid.v4().toString();
    this.title = title;
    this.category = category;
  }
}
