"use client";
import PodcastCard from "@/components/PodcastCard";
import LatestPodcastCard from "@/components/LatestPodcastCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useAudio } from "@/providers/AudioProvider";
import { AudioProps } from "@/types";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  const popularPodcasts = useQuery(api.podcasts.getPopularPodcasts);
  const {user} = useUser();

  const [currentPlayingId, setCurrentPlayingId] =
    useState<Id<"podcasts"> | null>(null);
  const { setAudioList } = useAudio(); // Access the audio provider to set the audio list

  useEffect(() => {
    // Check if both trendingPodcasts and popularPodcasts exist and are not empty
    if (
      !trendingPodcasts ||
      !popularPodcasts ||
      (trendingPodcasts.length === 0 && popularPodcasts.length === 0)
    ) {
      console.log("No podcasts found!"); // Log if no podcasts are available
      return; // Exit early if there are no podcasts
    }

    const audioList: AudioProps[] = [
      ...(trendingPodcasts?.map((item) => ({
        _id: item._id,
        audioUrl: item.audioUrl ?? "", // Provide a fallback if undefined
        title: item.podcastTitle,
        author: item.author,
        duration: String(item.audioDuration),
        imageUrl: item.imageUrl ?? "", // Optional property
        podcastId: item._id,
      })) || []),
      ...(popularPodcasts?.map((item) => ({
        _id: item._id,
        audioUrl: item.audioUrl ?? "",
        title: item.podcastTitle,
        author: item.author,
        duration: String(item.audioDuration),
        imageUrl: item.imageUrl ?? "", // Optional property
        podcastId: item._id,
      })) || []),
    ];

    setAudioList(audioList); // Set the audio list in the audio provider for global use
  }, [trendingPodcasts, popularPodcasts, setAudioList]);

  const handleTogglePlay = (id: Id<'podcasts'>) => {
    setCurrentPlayingId((prevId) => (prevId === id ? null : id)); // Toggle the audio
  };

  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden ">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1 text-nowrap">
          Trending Podcasts
        </h1>
        <div className="podcast_grid">
          {trendingPodcasts?.map((item) => (
            <PodcastCard
              key={item._id}
              title={item.podcastTitle}
              imgUrl={item.imageUrl ?? ""}
              description={item.podcastDescription}
              podcastId={item._id}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <h1 className="text-20 font-bold text-white-1 text-nowrap">
              Latest Podcasts
            </h1>
            <span className="text-red-1 text-16 font-semibold cursor-pointer">
              See all
            </span>
          </div>
          <div className="podcast_card">
            {trendingPodcasts?.map((item, index) => (
              <LatestPodcastCard
                key={index}
                title={item.podcastTitle}
                creationTime={item._creationTime}
                imgUrl={item.imageUrl ?? ""}
                podcastId={item._id}
                author={item.author}
                duration={String(item.audioDuration)}
                imageStorageId={item?.imageStorageId as Id<"_storage">}
                audioStorageId={item?.audioStorageId as Id<"_storage">}
                views={item.views}
                index={index + 1}
                audioUrl={item.audioUrl ?? ""}
                isPlaying={currentPlayingId === item._id}
                onTogglePlay={handleTogglePlay}
                isOwner={user?.id === item.authorId}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1 text-nowrap">
          Popular Podcasts
        </h1>
        <div className="podcast_grid">
          {popularPodcasts?.map((item) => (
            <PodcastCard
              key={item._id}
              title={item.podcastTitle}
              imgUrl={item.imageUrl ?? ""}
              description={item.podcastDescription}
              podcastId={item._id}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
