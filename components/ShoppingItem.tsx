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

// TODO
// - Evt. icon size matcher ej med circle da ej kvadrat dim

interface ItemProps {
  text: string;
  // isChecked: boolean;
  isLastElement?: boolean;
}

export default function ShoppingItem({
  text,
  // isChecked,
  isLastElement,
}: ItemProps) {
  const [isChecked, setIsChecked] = useState(false);

  // Resolve button

  // Resolve styles
  const itemContainerStyle = [
    styles.itemContainer,
    isLastElement ? styles.itemContainerLast : null,
  ];

  const itemTextStyle = [
    styles.itemText,
    isChecked ? styles.itemTextChecked : null,
  ];

  return (
    <View style={itemContainerStyle}>
      <ItemButton
        isChecked={isChecked}
        onPress={() => setIsChecked((prevIsChecked) => !prevIsChecked)}
      ></ItemButton>
      <Text style={itemTextStyle}>{text}</Text>
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
