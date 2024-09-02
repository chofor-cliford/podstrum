import { GeneratePodcastProps } from "@/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import { v4 as uuidv4 } from "uuid";

import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "@/components/hooks/use-toast";

const useGeneratePodcast = ({
  voiceType,
  setAudio,
  audio,
  setAudioStorageId,
  setVoicePrompt,
  setAudioDuration,
  voicePrompt,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getAudioUrl = useMutation(api.podcasts.getUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const { toast } = useToast();

  const generatePodcast = async () => {
    setIsGenerating(true);
    // Call API to generate podcast
    setAudio("");

    if (!voicePrompt) {
      toast({
        title: "Please enter a prompt to generate podcast",
      });
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt,
      });

      const audioBlob = new Blob([response], { type: "audio/mp3" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([audioBlob], fileName, { type: "audio/mp3" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);
      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl ?? "");
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      console.log("Error generating podcast", error);
      toast({
        title: "Error creating a podcast",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = ({
  setAudio,
  setAudioStorageId,
  setAudioDuration,
  setVoicePrompt,
  audio,
  voiceType,
  voicePrompt,
}: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast({
    voiceType,
    setAudio,
    audio,
    setAudioStorageId,
    setVoicePrompt,
    setAudioDuration,
    voicePrompt,
  });

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          placeholder="Type your prompt here"
          className="input-class font-light focus-visible:ring-offset-red-1"
          rows={5}
          value={voicePrompt}
          onChange={(e) => setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          className="text-16 bg-red-gradient py-4 font-bold text-white-1 transition-all duration-500"
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {audio && (
        <audio
          controls
          src={audio}
          autoPlay
          onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
          className="mt-5"
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
