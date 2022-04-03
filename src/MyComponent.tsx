import { StyleSheet, View, Text } from "react-native";

interface Props {
  input: string;
}

export default function MyComponent({ input }: Props) {
  return (
    <View>
      <Text>input</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
