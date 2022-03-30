import { Text, StyleSheet, View, ScrollView } from "react-native";
import ListItem from "../models/ListItem";
import { useContext, useState } from "react";
import StorageService from "../services/StorageService";
import ItemList from "../models/ShoppingList";

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import Category from "../models/Category";
import { CategoriesContext } from "../state/CategoriesContext";
import { RootStackParamList } from "../RootNavigator";

type Props = BottomTabScreenProps<RootStackParamList, "CategoryLibraryScreen">;

// TODO: Lav færdig når har generic components
export default function CategoryLibraryScreen({ navigation, route }: Props) {
  const { categories } = useContext(CategoriesContext);

  const categoryListComponent = categories.map((cat) => (
    <Text key={cat.id}>{cat.title}</Text>
  ));

  return (
    <View style={style.container}>
      <Text style={{ fontSize: 50 }}>Categories</Text>
      <ScrollView>{categoryListComponent}</ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {},
});
