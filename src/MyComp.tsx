import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

interface Props {
  input: number;
}

export default function MyComponent({ input }: Props) {
  if (input === 1) {
    console.log("object");
    console.log("object");
    console.log("object");
  }

  console.log("object");

  const renderSwipeToDelete = (
    progressAnimatedValue: Animated.AnimatedInterpolation,
    dragAnimatedValue: Animated.AnimatedInterpolation
  ) => {
    return (
      <View style={styles.swipedRow}>
        <Animated.View>
          <TouchableOpacity onPress={() => console.log("Delete")}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderSwipeToDelete}>
        <View style={styles.row}>
          <Text>Hej</Text>
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
  row: {
    backgroundColor: "lightgrey",
    height: 100,
    width: 200,
  },

  swipedConfirmationContainer: {},
  deleteConfirmationText: {},
  deleteButtonText: {},
  deleteButton: {
    backgroundColor: "red",
  },
  removeButtonText: {
    color: "white",
    padding: 10,
    fontSize: 15,
  },
});
