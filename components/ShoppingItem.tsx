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

import ItemButton from "./ItemButton";
import Item from "../models/Item";

// TODO
// - Evt. icon size matcher ej med circle da ej kvadrat dim

interface ItemProps {
  item: Item;
  onPress: (index: number) => void;
  isLastElement?: boolean;
  index: number;
}

export default function ShoppingItem({
  item,
  onPress,
  isLastElement,
  index,
}: ItemProps) {
  // Resolve styles
  const itemContainerStyle = [
    styles.itemContainer,
    isLastElement ? styles.itemContainerLast : null,
  ];

  const itemTextStyle = [
    styles.itemText,
    item.isChecked ? styles.itemTextChecked : null,
  ];

  return (
    <View style={itemContainerStyle}>
      <ItemButton
        isChecked={item.isChecked}
        onPress={() => onPress(index)}
      ></ItemButton>
      <Text style={itemTextStyle}>{item.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
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
  itemContainerLast: {
    borderBottomColor: "#d5d8e3",
  },
  itemText: {
    backgroundColor: "#fff",
    color: "#454a52",
    fontSize: 20,
  },

  itemTextChecked: {
    textDecorationLine: "line-through",
  },
});
