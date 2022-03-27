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
  onRemoveItem: (itemId: string) => void;
}

export default function ItemRow({
  item,
  onCheckButtonPress,
  onItemPress,
  isLastElement,
  onRemoveItem,
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

  // const onRemoveButtonPress = (event: GestureResponderEvent) => {
  //   onRemoveItem(item.id);
  // };

  const renderSwipeToDelete = (
    progressAnimatedValue: Animated.AnimatedInterpolation,
    dragAnimatedValue: Animated.AnimatedInterpolation
  ) => {
    return (
      <View style={styles.swipedRow}>
        <Animated.View>
          <TouchableOpacity onPress={() => onRemoveItem(item.id)}>
            <Text style={styles.removeButtonText}>Remove</Text>
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

  swipedRow: {
    backgroundColor: "#FF0000",
    alignItems: "center",
    justifyContent: "center",
  },
  // deleteButton: {
  //   color: "red",
  // },
  removeButtonText: {
    color: "white",
    padding: 10,
    fontSize: 15,
  },

  categoryColor: {
    marginLeft: "auto",
    // backgroundColor: "red",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 13,
  },
});
