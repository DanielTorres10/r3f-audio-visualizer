import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useFileUploadContext } from "@/context/fileUpload";

export const FileUploadControls = () => {
  console.log("[FileUploadControls] Rendering");
  const { setFile } = useFileUploadContext();

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        console.log("[FileUpload] No file selected");
        return;
      }

      // Store file in context - FileAudioPlayer will handle the rest
      console.log("[FileUpload] Setting file:", file.name);
      setFile(file);
      console.log("[FileUpload] File set in context");
    },
    [setFile]
  );

  return (
    <Input
      id="fileUpload"
      type="file"
      accept="audio/*"
      className="w-64 text-foreground"
      onChange={handleFileSelect}
    />
  );
};
