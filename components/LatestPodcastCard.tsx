import { formatLatestTime } from "@/lib/formatTime";
import { LatestPodcastCardProps } from "@/types";
import Image from "next/image";

const LatestPodcastCard = ({
  podcastId,
  audioUrl,
  author,
  duration,
  imgUrl,
  index,
  title,
  views,
  creationTime,
}: LatestPodcastCardProps) => {
  const convertedTime = formatLatestTime(creationTime);

  return (
    <div className="flex h-[54px] border-b border-b-black-6 w-full">
      <div className="flex justify-between items-center w-full mb-2">
        <div className="flex gap-4 items-center">
          <span className="text-white-1 text-16 font-bold pl-2">{index}</span>
          <Image
            src={imgUrl}
            alt="latest podcast"
            width={51}
            height={54}
            className="rounded"
          />
          <h3 className="text-16 font-bold text-white-1">
            {title.slice(0, 49)}
          </h3>
        </div>

        <div className="flex gap-8 flex-end">
          <div className="flex gap-3">
            <Image
              src="/icons/headphone.svg"
              alt="headphone"
              width={24}
              height={24}
            />
            <span className="text-white-1 text-16 font-bold">{views + Math.floor(Math.random() * 100)}</span>
          </div>

          <div className="flex gap-3">
            <Image src="/icons/watch.svg" alt="watch" width={24} height={24} />
            <span className="text-white-1 text-16 font-bold">
              {convertedTime}
            </span>
          </div>

          <Image
            src="/icons/three-dots.svg"
            alt="three dots"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default LatestPodcastCard;
