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
import ItemList from "../models/ItemList";

interface Props {
  onDeleteButtonPress: (listId: string) => void;
  onListPress: (list: ItemList) => void;
  list: ItemList;
  isLastElement?: boolean;
}
// XXX: Lav generic component for  denne og ItemRow?
// XXX: Rename til item. List tvetydigt

export default function ListRow({
  onDeleteButtonPress,
  onListPress,
  list,
  isLastElement,
}: Props) {
  // Resolve styles
  const container = [
    styles.containerBase,
    isLastElement ? styles.containerLast : null,
  ];

  const renderSwipeToDelete = (
    progressAnimatedValue: Animated.AnimatedInterpolation,
    dragAnimatedValue: Animated.AnimatedInterpolation
  ) => {
    return (
      <View style={styles.swipedRow}>
        <Animated.View>
          <TouchableOpacity onPress={() => onDeleteButtonPress(list.id)}>
            <Text style={styles.removeButtonText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderSwipeToDelete}>
        <View style={container}>
          <TouchableOpacity
            style={styles.listTextButton}
            onPress={() => onListPress(list)}
          >
            <Text style={styles.listTitleBase}>{list.title}</Text>
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
  listTitleBase: {
    // backgroundColor: "red",
    color: "#454a52",
    fontSize: 20,
  },
  listTextButton: {
    flex: 1,
  },
  swipedRow: {
    backgroundColor: "#FF0000",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "white",
    padding: 10,
    fontSize: 15,
  },

  // Add a bottom border to the last item in the list
  containerLast: {
    borderBottomColor: "#d5d8e3",
  },
});
