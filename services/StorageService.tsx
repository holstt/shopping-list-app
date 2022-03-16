import Category from "../models/Category";
import Entity from "../models/Entity";
import Item from "../models/Item";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ItemList from "../models/ItemList";
import AppData from "../AppData";
import { overlay } from "reactotron-react-native";

const ITEM_STORE_KEY = "item";
const CATEGORY_STORE_KEY = "category";
const ITEM_LIST_STORE_KEY = "itemList";
const APP_DATA_STORE_KEY = "appData";

// XXX: Lav StorageTestDataIntializer, GenericStorage/Storage, LocalStorage

export default class StorageService {
  public static async loadCategories(): Promise<Category[]> {
    return await this.loadMany<Category>(CATEGORY_STORE_KEY);
  }

  public static async loadItems(): Promise<Item[]> {
    return await this.loadMany<Item>(ITEM_STORE_KEY);
  }

  public static async loadItemLists(): Promise<ItemList[]> {
    return await this.loadMany<ItemList>(ITEM_LIST_STORE_KEY);
  }

  public static async saveItemList(itemList: ItemList) {
    await this.save(ITEM_LIST_STORE_KEY, itemList);
  }

  public static async saveItemLists(itemList: ItemList[]) {
    await this.saveMany<ItemList>(ITEM_LIST_STORE_KEY, itemList);
  }

  public static async loadAppData(): Promise<AppData> {
    const keys = (await AsyncStorage.getAllKeys()).filter((k) =>
      k.startsWith(APP_DATA_STORE_KEY)
    );

    // console.log("Found app data keys: ");
    // console.log(keys);
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

    const existingAppData = await this.loadWithKey<AppData>(keys[0]);
    if (existingAppData) {
      return existingAppData;
    } else {
      throw new Error("No app data found");
    }
  }

  public static async saveAppData(appData: AppData) {
    await this.save(APP_DATA_STORE_KEY, appData);
  }

  public static async saveItem(item: Item) {
    await this.save(ITEM_STORE_KEY, item);
  }
  public static async saveItems(items: Item[]) {
    await this.saveMany(ITEM_STORE_KEY, items);
  }

  public static async saveCategory(item: Item) {
    await this.save(CATEGORY_STORE_KEY, item);
  }
  public static async saveCategories(categories: Category[]) {
    await this.saveMany(CATEGORY_STORE_KEY, categories);
  }

  // If client have the key.
  public static async loadWithKey<T>(key: string): Promise<T | null> {
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

    // Make array of items from parsing value
    const items: T[] = jsonObjects.map((o) => (o[1] ? JSON.parse(o[1]) : null));
    return items;
  }

  public static async saveMany<T extends Entity>(store: string, objects: T[]) {
    const makeKey = (id: string) => store + ":" + id;
    const keyValuePairs = objects.map((o) => [
      makeKey(o.id),
      JSON.stringify(o),
    ]);

    await AsyncStorage.multiSet(keyValuePairs);
  }

  // tslint:disable-next-line: no-any
  public static async save<T extends Entity>(store: string, object: T) {
    const key = store + ":" + object.id;
    const jsonValue = JSON.stringify(object);
    await AsyncStorage.setItem(key, jsonValue);

    console.log("Object saved: " + key);
  }

  public static async clearAllData() {
    await AsyncStorage.clear();
  }
}
