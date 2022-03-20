import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  TouchableOpacity,
  ViewStyle,
  Animated,
  GestureResponderEvent,
} from "react-native";

import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import React, { useState } from "react";

import CheckButton from "./CheckButton";
import Item from "../../models/Item";

// TODO
// - Evt. icon size matcher ej med circle da ej kvadrat dim

interface ItemProps {
  item: Item;
  onCheckButtonPress: (item: Item) => void;
  onItemPress: (item: Item) => void;
  isLastElement?: boolean;
  onDeleteItem: (item: Item) => void;
}

export default function ItemRow({
  item,
  onCheckButtonPress,
  onItemPress,
  isLastElement,
  onDeleteItem,
}: ItemProps) {
  // console.log(onDeleteItem);
  // Resolve styles
  const container = [
    styles.containerBase,
    isLastElement ? styles.containerLast : null,
  ];

  const itemTextStyle = [
    styles.itemTextBase,
    item.isChecked ? styles.itemTextChecked : null,
  ];

  const onDeleteButtonPress = (event: GestureResponderEvent) => {
    console.log("delete");
    onDeleteItem(item);
  };

  const renderSwipeToDelete = (
    progressAnimatedValue: Animated.AnimatedInterpolation,
    dragAnimatedValue: Animated.AnimatedInterpolation
  ) => {
    return (
      <View style={styles.swipedRow}>
        <Animated.View>
          <TouchableOpacity onPress={onDeleteButtonPress}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderSwipeToDelete}>
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
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  swipedRow: {
    backgroundColor: "#FF0000",
    alignItems: "center",
    justifyContent: "center",
  },
  // deleteButton: {
  //   color: "red",
  // },
  deleteButtonText: {
    color: "white",
    padding: 10,
    fontSize: 15,
  },

  containerBase: {
    // backgroundColor: "lightgrey",
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