import React, { useState } from "react";

interface ISettingContext {
  viewingStaffId?: number | null;
  minutesPerRow?: number;
  rowHeightInPx?: number;
  columnWidthInPx?: number;
  daysToShow?: number;
  setSetting?: React.Dispatch<React.SetStateAction<ISettingContext>>;
}

const defaultSetting: ISettingContext = {
  viewingStaffId: null,
  daysToShow: 7,
  // minutesPerRow: 15,
  // rowHeightInPx: 40,
  minutesPerRow: 1,
  rowHeightInPx: 20,
  columnWidthInPx: 240,
  setSetting: () => {
    throw Error("NOT_IMPLEMENTED");
  },
};

const SettingContext = React.createContext<ISettingContext>(defaultSetting);

export const SettingContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [state, setSettingState] = useState<ISettingContext>(defaultSetting);

  return (
    <SettingContext.Provider value={{ ...state, setSetting: setSettingState }}>
      {children}
    </SettingContext.Provider>
  );
};

export const useGlobalSetting = () => React.useContext(SettingContext);
