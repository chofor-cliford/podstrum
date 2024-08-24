import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const GenerateThumbnail = () => {
  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          placeholder="Type your prompt here"
          className="input-class font-light focus-visible:ring-red-1"
        />
      </div>
    </div>
  );
};

export default GenerateThumbnail;
