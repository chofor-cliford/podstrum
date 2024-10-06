"use client";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { PodcastDetailPlayerProps } from "@/types";
import LoaderSpinner from "./LoaderSpinner";
import { useToast } from "./hooks/use-toast";
import { formatTime } from "@/lib/formatTime";

const PodcastDetailPlayer = ({
  audioUrl,
  podcastTitle,
  author,
  imageUrl,
  podcastId,
  imageStorageId,
  audioStorageId,
  isOwner,
  authorImageUrl,
  authorId,
  duration,
}: PodcastDetailPlayerProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePodcast = useMutation(api.podcasts.deletePodcast);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [isDragging, setIsDragging] = useState(false);

  // Play/Pause toggle handler
  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef?.current?.pause();
      setIsPlaying(false);
    }
  };

  // Forward the audio by 5 seconds
  const forward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 5,
        totalDuration
      );
    }
  };

  // Rewind the audio by 5 seconds
  const rewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 5,
        0
      );
    }
  };

  // Update the ball and audio time during drag
  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;

    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newTime = (clickPosition / progressBar.offsetWidth) * totalDuration;

    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  // Enable dragging
  const startDrag = () => {
    setIsDragging(true);
  };

  // End dragging
  const stopDrag = () => {
    setIsDragging(false);
  };

  // Update the current time when dragging
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true; // Enable looping by default

    const updateTime = () => {
      if (!isDragging) setCurrentTime(audio.currentTime);
    };

    const setAudioMetadata = () => {
      setTotalDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioMetadata);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioMetadata);
    };
  }, [isDragging]);

  // Calculate ball position relative to progress
  const ballPosition = (currentTime / totalDuration) * 100;

  // Handle podcast deletion
  const handleDelete = async () => {
    try {
      await deletePodcast({ podcastId, imageStorageId, audioStorageId });
      toast({ title: "Podcast deleted" });
      router.push("/");
    } catch (error) {
      toast({ title: "Error deleting podcast", variant: "destructive" });
    }
  };

  if (!imageUrl || !authorImageUrl) return <LoaderSpinner />;

  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <Image
          src={imageUrl}
          width={250}
          height={250}
          alt="Podcast image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <article className="flex flex-col gap-2 max-md:items-center">
            <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
              {podcastTitle}
            </h1>
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={() => router.push(`/profile/${authorId}`)}
            >
              <Image
                src={authorImageUrl}
                width={30}
                height={30}
                alt="Caster icon"
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-16 font-normal text-white-3">{author}</h2>
            </figure>
          </article>

          <div className="flex flex-col gap-4">
            <div className="flex-start flex cursor-pointer gap-3 md:gap-6">
              <div className="flex items-center gap-1.5">
                <Image
                  src={"/icons/reverse.svg"}
                  width={24}
                  height={24}
                  alt="rewind"
                  onClick={rewind}
                />
                <h2 className="text-12 font-bold text-white-4">-5</h2>
              </div>
              <Image
                src={isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
                width={30}
                height={30}
                alt="play"
                onClick={togglePlayPause}
              />
              <div className="flex items-center gap-1.5">
                <h2 className="text-12 font-bold text-white-4">+5</h2>
                <Image
                  src={"/icons/forward.svg"}
                  width={24}
                  height={24}
                  alt="forward"
                  onClick={forward}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-16 font-normal text-white-2 max-md:hidden">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </h2>

              <div
                ref={progressBarRef}
                className="relative w-full h-3 bg-gray-300 rounded-full"
                onClick={handleProgressDrag}
                onMouseDown={startDrag}
                onMouseMove={(e) => isDragging && handleProgressDrag(e)}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
              >
                <div
                  className="absolute top-0 h-3 bg-red-1 rounded-full"
                  style={{ width: `${ballPosition}%` }}
                />
                <div
                  className="absolute top-[-0px] h-6 w-6 rounded-full bg-gray-300 border-2 border-gray-400 transform -translate-y-2 cursor-pointer"
                  style={{ left: `${ballPosition}%` }}
                  onMouseDown={startDrag}
                />
                <audio ref={audioRef} src={audioUrl} className="hidden" />
              </div>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="relative mt-2">
            <Image
              src="/icons/three-dots.svg"
              width={24}
              height={30}
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
  );
};

export default PodcastDetailPlayer;
