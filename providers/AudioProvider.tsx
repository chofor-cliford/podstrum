"use client";

import { AudioContextType, AudioProps } from "@/types";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audio, setAudio] = useState<AudioProps | undefined>();
  const [audioList, setAudioList] = useState<AudioProps[]>([]); // List of audios
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/create-podcast") setAudio(undefined);
  }, [pathname]);

  // Shuffle the audio list
  const shuffleAudioList = () => {
    const shuffledList = [...audioList].sort(() => Math.random() - 0.5);
    setAudioList(shuffledList);
  };

  // Set current audio track
  const playAudio = (index: number) => {
    if (audioList[index]) {
      setAudio((prevAudio) => ({
        ...prevAudio, // Spread previous audio properties
        audioUrl: audioList[index].audioUrl, // Update only the audioUrl
        title: audioList[index].title, // Ensure title is assigned
        author: audioList[index].author, // Ensure author is assigned
        imageUrl: audioList[index].imageUrl, // Ensure imageUrl is assigned
        podcastId: audioList[index].podcastId, // Ensure podcastId is assigned
      }));
    }
  };

  return (
    <AudioContext.Provider
      value={{
        audio,
        setAudio,
        audioList,
        setAudioList,
        shuffleAudioList, // Expose shuffle function
        playAudio, // Expose function to play specific audio
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);

  if (!context)
    throw new Error("useAudio must be used within an AudioProvider");

  return context;
};

export default AudioProvider;
