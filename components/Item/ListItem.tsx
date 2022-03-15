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
import Item from "../../models/Item";

// TODO
// - Evt. icon size matcher ej med circle da ej kvadrat dim

interface ItemProps {
  item: Item;
  onPress: (id: string) => void;
  isLastElement?: boolean;
}

export default function ListItem({
  item,
  onPress,
  isLastElement,
}: // index,
ItemProps) {
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
      <ItemButton
        isChecked={item.isChecked}
        onPress={() => onPress(item.id)}
      ></ItemButton>
      <Text style={itemTextStyle}>{item.title}</Text>
      <View
        style={[
          styles.categoryColor,
          { backgroundColor: item.category?.color },
        ]}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBase: {
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

  itemTextChecked: {
    textDecorationLine: "line-through",
  },
  categoryColor: {
    marginLeft: "auto",
    // backgroundColor: "#9F9EA28A",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 13,
    // marginTop: -14,
    // paddingTop: 7,
    height: "100%",
    // borderColor: "red",
    // borderWidth: 1,
    // justifyContent: "space-around",
    // alignSelf: "flex-end",
    // position: "absolute",
    // textAlign: "right",
    // float: "right",

    // top: 0,

    // color: "red",
    // borderColor: "red",
  },
});
