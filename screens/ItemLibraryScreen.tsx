import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import Item from "../models/Item";
import { RootStackParamList } from "../types";

type Props = BottomTabScreenProps<RootStackParamList, "ItemLibraryScreen">;

export default function ItemLibraryScreen({ navigation, route }: Props) {
  return <View></View>;
}

const styles = StyleSheet.create({
  container: {},
});
