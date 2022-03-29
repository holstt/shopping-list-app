import React, { createContext, useState, ReactNode } from "react";
import LibraryItem from "../models/LibraryItem";

interface LibraryItemsState {
  addLibraryItem: (item: LibraryItem) => void;
  editLibraryItem: (item: LibraryItem) => void;
  deleteLibraryItem: (itemId: string) => void;
  libraryItems: LibraryItem[];
}

// Give initial empty values to avoid not null. // XXX: Fix senere med library
export const LibraryItemsContext = createContext<LibraryItemsState>({
  addLibraryItem: () => {},
  editLibraryItem: () => {},
  deleteLibraryItem: () => {},
  libraryItems: [],
});
