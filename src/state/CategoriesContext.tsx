import React, { createContext, useState, ReactNode } from "react";
import Category from "../models/Category";
import LibraryItem from "../models/Category";

interface CategoriesState {
  addCategory: (category: Category) => void;
  editCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  categories: Category[];
}

// Give initial empty values to avoid not null. // XXX: Fix senere med library
export const CategoriesContext = createContext<CategoriesState>({
  addCategory: () => {},
  editCategory: () => {},
  deleteCategory: () => {},
  categories: [],
});
