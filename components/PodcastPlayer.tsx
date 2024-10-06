"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";

import { Progress } from "./ui/progress";
import { formatTime } from "@/lib/formatTime";

const PodcastPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const { audio, shuffleAudioList, setAudio, audioList } = useAudio();

  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !audioRef.current.loop;
      setIsLooping((prev) => !prev);
    }
  };

  const forward = () => {
    if (
      audioRef.current &&
      audioRef.current.currentTime + 5 < audioRef.current.duration
    ) {
      audioRef.current.currentTime += 5;
    }
  };

  const rewind = () => {
    if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
      audioRef.current.currentTime -= 5;
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleShuffle = () => {
    if (shuffleAudioList) {
      shuffleAudioList();
      setIsShuffled((prev) => !prev);
    }
  };

  // Click on progress bar to seek
  const handleProgressClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressWidth = progressBar.offsetWidth;
    const clickRatio = clickPosition / progressWidth;
    const newTime = clickRatio * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateCurrentTime);
      return () => {
        audioElement.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audio?.audioUrl) {
      if (audioElement) {
        audioElement.play().then(() => {
          setIsPlaying(true);
        });
      }
    } else {
      audioElement?.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration); // Set the total duration once metadata is loaded
    }
  };

const handleAudioEnded = () => {
  
  setIsPlaying(false);
  console.log("Audio ended, moving to the next audio");

  if (isShuffled) {
    const randomIndex = Math.floor(Math.random() * audioList.length);
    setAudio({ ...audioList[randomIndex] });
    console.log(`Shuffled to audio: ${audioList[randomIndex].title}`);
  } else {
    const currentIndex = audio
      ? audioList.findIndex((a) => a.audioUrl === audio.audioUrl)
      : -1;

    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % audioList.length;
      setAudio({ ...audioList[nextIndex] });
      console.log(`Moved to next audio: ${audioList[nextIndex].title}`);
    } else {
      console.error("Current audio not found in the audio list.");
    }
  }
};

  return (
    <div
      className={cn("sticky bottom-0 left-0 flex size-full flex-col", {
        hidden: !audio?.audioUrl || audio?.audioUrl === "",
      })}
    >
      <div onClick={handleProgressClick}>
        <Progress
          value={(currentTime / duration) * 100}
          className="w-full"
          max={duration}
        />
      </div>
      <section className="glassmorphism-black flex h-[112px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12">
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className="hidden"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
        <div className="flex items-center gap-4 max-md:hidden">
          <Link href={`/podcast/${audio?.podcastId}`}>
            <Image
              src={audio?.imageUrl! || "/images/player1.png"}
              width={64}
              height={64}
              alt="player1"
              className="aspect-square rounded-xl"
            />
          </Link>
          <div className="flex w-[160px] flex-col">
            <h2 className="text-14 truncate font-semibold text-white-1">
              {audio?.title}
            </h2>
            <p className="text-12 font-normal text-white-2">{audio?.author}</p>
          </div>
        </div>
        <div className="flex-center cursor-pointer gap-3 md:gap-6">
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
        <div className="flex items-center gap-6">
          <Image
            src={
              isShuffled ? "/icons/shuffle-on.svg" : "/icons/shuffle-off.svg"
            }
            width={24}
            height={24}
            alt="shuffle"
            onClick={handleShuffle}
            className="cursor-pointer"
          />
          <h2 className="text-16 font-normal text-white-2 max-md:hidden">
            {formatTime(currentTime)} / {formatTime(duration)}{" "}
            {/* Show current time and duration */}
          </h2>
          <Image
            src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
            width={24}
            height={24}
            alt="mute unmute"
            onClick={toggleMute}
            className="cursor-pointer"
          />
          <Image
            src={isLooping ? "/icons/loop-on.svg" : "/icons/loop-off.svg"}
            width={24}
            height={24}
            alt="loop"
            onClick={toggleLoop}
            className="cursor-pointer"
          />
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayer;
