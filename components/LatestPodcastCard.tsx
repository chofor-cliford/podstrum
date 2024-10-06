"use client";
import { formatLatestTime } from "@/lib/formatTime";
import { LatestPodcastCardProps } from "@/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useToast } from "./hooks/use-toast";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

const LatestPodcastCard = ({
  podcastId,
  audioUrl,
  author,
  duration,
  imgUrl,
  index,
  title,
  imageStorageId,
  audioStorageId,
  isOwner,
  views,
  creationTime,
  isPlaying,
  onTogglePlay,
}: LatestPodcastCardProps) => {
  const convertedTime = formatLatestTime(creationTime);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMouseHovered, setIsMouseHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePodcast = useMutation(api.podcasts.deletePodcast);
  const router = useRouter();
  const { toast } = useToast();


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true; // Set the loop property to true (this can be kept or moved)
    }
  }, []); // This effect runs only once when the component mounts

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset the audio to the start
      }
    }
  }, [isPlaying]); // This effect runs when isPlaying changes

  // Handle podcast deletion
  const handleDelete = async () => {
    try {
      if (imageStorageId && audioStorageId) {
        await deletePodcast({ podcastId, imageStorageId, audioStorageId });
      } else {
        toast({ title: "Error: Invalid storage IDs", variant: "destructive" });
      }
      toast({ title: "Podcast deleted" });
      router.push("/");
    } catch (error) {
      toast({ title: "Error deleting podcast", variant: "destructive" });
    }
  };

  return (
    <div className="flex h-[54px] border-b border-b-black-6 w-full">
      <audio ref={audioRef} src={audioUrl} className="hidden" loop />
      <div
        className="flex gap-8 md:justify-between items-center w-full mb-2 cursor-pointer"
        onClick={() => onTogglePlay(podcastId)}
        onMouseEnter={() => setIsMouseHovered(true)}
        onMouseLeave={() => setIsMouseHovered(false)}
      >
        <div className="flex gap-4 items-center">
          {isMouseHovered ? (
            <Image
              src={isPlaying ? "/icons/Pause.svg" : "/icons/play-circle.svg"}
              width={24}
              height={24}
              alt={isPlaying ? "Pause" : "Play"}
            />
          ) : (
            <span
              className={`text-white-1 text-16 font-bold pl-2 ${isPlaying && "animate-text-gradient"}`}
            >
              {index}
            </span>
          )}
          <Image
            src={imgUrl}
            alt="latest podcast"
            width={51}
            height={54}
            className="rounded"
          />
          <h3
            className={`text-white-1 hidden md:block text-16 font-bold ${isPlaying ? "animate-motion" : ""}`}
          >
            {author}
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
            <span
              className={`text-white-1 text-16 font-bold  ${isPlaying && "animate-text-gradient"}`}
            >
              {views + Math.floor(Math.random() * 100)}
            </span>
          </div>

          <div className="flex gap-3">
            <Image src="/icons/watch.svg" alt="watch" width={24} height={24} />
            <span
              className={`text-white-1 text-16 font-bold  ${isPlaying && "animate-text-gradient"}`}
            >
              {convertedTime}
            </span>
          </div>

          {isOwner && (
            <div className="relative mt-2">
              <Image
                src="/icons/three-dots.svg"
                width={24}
                height={24}
                alt="Three dots icon"
                className="cursor-pointer"
                onClick={() => setIsDeleting((prev) => !prev)}
              />
              {isDeleting && (
                <div
                  className="absolute -left-32 -top-2 z-10 flex w-32 cursor-pointer justify-center gap-2 rounded-md bg-black-6 py-1.5 hover:bg-black-2"
                  onClick={handleDelete}
                >
                  <Image
                    src="/icons/delete.svg"
                    width={16}
                    height={16}
                    alt="Delete icon"
                  />
                  <h2 className="text-16 font-normal text-white-1">Delete</h2>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestPodcastCard;
