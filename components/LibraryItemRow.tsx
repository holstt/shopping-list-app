import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";

import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import LibraryItem from "../models/LibraryItem";

import React, { useRef } from "react";
// import ItemList from "../models/ItemList";

interface Props {
  onDeleteButtonPress: (item: LibraryItem) => void;
  onItemPress: (item: LibraryItem) => void;
  item: LibraryItem;
  isLastElement?: boolean;
}
// XXX: Lav generic component for  denne og ItemRow?

export default function ListRow({
  onDeleteButtonPress,
  onItemPress,
  item,
  isLastElement,
}: Props) {
  const swipableRowRef = useRef<Swipeable | null>(null);

  // console.log(item.category);

  // Resolve styles
  const container = [
    styles.containerBase,
    isLastElement ? styles.containerLast : null,
  ];

  // XXX: Ansvar?
  const confirmDelete = (itemToDelete: LibraryItem) => {
    return Alert.alert(
      `Are you sure you want to delete the item '${itemToDelete.title}' permanently?`,
      "",
      [
        {
          text: "Yes",
          onPress: () => {
            onDeleteButtonPress(itemToDelete);
          },
        },
        { text: "No", onPress: () => swipableRowRef.current?.close() },
      ]
    );
  };

  const renderSwipeToDelete = (
    progressAnimatedValue: Animated.AnimatedInterpolation,
    dragAnimatedValue: Animated.AnimatedInterpolation
  ) => {
    return (
      <View style={styles.swipedRow}>
        <Animated.View>
          <TouchableOpacity onPress={() => confirmDelete(item)}>
            <Text style={styles.removeButtonText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={(ref) => (swipableRowRef.current = ref)}
        renderRightActions={renderSwipeToDelete}
      >
        <View style={container}>
          <TouchableOpacity
            style={styles.itemTextButton}
            onPress={() => onItemPress(item)}
          >
            <Text style={styles.itemTitleBase}>{item.title}</Text>
            <View
              style={[
                styles.categoryColorRectangle,
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
  itemTitleBase: {
    // backgroundColor: "red",
    color: "#454a52",
    fontSize: 20,
  },
  itemTextButton: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
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
  categoryColorRectangle: {
    marginLeft: "auto",
    // backgroundColor: "red",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 13,
  },
});
