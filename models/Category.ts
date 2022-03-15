import uuid from "react-native-uuid";

export default class Category {
  id: string;
  title: string;
  color: string;

  constructor(title: string, color: string) {
    this.id = uuid.v4().toString();
    this.title = title;
    this.color = color;
  }
}
