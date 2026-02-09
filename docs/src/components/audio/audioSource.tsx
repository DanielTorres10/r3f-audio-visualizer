import { AUDIO_SOURCE } from "@/components/audio/sourceControls/common";
import FileAudioPlayer from "@/components/audio/sourceControls/file";
import { CurrentTrackPlayer } from "@/components/controls/audioSource/soundcloud/player";
import { FileUploadControls } from "@/components/controls/audioSource/fileUpload";

export const ControlledAudioSource = ({
  audio,
  audioSource,
}: {
  audio: HTMLAudioElement;
  audioSource: "SOUNDCLOUD" | "FILE_UPLOAD";
}) => {
  console.log("[ControlledAudioSource] Rendering with audioSource:", audioSource, "audio:", !!audio);
  
  switch (audioSource) {
    case AUDIO_SOURCE.SOUNDCLOUD:
      return <CurrentTrackPlayer audio={audio} />;
    case AUDIO_SOURCE.FILE_UPLOAD:
      return (
        <>
          <FileAudioPlayer audio={audio} />
          <FileUploadControls />
        </>
      );
    default:
      return audioSource satisfies never;
  }
};
export default ControlledAudioSource;
