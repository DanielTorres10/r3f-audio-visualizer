import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

export interface FileUploadConfig {
  file: File | null;
}

export const FileUploadContext = createContext<{
  config: FileUploadConfig;
  setFile: Dispatch<SetStateAction<File | null>>;
} | null>(null);

export const FileUploadContextProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <FileUploadContext.Provider value={{ config: { file }, setFile }}>
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUploadContext = () => {
  const ctx = useContext(FileUploadContext);
  if (!ctx) {
    throw new Error("useFileUploadContext must be used within FileUploadContextProvider");
  }
  return ctx;
};
