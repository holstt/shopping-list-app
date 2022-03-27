import { Text, StyleSheet, View, ScrollView } from "react-native";
import ChecklistView from "../components/Checklist/ChecklistView";
import ListItem from "../models/ListItem";
import { useState } from "react";
import StorageService from "../services/StorageService";
import ItemList from "../models/ItemList";

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../types";
import Category from "../models/Category";

type Props = BottomTabScreenProps<RootStackParamList, "CategoryLibraryScreen">;

export default function CategoryLibraryScreen({ navigation, route }: Props) {
  //   const [categories, setCategories] = useState<Category[]>(
  // route.params.categories
  //   );
  console.log("Categories in library: " + route.params.categories.length);

  const categories = route.params.categories.map((cat) => (
    <Text key={cat.id}>{cat.title}</Text>
  ));

  return (
    <View style={style.container}>
      <Text style={{ fontSize: 50 }}>Categories</Text>
      <ScrollView>{categories}</ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {},
});
