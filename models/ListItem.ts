import uuid from "react-native-uuid";
import Category from "./Category";
import LibraryItem from "./LibraryItem";

// XXX: Måske get og set for library item..
// Represents an item part of a specific checklist.
export default class ListItem {
  id: string;
  title: string;
  category: Category | null;
  isChecked: boolean;
  // Reference to the library item this item is based on (if any).
  libraryItemRefenceId: string | null; // XXX: Evt. find bedre løsning.

  static fromLibraryItem(libraryItem: LibraryItem): ListItem {
    return new ListItem(
      libraryItem.title,
      libraryItem.category,
      libraryItem.id
    );
  }

  updateLibraryItemReference(libraryItem: LibraryItem) {
    // Update all props dependent on library item // XXX: Find bedre løsning
    this.title = libraryItem.title;
    this.category = libraryItem.category;
    this.id = libraryItem.id;
  }

  static fromNonLibraryItem(title: string, category: Category | null = null) {
    return new ListItem(title, category);
  }

  private constructor(
    title: string,
    category: Category | null = null,
    libraryItemId: string | null = null
  ) {
    this.id = uuid.v4().toString();
    this.isChecked = false;
    this.title = title;
    this.category = category;
    this.libraryItemRefenceId = libraryItemId;
  }
}
