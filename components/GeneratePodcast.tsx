import { GeneratePodcastProps } from "@/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

const useGeneratePodcast = ({
    voiceType,
    setAudio,
    audio,
    setAudioStorageId,
    setVoicePrompt,
    setAudioDuration,
    voicePrompt
  }: GeneratePodcastProps) => {
  // Logic for generating podcast
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePodcast = () => {
    setIsGenerating(true);
    // Call API to generate podcast
    setAudio("");
  };

  if(!voicePrompt) {
    // todos: show error message
    return setIsGenerating(false);
  }

  try {
    // const response = await getPodcastAudio({
    //   voice: voiceType,
    //   input: voicePrompt,
    // });
  
  } catch (error) {
    console.log("Error generating podcast", error);
    // todos: show error message
    setIsGenerating(false);
  }

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

const getPodcastAudio = useAction(api.openai.generateAudioAction);

  // const { isGenerating, generatePodcast } = useGeneratePodcast({
  //   voiceType,
  //   setAudio,
  //   audio,
  //   setAudioStorageId,
  //   setVoicePrompt,
  //   setAudioDuration,
  //   voicePrompt: "",
  // });

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
