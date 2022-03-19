import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import { useState } from "react";

import CheckButton from "./CheckButton";
import Item from "../../models/Item";

// TODO
// - Evt. icon size matcher ej med circle da ej kvadrat dim

interface ItemProps {
  item: Item;
  onCheckButtonPress: (item: Item) => void;
  onItemPress: (item: Item) => void;
  isLastElement?: boolean;
}

export default function ListItem({
  item,
  onCheckButtonPress,
  onItemPress,
  isLastElement,
}: ItemProps) {
  // Resolve styles
  const container = [
    styles.containerBase,
    isLastElement ? styles.containerLast : null,
  ];

  const itemTextStyle = [
    styles.itemTextBase,
    item.isChecked ? styles.itemTextChecked : null,
  ];

  return (
    <View style={container}>
      <CheckButton
        isChecked={item.isChecked}
        onPress={() => onCheckButtonPress(item)}
      ></CheckButton>
      <TouchableOpacity
        style={styles.itemTextButton}
        onPress={() => onItemPress(item)}
      >
        <Text style={itemTextStyle}>{item.title}</Text>
        <View
          style={[
            styles.categoryColor,
            { backgroundColor: item.category?.color },
          ]}
        ></View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBase: {
    // backgroundColor: "red",
    flexDirection: "row",
    borderTopColor: "#d5d8e3",
    alignItems: "center",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 5,
    borderWidth: 1,
    borderBottomColor: "transparent",
  },
  // Add a bottom border to the last item in the list
  containerLast: {
    borderBottomColor: "#d5d8e3",
  },
  itemTextBase: {
    // backgroundColor: "red",
    color: "#454a52",
    fontSize: 20,
  },
  itemTextButton: {
    flex: 1,
    // backgroundColor: "lightgrey",
    flexDirection: "row",
    height: "100%",
  },

  itemTextChecked: {
    textDecorationLine: "line-through",
  },
  categoryColor: {
    marginLeft: "auto",
    backgroundColor: "red",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 13,
  },
});
