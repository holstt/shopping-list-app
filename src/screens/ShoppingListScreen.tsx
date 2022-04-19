import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import ShoppingItemRow from "../components/ShoppingListView/ShoppingItemRow";
import ShoppingItem, { itemComparer } from "../models/ShoppingItem";
import { useRef } from "react";
import colors from "../config/colors";
import Category from "../models/Category";
import Constants from "expo-constants";
import { useShoppingListsContext } from "../state/ShoppingListsContext";
import { RootStackParamList } from "../RootNavigator";
import ShoppingListInput from "../components/ShoppingListView/ShoppingListInput";
import ShoppingList from "../models/ShoppingList";
import ShoppingListHeader from "../components/ShoppingListView/ShoppingListHeader";
import BackgroundCircle from "../components/ShoppingListView/BackgroundCircle";
import { Swipeable } from "react-native-gesture-handler";
import {
  InputMode,
  useShoppingListUIContext,
} from "../state/ShoppingListUIContext";
import { CountType } from "../components/ShoppingListView/QuantityButtons";

type Props = BottomTabScreenProps<RootStackParamList, "ShoppingListScreen">;

export default function ShoppingListScreen({ navigation, route }: Props) {
  console.log("ShoppingListScreen: Rendering");

  // Shared state
  const { state, dispatch } = useShoppingListsContext();
  const { state: stateUi, dispatch: dispatchUi } = useShoppingListUIContext();
  const tabBarHeight = useBottomTabBarHeight();

  // Local state
  const swipableRows = useRef<Swipeable[]>([]); // XXX: Evt. dict i stedet
  const prevOpenedSwipableRow = useRef<Swipeable | null>(null);

  // XXX: Selector
  const currentList = state.allLists[state.currentListIndex];

  // Create list if no lists in app state.
  if (!currentList) {
    console.log("No current list");
    const firstList = new ShoppingList("My First List", [], 0);
    // Add list to global store and wait for rerender with new state.
    dispatch({ type: "LIST_ADDED", list: firstList });
    return null;
  }

  // Handle modifications to current items such that they fit the constraints of this view.
  const resolveItems = (inputItems: ShoppingItem[]) => {
    // Resolve items.
    let items: ShoppingItem[];

    // Item should be hidden from list if it is being edited.
    if (stateUi.inputMode) {
      items = inputItems.filter((item) => item.id !== stateUi.editItem?.id);
    } else {
      items = inputItems;
    }

    items.sort(itemComparer);
    return splitItems(items);
  };

  // Renders a single shopping item.
  const renderItems = (fromItems: ShoppingItem[]) => {
    let currentCategory: Category | null = fromItems[0]?.category;
    const gapComponent = <View style={styles.gapColorFillDefault}></View>;

    // XXX: Flyttes ud.
    const closePrevOpenSwipable = (index: number) => {
      if (
        prevOpenedSwipableRow.current &&
        prevOpenedSwipableRow.current !== swipableRows.current[index]
      ) {
        prevOpenedSwipableRow.current.close();
      }
      prevOpenedSwipableRow.current = swipableRows.current[index];
    };

    // Convert count type to number.
    const onPressQuantity = (id: string, countType: CountType) => {
      let result = 0;

      switch (countType) {
        case CountType.INCREMENT:
          result = 1;
          break;
        case CountType.DECREMENT:
          result = -1;
          break;
      }

      dispatch({ type: "ITEM_QUANTITY_CHANGED", id, changedBy: result });
    };

    // Check if category has changed since last element.
    const isNewCat = (cat: Category | null) => {
      if (currentCategory?.id === cat?.id) {
        return false;
      }
      currentCategory = cat;
      return true;
    };

    // XXX: I context
    return fromItems.map((item, index) => {
      // Insert gap to seperate different categories.
      return (
        <View key={item.id}>
          {isNewCat(item.category) && gapComponent}
          <ShoppingItemRow
            index={index}
            onSwipeToDeletedStarted={closePrevOpenSwipable}
            swipableRowRef={(ref) => (swipableRows.current[index] = ref)}
            key={item.id}
            item={item}
            isLastElement={index === fromItems.length - 1}
            // If not none, then input will be part of list on top
            isFirstItem={index === 0 && stateUi.inputMode === InputMode.NONE}
            onCheckButtonPress={(item) =>
              dispatch({
                type: "ITEM_CHECKED_TOGGLED",
                id: item.id,
              })
            }
            onItemPress={(item) =>
              dispatchUi({ type: "EDIT_ITEM_STARTED", item })
            }
            onRemoveItem={(item) =>
              dispatch({
                type: "ITEM_REMOVED",
                itemId: item.id,
              })
            }
            onPressQuantity={onPressQuantity}
            hasPrevItemCategory={
              fromItems[index - 1]?.category?.title === item.category?.title
            }
            hasNextItemCategory={
              fromItems[index + 1]?.category?.title === item.category?.title
            }
          ></ShoppingItemRow>
        </View>
      );
    });
  };

  const { unchecked, checked } = resolveItems(currentList.items);
  const itemListUncheckedComponent = renderItems(unchecked);
  const itemListCheckedComponent = renderItems(checked);

  // XXX: Skal i component
  const itemListComponent = (
    <View>
      {itemListUncheckedComponent}
      {itemListCheckedComponent.length !== 0 && (
        <View>
          <Text style={styles.doneHeader}>Done</Text>
          {itemListCheckedComponent}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <ShoppingListHeader></ShoppingListHeader>
      </View>
      <View
        style={[styles.itemListContainer, { marginBottom: tabBarHeight + 78 }]}
      >
        {stateUi.inputMode !== InputMode.NONE && (
          <ShoppingListInput
            currentIndex={currentList.items.length - 1}
          ></ShoppingListInput>
        )}
        {stateUi.inputMode !== InputMode.NONE && ( // XXX: Lav view og slå sammen med ovenstående
          <View style={[styles.gapColorFillDefault, { height: 6 }]}></View>
        )}
        <ScrollView>{itemListComponent}</ScrollView>
      </View>
      {stateUi.inputMode === InputMode.NONE && (
        <BackgroundCircle></BackgroundCircle>
      )}
    </View>
  );

  // Reorder items. Put checked items at bottom
  function splitItems(itemsToSplit: ShoppingItem[]) {
    const unchecked = itemsToSplit.filter((item) => !item.isChecked);
    const checked = itemsToSplit.filter((item) => item.isChecked);
    return { unchecked, checked };
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",

    // TODO: Flyt til global container.
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: colors.backgroundBlue,

    // backgroundColor: "transparent",
    // backgroundColor: colors.blue,
    // borderRadius: 20,
  },
  gapColorFillDefault: {
    backgroundColor: colors.backgroundBlue,
    height: 6,
  },
  topContainer: {
    // marginBottom: 15,
    marginBottom: 15,
  },
  itemListContainer: {
    // height: "80%",
    // flex: 1, // Uncomment to fill view
    overflow: "hidden",
    borderRadius: 15,
    // marginBottom: 300,
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    // backgroundColor: "white",
    // backgroundColor: "blue",

    // Shadow
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.5,
    // elevation: 10,
  },

  listHeaderContainer: {
    flexDirection: "row",

    // marginLeft: 5,
    // marginBottom: 10,
    // padding: 5,
    // marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  listNameContainer: {
    // backgroundColor: "blue",
    // flexDirection: "row",
    flex: 4,
    marginRight: 10,
    // alignItems: "center",
  },
  listHeaderText: {
    backgroundColor: "#005AB2",
    borderRadius: 30,
    // borderWidth: 1,
    // borderColor: "#4797E9",
    padding: 10,
    paddingLeft: 15,
    color: "white",
    // fontFamily: "sans-serif",
    // fontFamily: "sans-serif-medium",
    fontSize: 24,
  },
  inputContainer: {
    flexDirection: "row",
  },

  doneHeader: {
    color: colors.lightGrey,
    textAlign: "left",
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 2,
  },
  categoryColorRectangle: {
    // backgroundColor: "blue",
    marginLeft: "auto",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 13,
    marginTop: 7,
    marginBottom: 7,
  },
});
