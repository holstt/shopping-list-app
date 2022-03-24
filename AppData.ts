import uuid from "react-native-uuid";

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
