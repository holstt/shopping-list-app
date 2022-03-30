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

import React, { useRef } from "react";
import ShoppingList from "../../models/ShoppingList";

interface Props {
  onDeleteButtonPress: (list: ShoppingList) => void;
  onListPress: (list: ShoppingList) => void;
  list: ShoppingList;
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
  const swipableRowRef = useRef<Swipeable | null>(null);

  // Resolve styles
  const container = [
    styles.containerBase,
    isLastElement ? styles.containerLast : null,
  ];

  const confirmDelete = (listToDelete: ShoppingList) => {
    return Alert.alert(
      `Are you sure you want to delete the list '${listToDelete.title}' permanently?`,
      "",
      [
        {
          text: "Yes",
          onPress: () => {
            onDeleteButtonPress(listToDelete);
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
          <TouchableOpacity onPress={() => confirmDelete(list)}>
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
