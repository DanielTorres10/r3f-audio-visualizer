import { StrictMode } from "react";
import App from "@/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

import "@/style/globals.css";

import { ThemeProvider } from "@/context/theme";
import { FileUploadContextProvider } from "@/context/fileUpload";
import { SoundcloudContextProvider } from "./context/soundcloud";
import { ValentineAudioContextProvider } from "@/context/valentineAudio";

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <FileUploadContextProvider>
          <SoundcloudContextProvider>
            <ValentineAudioContextProvider>
              <App />
            </ValentineAudioContextProvider>
          </SoundcloudContextProvider>
        </FileUploadContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
