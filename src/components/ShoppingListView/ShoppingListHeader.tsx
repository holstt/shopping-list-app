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
import Colors from "../../config/colors";
import { ActionKind } from "../../state/reducers/shoppingListsReducer";
import { useShoppingListsContext } from "../../state/ShoppingListsContext";
import UpDownButton from "./UpDownButton";

// interface Props {
//   onPress: (id: string, countType: CountType) => void;
//   id: string;
// }

export default function ShoppingListHeader() {
  const { state, dispatch } = useShoppingListsContext();

  // XXX: Selectors???
  const currentList = state.allLists[state.currentListIndex];
  const hasPrevList = state.currentListIndex - 1 >= 0;
  const hasNextList = state.currentListIndex + 1 <= state.allLists.length - 1;

  return (
    <View style={styles.listHeaderContainer}>
      <View style={styles.listNameContainer}>
        <Text numberOfLines={1} style={styles.listHeaderText}>
          <Text style={{ fontFamily: "sans-serif-medium" }}>
            {currentList.title}
          </Text>
          <Text>{` (${currentList.items.length})`}</Text>
        </Text>
      </View>
      <UpDownButton
        onButtonUp={() =>
          dispatch({ type: ActionKind.GO_TO_PREV_LIST, payload: {} })
        }
        onButtonDown={() =>
          dispatch({ type: ActionKind.GO_TO_NEXT_LIST, payload: {} })
        }
        isUpButtonEnabled={hasPrevList}
        isDownButtonEnabled={hasNextList}
      ></UpDownButton>
    </View>
  );
}

const styles = StyleSheet.create({
  listHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  listNameContainer: {
    flex: 4,
    marginRight: 10,
  },
  listHeaderText: {
    backgroundColor: "#005AB2",
    borderRadius: 30,
    // borderWidth: 1,
    // borderColor: "#4797E9",
    padding: 10,
    paddingLeft: 15,
    color: "white",
    fontSize: 24,
  },
});
