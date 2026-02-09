import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

export interface ValentineAudioConfig {
  audioUrl: string | null;
}

export const ValentineAudioContext = createContext<{
  config: ValentineAudioConfig;
  setAudioUrl: Dispatch<SetStateAction<string | null>>;
} | null>(null);

export const ValentineAudioContextProvider = ({ children }: { children: ReactNode }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  return (
    <ValentineAudioContext.Provider value={{ config: { audioUrl }, setAudioUrl }}>
      {children}
    </ValentineAudioContext.Provider>
  );
};

export const useValentineAudioContext = () => {
  const ctx = useContext(ValentineAudioContext);
  if (!ctx) {
    throw new Error("useValentineAudioContext must be used within ValentineAudioContextProvider");
  }
  return ctx;
};
