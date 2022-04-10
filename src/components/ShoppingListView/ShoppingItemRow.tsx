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

import React, { MutableRefObject, useState } from "react";

import CheckButton from "./CheckButton";
import ShoppingItem from "../../models/ShoppingItem";
import Colors from "../../config/colors";
import QuantityButtons, { CountType } from "./QuantityButtons";
import Category from "../../models/Category";

// TODO
// - Evt. icon size matcher ej med circle da ej kvadrat dim

interface Props {
  item: ShoppingItem;
  onCheckButtonPress: (item: ShoppingItem) => void;
  onItemPress: (item: ShoppingItem) => void;
  isLastElement?: boolean;
  isFirstItem?: boolean;
  onRemoveItem: (item: ShoppingItem) => void;
  onPressCounter: (id: string, countType: CountType) => void;
  hasPrevItemCategory: boolean;
  hasNextItemCategory: boolean;
  swipableRowRef: (ref: Swipeable) => void;
  onSwipeToDeletedStarted: (index: number) => void;
  index: number;
}

export default function ShoppingItemRow({
  index,
  item,
  onCheckButtonPress,
  onItemPress,
  isLastElement,
  isFirstItem,
  onRemoveItem,
  onPressCounter,
  hasPrevItemCategory,
  hasNextItemCategory,
  swipableRowRef,
  onSwipeToDeletedStarted,
}: Props) {
  // Resolve styles
  const container = [
    styles.containerBase,
    // TEMP FIX: check !isLastElement as hasNextItemCategory is true if last item is null category (make Unknown cat?)
    !isLastElement && hasNextItemCategory ? styles.containerHasNext : null,
  ];

  // const container = styles.containerBase;

  const itemTextStyle = [
    styles.itemTextBase,
    item.isChecked ? styles.itemTextChecked : null,
  ];

  const categoryStyle = [
    styles.categoryColorRectangleBase,
    hasPrevItemCategory && styles.categoryColorRectangleHasPrev,
    hasNextItemCategory && styles.categoryColorRectangleHasNext,
    isFirstItem && styles.categoryColorRectangleIsFirst,
  ];

  const renderSwipeToDelete = (
    progressAnimatedValue: Animated.AnimatedInterpolation,
    dragAnimatedValue: Animated.AnimatedInterpolation
  ) => {
    return (
      <View style={styles.swipedRow}>
        <Animated.View>
          <TouchableOpacity onPress={() => onRemoveItem(item)}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={(ref) => ref && swipableRowRef(ref)}
        renderRightActions={renderSwipeToDelete}
        onSwipeableWillOpen={() => onSwipeToDeletedStarted(index)}
        // leftThreshold={80}
      >
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
              <QuantityButtons
                onPress={onPressCounter}
                id={item.id}
                isDecrementButtonEnabled={item.quantity > 1} // XXX: Business logik. State med canDecrement
              ></QuantityButtons>
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
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingLeft: 8,
    borderColor: "transparent",

    // borderBottomWidth: 0,
    // backgroundColor: "lightgrey",
    // justifyContent: "center",
    // alignItems: "center",
  },
  // Add bottom border to item if has another item below.
  containerHasNext: {
    borderBottomColor: "#d5d8e3",
    // borderBottomColor: "red",
    borderBottomWidth: 1,
  },
  // containerFirst: {
  //   borderWidth: 0,
  // },
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
    // backgroundColor: "red",
    // borderRadius: 20,
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
    // fontFamily: "sans-serif-medium",
  },

  categoryColorRectangleBase: {
    marginLeft: 30,
    // borderTopRightRadius: 8,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
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
  categoryColorRectangleIsFirst: {
    marginTop: 0,
  },
});
