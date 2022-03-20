import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../types";

import { View, Text, TouchableOpacity } from "react-native";

type Props = BottomTabScreenProps<RootStackParamList, "CategoryLibraryScreen">;

export default function ListLibraryScreen({ route, navigation }: Props) {
  return (
    <View
      style={{
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "red",
        borderColor: "blue",
        borderWidth: 3,
      }}
    >
      <Text style={{ fontSize: 50 }}>List library</Text>
    </View>
  );
}
