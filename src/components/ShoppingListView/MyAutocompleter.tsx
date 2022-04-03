import { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Colors from "../../config/colors";
import Category from "../../models/Category";
import LibraryItem from "../../models/LibraryItem";
import ShoppingItem from "../../models/ShoppingItem";

interface Props {
  query: string;
  items: LibraryItem[];
  onItemPress: (libraryItem: LibraryItem) => void;
}

export default function CustomAutocomplete({
  query,
  items,
  onItemPress,
}: Props) {
  const filterData = (query: string) => {
    return items.filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase())
    );
  };

  const queryResult = filterData(query);
  const itemsComponent = queryResult.map((item) => (
    <View key={item.id}>
      <TouchableOpacity
        style={styles.itemTextButton}
        onPress={() => onItemPress(item)}
      >
        <Text style={styles.itemText}>{item.title}</Text>
        <View
          style={[
            styles.categoryColorRectangle,
            { backgroundColor: item.category?.color },
          ]}
        ></View>
      </TouchableOpacity>
    </View>
  ));

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="always" style={styles.itemList}>
        {itemsComponent}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "red",
    marginLeft: -2,
    marginRight: -2,
  },
  // // Android does not support overflows -> necessary to wrap the autocomplete into a absolute positioned view.

  itemList: {
    width: "100%",
    // backgroundColor: "#FBFCFC",
    backgroundColor: "white",
    position: "absolute",
    zIndex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGreyDisabled,
    borderTopWidth: 0,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },

  // XXX: Genbrug fra andre item rows. Lav generic
  itemText: {
    padding: 5,
    color: Colors.darkGrey,
    fontSize: 20,
  },
  itemTextButton: {
    flex: 1,
    // backgroundColor: "lightgrey",
    flexDirection: "row",
  },

  categoryColorRectangle: {
    marginLeft: "auto",
    // backgroundColor: "red",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 13,
    marginTop: 4,
    marginBottom: 4,
  },
});
