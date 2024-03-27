"use client";
import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  playerNames: string[];
  setPlayerNames: (names: string[]) => void;
  formSubmitted: boolean;
  setFormSubmitted: (submitted: boolean) => void;
  positionSelected: boolean;
  setPositionSelected: (selected: boolean) => void;
}

const defaultValue: AppContextType = {
  playerNames: [],
  setPlayerNames: () => {},
  formSubmitted: false,
  setFormSubmitted: () => {},
  positionSelected: false,
  setPositionSelected: () => {},
};

const AppContext = createContext<AppContextType>(defaultValue);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [positionSelected, setPositionSelected] = useState<boolean>(false);

  const value = {
    playerNames,
    setPlayerNames,
    formSubmitted,
    setFormSubmitted,
    positionSelected,
    setPositionSelected,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
