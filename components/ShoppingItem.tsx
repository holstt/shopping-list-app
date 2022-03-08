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

import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

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

  // Component?? ItemButton
  const buttonChecked = (
    <TouchableOpacity
      // style={styles.buttonChecked}
      onPress={() => setIsChecked((prevIsChecked) => !prevIsChecked)}
    >
      <FontAwesome
        // style={styles.buttonIcon}
        name="check-circle"
        size={29} // XXX: Dynamisk?
        color="#2d7ffa"
      />
    </TouchableOpacity>
  );

  const itemContainerStyle = [
    styles.itemContainer,
    isLastElement ? styles.itemContainerLast : null,
  ];

  const buttonDefault = (
    <TouchableOpacity
      style={styles.buttonDefault}
      onPress={() => setIsChecked((prevIsChecked) => !prevIsChecked)}
    />
  );
  const itemTextStyle = [
    styles.itemText,
    isChecked ? styles.itemTextChecked : null,
  ];
  return (
    <View style={itemContainerStyle}>
      <View style={styles.buttonContainer}>
        {isChecked ? buttonChecked : buttonDefault}
      </View>
      <Text style={itemTextStyle}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    borderTopColor: "#d5d8e3",
    // flex: 1,
    // height: 100,
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
    // backgroundColor: "blue",
    borderBottomColor: "#d5d8e3",
    // borderWidth: 2,
  },

  buttonChecked: {
    // backgroundColor: "red",
    // borderColor: "red",
    // borderWidth: 3,
    // width: 25,
    // height: 25,
    // borderRadius: 99,
    // paddingBottom: 5,
    // alignItems: "center",
    // justifyContent: "center",
    // overflow: "visible",
  },
  buttonIcon: {
    // backgroundColor: "black",
    // position: "relative",
    // // marginLeft: 5,
    // // overflow: "hidden",
    // overflow: "visible",
  },
  buttonContainer: {
    width: 29,
    height: 29,
    // Center icon inside
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "green",
    marginRight: 7,
    // overflow: "visible",
  },
  buttonDefault: {
    borderColor: "#2d7ffa",
    borderWidth: 3,
    // Fill container
    width: "90%",
    height: "90%",
    borderRadius: 99,
    // backgroundColor: "red",
  },
  itemText: {
    // flex: 1,
    backgroundColor: "#fff",
    color: "#454a52",
    fontSize: 20,
  },

  itemTextChecked: {
    textDecorationLine: "line-through",
  },
});
