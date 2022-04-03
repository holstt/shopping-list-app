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
import ShoppingItem from "../../models/ShoppingItem";
import Colors from "../../config/colors";
import Counter, { CountType } from "./Counter";
import Category from "../../models/Category";

// TODO
// - Evt. icon size matcher ej med circle da ej kvadrat dim

interface Props {
  item: ShoppingItem;
  onCheckButtonPress: (item: ShoppingItem) => void;
  onItemPress: (item: ShoppingItem) => void;
  isLastElement?: boolean;
  onRemoveItem: (itemId: string) => void;
  onPressCounter: (id: string, countType: CountType) => void;
  hasPrevItemCategory: boolean;
  hasNextItemCategory: boolean;
}

export default function ShoppingItemRow({
  item,
  onCheckButtonPress,
  onItemPress,
  isLastElement,
  onRemoveItem,
  onPressCounter,
  hasPrevItemCategory,
  hasNextItemCategory,
}: Props) {
  // Resolve styles
  const container = [
    styles.containerBase,
    isLastElement ? styles.containerLast : null,
  ];

  const itemTextStyle = [
    styles.itemTextBase,
    item.isChecked ? styles.itemTextChecked : null,
  ];
  // console.log("has prev cat " + hasPrevItemCategory);
  // console.log("has next cat " + hasNextItemCategory);

  const categoryStyle = [
    styles.categoryColorRectangleBase,
    hasPrevItemCategory && styles.categoryColorRectangleHasPrev,
    hasNextItemCategory && styles.categoryColorRectangleHasNext,
  ];

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
            <View style={styles.textContainer}>
              <Text
                style={[
                  itemTextStyle,
                  item.quantity > 1 && { paddingTop: 0, paddingBottom: 0 },
                ]}
              >
                {item.title}
              </Text>
              {item.quantity > 1 && (
                <Text style={styles.quantityText}>{item.quantity}</Text>
              )}
            </View>

            <View style={styles.rightContainer}>
              <Counter onPress={onPressCounter} id={item.id}></Counter>
              <View
                style={[
                  categoryStyle,
                  { backgroundColor: item.category?.color },
                ]}
              ></View>
            </View>
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
    alignItems: "center",

    paddingLeft: 5,

    borderColor: "transparent",
    borderWidth: 1,
    borderTopColor: "#d5d8e3",
  },
  // Add a bottom border to the last item in the list
  containerLast: {
    borderBottomColor: "#d5d8e3",
  },
  quantityText: {
    color: "#7B7D7D",
    fontSize: 14,
    // marginLeft: 5,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  counter: {
    // marginRight: 1000,
  },
  textContainer: {
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "blue",
  },

  itemTextBase: {
    // backgroundColor: "red",
    color: "#454a52",
    fontSize: 20,
    textAlign: "center",

    // includeFontPadding: false,
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

  categoryColorRectangleBase: {
    marginLeft: 30,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 13,
    marginTop: 5,
    marginBottom: 5,
  },
  categoryColorRectangleHasPrev: {
    marginTop: -1,
    borderTopLeftRadius: 0,
  },
  categoryColorRectangleHasNext: {
    marginBottom: -1,
    borderBottomLeftRadius: 0,
  },
});
