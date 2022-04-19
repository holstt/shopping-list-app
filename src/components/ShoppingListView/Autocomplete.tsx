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
  suggestions: LibraryItem[];
  onItemPress: (libraryItem: LibraryItem) => void;
}

export default function Autocomplete({ suggestions, onItemPress }: Props) {
  console.log("auto complete");
  const itemsComponent = suggestions.map((item) => (
    <View key={item.id}>
      <TouchableOpacity
        style={styles.suggestionTextButton}
        onPress={() => onItemPress(item)}
      >
        <Text style={styles.suggestionText}>{item.title}</Text>
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
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.suggestionsList}
      >
        {itemsComponent}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1, // TODO: Not working on iOS
  },

  // // Android does not support overflows -> necessary to wrap the autocomplete into a absolute positioned view.
  suggestionsList: {
    zIndex: 1, // TODO: Not working on iOS
    // elevation: 1,

    // elevation: 1,
    width: "100%",
    // backgroundColor: "#FBFCFC",
    backgroundColor: "white",
    position: "absolute",
    // borderWidth: 0,
    // borderColor: "#ECEBEC",
    // borderTopWidth: 1,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,

    // Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 10,
  },

  // XXX: Genbrug fra andre item rows. Lav generic
  suggestionText: {
    padding: 6,
    color: Colors.darkGrey,
    fontSize: 20,
    marginLeft: 10,
  },
  suggestionTextButton: {
    zIndex: 1,
    elevation: 1,
    flex: 1,
    // backgroundColor: "lightgrey",
    flexDirection: "row",
  },

  categoryColorRectangle: {
    marginLeft: "auto",
    // backgroundColor: "red",
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    width: 13,
    marginTop: 4,
    marginBottom: 4,
  },
});
