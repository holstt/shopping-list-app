import Category from "../models/Category";
import Entity from "../models/Entity";
import ShoppingItem from "../models/ShoppingItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShoppingList from "../models/ShoppingList";
import AppData from "../AppData";
import { overlay } from "reactotron-react-native";
import LibraryItem from "../models/LibraryItem";
import { Platform } from "react-native";

const APP_DATA_STORE_KEY = "appData";
const CATEGORY_STORE_KEY = "category";
const LIST_ITEM_STORE_KEY = "listItem";
const LIBRARY_ITEM_STORE_KEY = "libraryItem";
const SHOPPING_LIST_STORE_KEY = "shoppingList";

// XXX: Lav StorageTestDataIntializer, GenericStorage/Storage, LocalStorage
export default class StorageService {
  // public static async loadLibraryItem(key : string): Promise<LibraryItem | null> {
  //   return await this.loadFromExactKey(key);
  // }

  public static async loadCategories(): Promise<Category[]> {
    const list = await this.loadMany<Category>(CATEGORY_STORE_KEY);
    return list.sort((a, b) => (a.index > b.index ? 1 : -1));
  }
  public static async loadShoppingLists(): Promise<ShoppingList[]> {
    const lists = await this.loadMany<ShoppingList>(SHOPPING_LIST_STORE_KEY);

    // Load library references for each item in lists.
    // await StorageService.syncProps(lists); // XXX: Find ud af om feature giver mening

    lists.forEach((list) =>
      list.items.sort((a, b) => (a.index > b.index ? 1 : -1))
    );

    return lists.sort((a, b) => (a.index > b.index ? 1 : -1));
  }

  // Sync props that reference other entity. //XXX: Brug relational db i stedet
  private static async syncProps(lists: ShoppingList[]) {
    for (let i = 0; i < lists.length; i++) {
      const list = lists[i];
      for (let i = 0; i < list.items.length; i++) {
        const item = list.items[i];
        if (item.libraryItemRefenceId) {
          const librayItemRef = await this.load<LibraryItem>(
            LIBRARY_ITEM_STORE_KEY,
            item.libraryItemRefenceId
          );
          // Ensure not deleted
          if (librayItemRef) {
            this.updateLibraryItemReference(item, librayItemRef);
          } else {
            this.removeLibraryItemReference(item);
          }
        }
      }
    }
  }

  public static removeLibraryItemReference(item: ShoppingItem) {
    item.libraryItemRefenceId = null;
  }

  public static updateLibraryItemReference(
    item: ShoppingItem,
    libraryItem: LibraryItem
  ) {
    // Update all props dependent on library item // XXX: Find bedre løsning
    item.title = libraryItem.title;
    item.category = libraryItem.category;
    item.id = libraryItem.id;
  }

  public static async loadLibraryItems(): Promise<LibraryItem[]> {
    const items = await this.loadMany<LibraryItem>(LIBRARY_ITEM_STORE_KEY);
    return items.sort((a, b) => (a.index > b.index ? 1 : -1));
  }

  public static async saveItemList(itemList: ShoppingList) {
    await this.save(SHOPPING_LIST_STORE_KEY, itemList);
  }

  public static async saveItemLists(itemList: ShoppingList[]) {
    await this.saveMany<ShoppingList>(SHOPPING_LIST_STORE_KEY, itemList);
  }

  public static async saveLibraryItems(libraryItems: LibraryItem[]) {
    // When library item changes -> Update all list items that reference it.
    // const lists = await this.loadItemLists();
    // lists.forEach((list) => {
    //   list.items.forEach((item) => {
    //     // Find and update any matches to input library items.
    //     libraryItems.forEach((libraryItem) => {
    //       if (item.libraryItemRefenceId === libraryItem.id) {
    //         item.updateLibraryItemReference(libraryItem);
    //       }
    //     });
    //   });
    // });

    await this.saveMany(LIBRARY_ITEM_STORE_KEY, libraryItems);
    // await this.saveMany(ITEM_LIST_STORE_KEY, lists);
  }

  public static async saveLibraryItem(libraryItem: LibraryItem) {
    // When library item changes -> Update all list items that reference it.
    // const lists = await this.loadItemLists();
    // lists.forEach((list) => {
    //   list.items.forEach((item) => {
    //     if (item.libraryItemRefenceId === libraryItem.id) {
    //       item.updateLibraryItemReference(libraryItem);
    //     }
    //   });
    // });

    await this.save(LIBRARY_ITEM_STORE_KEY, libraryItem);
    // await this.saveMany(ITEM_LIST_STORE_KEY, lists);
  }

  public static async deleteLibraryItem(id: string) {
    await this.delete(LIBRARY_ITEM_STORE_KEY, id);
  }

  public static async deleteCategory(id: string) {
    await this.delete(CATEGORY_STORE_KEY, id);
  }

  public static async deleteItemList(id: string) {
    await this.delete(SHOPPING_LIST_STORE_KEY, id);
  }

  public static async loadAppData(): Promise<AppData> {
    const keys = (await AsyncStorage.getAllKeys()).filter((k) =>
      k.startsWith(APP_DATA_STORE_KEY)
    );

    if (keys.length > 1) {
      throw new Error("Multiple AppData in storage");
    }

    // XXX: Hvem har ansvar?
    if (keys.length === 0) {
      console.log("No app data found. Creating new");
      const appData = new AppData();
      await this.saveAppData(appData);
      return appData;
    }

    const existingAppData = await this.loadFromExactKey<AppData>(keys[0]);
    if (existingAppData) {
      return existingAppData;
    } else {
      throw new Error("No app data found");
    }
  }

  public static async saveAppData(appData: AppData) {
    await this.save(APP_DATA_STORE_KEY, appData);
  }

  public static async saveCategory(category: Category) {
    await this.save(CATEGORY_STORE_KEY, category);
  }
  public static async saveCategories(categories: Category[]) {
    await this.saveMany(CATEGORY_STORE_KEY, categories);
  }

  // If client have the key.
  public static async loadFromExactKey<T>(key: string): Promise<T | null> {
    const json = await AsyncStorage.getItem(key);
    const item: T | null = json != null ? JSON.parse(json) : null;

    return item;
  }

  public static async load<T>(store: string, id: string): Promise<T | null> {
    const json = await AsyncStorage.getItem(`${store}:${id}`);
    const item: T | null = json != null ? JSON.parse(json) : null;

    return item;
  }

  public static async loadMany<T>(storeKey: string): Promise<T[]> {
    const keys = (await AsyncStorage.getAllKeys()).filter((k) =>
      k.startsWith(storeKey)
    );
    const jsonObjects = await AsyncStorage.multiGet(keys);

    // Make array of items by parsing value at second index
    const items: T[] = jsonObjects.map((o) => (o[1] ? JSON.parse(o[1]) : null));
    return items;
  }

  public static async saveMany<T extends Entity>(store: string, objects: T[]) {
    const makeKey = (id: string) => store + ":" + id;
    const keyValuePairs = objects.map((o) => [
      makeKey(o.id),
      JSON.stringify(o),
    ]);

    console.log("> (Async Storage) MULTI SAVED: " + store);
    await AsyncStorage.multiSet(keyValuePairs);
  }

  public static async delete(store: string, id: string) {
    const key = store + ":" + id;
    await AsyncStorage.removeItem(key);

    console.log("> (Async Storage) DELETED: " + key);
  }

  // tslint:disable-next-line: no-any
  public static async save<T extends Entity>(store: string, object: T) {
    const key = store + ":" + object.id;
    const jsonValue = JSON.stringify(object);
    await AsyncStorage.setItem(key, jsonValue);

    console.log("> (Async Storage) SAVED: " + key);
  }

  public static async clearAllData() {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
      if (Platform.OS === "android") {
        await AsyncStorage.clear();
      }
      if (Platform.OS === "ios") {
        await AsyncStorage.multiRemove(asyncStorageKeys);
      }
      await AsyncStorage.clear();
    }
  }
}
