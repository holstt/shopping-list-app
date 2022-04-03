import { Text, StyleSheet, View, ScrollView } from "react-native";
import ShoppingItem from "../models/ShoppingItem";
import { useContext, useState } from "react";
import StorageService from "../services/StorageService";
import ItemList from "../models/ShoppingList";

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import Category from "../models/Category";
import { CategoriesContext } from "../state/CategoriesContext";
import { RootStackParamList } from "../RootNavigator";
import Autocomplete from "react-native-autocomplete-input";

type Props = BottomTabScreenProps<RootStackParamList, "CategoryLibraryScreen">;

// TODO: Lav færdig når har generic components
export default function CategoryLibraryScreen({ navigation, route }: Props) {
  const { categories } = useContext(CategoriesContext);

  const categoryListComponent = categories.map((cat) => (
    <Text key={cat.id}>{cat.title}</Text>
  ));

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 50 }}>Categories</Text>
      <ScrollView>{categoryListComponent}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
