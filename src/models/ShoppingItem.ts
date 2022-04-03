import uuid from "react-native-uuid";
import Category from "./Category";
import LibraryItem from "./LibraryItem";

// XXX: Måske get og set for library item..
// Represents an item part of a specific checklist.
export default class ShoppingItem {
  id: string;
  title: string;
  category: Category | null;
  quantity: number;
  isChecked: boolean;
  // Reference to the library item this item is based on (if any).
  libraryItemRefenceId: string | null; // XXX: Evt. find bedre løsning.
  index: number;

  static fromLibraryItem(
    libraryItem: LibraryItem,
    index: number
  ): ShoppingItem {
    return new ShoppingItem(
      libraryItem.title,
      index,
      libraryItem.category,
      libraryItem.id
    );
  }

  static fromNew(
    title: string,
    index: number,
    category: Category | null = null
  ) {
    return new ShoppingItem(title, index, category);
  }

  private constructor(
    title: string,
    index: number,
    category: Category | null = null,
    libraryItemId: string | null = null
  ) {
    this.id = uuid.v4().toString();
    this.isChecked = false;
    this.title = title;
    this.index = index;
    this.category = category;
    this.libraryItemRefenceId = libraryItemId;
    this.quantity = 1;
  }
}
