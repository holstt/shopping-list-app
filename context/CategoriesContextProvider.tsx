import { useState } from "react";
import Category from "../models/Category";
import LibraryItem from "../models/LibraryItem";
import StorageService from "../services/StorageService";
import { CategoriesContext } from "./CategoriesContext";

interface Props {
  initCategories: Category[];
  children: React.ReactNode;
}

// XXX: Samme som categories --> Lav generic!
export default function CategoriesContextProvider({
  initCategories,
  children,
}: Props) {
  const [categories, setCategories] = useState<Category[]>(initCategories);

  // XXX: Genalisér. Samme logik som ListsView
  const addCategory = (categoryToAdd: Category) =>
    setCategories((prev) => {
      // tslint:disable-next-line: no-floating-promises
      StorageService.saveCategory(categoryToAdd);
      return [...prev, categoryToAdd];
    });

  const editCategory = (categoryToEdit: Category) =>
    setCategories((prev) => {
      // tslint:disable-next-line: no-floating-promises
      StorageService.saveCategory(categoryToEdit);
      return prev.map((item) =>
        item.id === categoryToEdit.id ? categoryToEdit : item
      );
    });

  const deleteCategory = (categoryToDeleteId: string) =>
    setCategories((prev) => {
      // tslint:disable-next-line: no-floating-promises
      StorageService.deleteLibraryItem(categoryToDeleteId);
      return prev.filter((item) => item.id !== categoryToDeleteId);
    });

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        addCategory,
        editCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}
