import uuid from "react-native-uuid";
import StorageService from "./services/StorageService";

// XXX: Ensure singleton?

/**
 * General data about the app.
 */
export default class AppData {
  id: string;
  lastActiveListId: string | null;

  constructor(lastActiveListId: string | null = null) {
    this.id = uuid.v4().toString();
    this.lastActiveListId = lastActiveListId;
  }
}
