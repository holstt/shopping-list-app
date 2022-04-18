import React, { createContext, useState, ReactNode, useContext } from "react";
import LibraryItem from "../models/LibraryItem";
import { RootStackParamList } from "../RootNavigator";

// XXX: Bedste måde at dele shared navigation button??

// The press event of plus button in navigation bar needs to be shared across all screens --> global state.
// State changes when
interface NavigationState {
  addItemEventFiredOnScreen: keyof RootStackParamList | null; // Accept only strings from screen name strings.
  setaddItemEventFiredOnScreen: (
    screenName: keyof RootStackParamList | null
  ) => void;
  acknowledgeAddItemEvent: () => void;
}

// Give initial empty values to avoid not null. // XXX: Fix senere med library
export const NavigationContext = createContext<NavigationState | null>(null);

export function useNavigationContext() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error(
      "Component was not wrapped in the required context provider: NavigationContext"
    );
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

// PROVIDER
export default function NavigationContextProvider({ children }: Props) {
  const [addItemEventFiredOnScreen, setaddItemEventFiredOnScreen] = useState<
    keyof RootStackParamList | null
  >(null);

  // A way for consumer to acknowledge that the add item event has been handled.
  const acknowledgeAddItemEvent = () => setaddItemEventFiredOnScreen(null);

  return (
    <NavigationContext.Provider
      value={{
        addItemEventFiredOnScreen,
        setaddItemEventFiredOnScreen,
        acknowledgeAddItemEvent,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
