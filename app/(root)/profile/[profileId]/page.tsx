"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";

import PodcastCard from "@/components/PodcastCard";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/providers/AudioProvider";
import LoaderSpinner from "@/components/LoaderSpinner";

const Profile = ({
  params: { profileId },
}: {
  params: { profileId: string };
}) => {
  const data = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: profileId,
  });
  const { setAudio } = useAudio();

  if (!data) return <LoaderSpinner />

  const { podcasts, listeners } = data;

  const getRandomPodcast = () => {
    const randomIndex = Math.floor(Math.random() * podcasts.length);
    return podcasts[randomIndex];
  };

  const handlePlay = () => {
    setAudio({
      title: podcast.podcastTitle,
      audioUrl: podcast.audioUrl as string,
      imageUrl: podcast.imageUrl as string,
      author: podcast.author,
      podcastId: podcast._id,
    });
  };

  function formatListenersCount(totalListerner: number) {
    return totalListerner > 1 ? "listeners" : "listener";
  }

  const podcast = getRandomPodcast();

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Podcast Profile</h1>
      </header>

      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <Image
          src={podcast?.authorImageUrl!}
          width={250}
          height={250}
          alt="Podcast image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <article className="flex flex-col gap-2 max-md:items-center">
            <div className="flex gap-1">
              <Image
                src="/icons/verified.svg"
                alt="verification"
                width={16}
                height={16}
              />
              <span className="text-white-3 text-16 font-medium">
                Verified Creator
              </span>
            </div>

            <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
              {podcast?.author}
            </h1>

            <figure className="flex gap-3">
              <Image
                src="/icons/headphone.svg"
                width={24}
                height={24}
                alt="headphone"
              />
              <div className="flex gap-1">
                <h2 className="text-16 font-bold text-white-1">{listeners}</h2>
                <span className="text-16 font-medium text-white-3">
                  monthly {formatListenersCount(listeners)}
                </span>
              </div>
            </figure>
          </article>

          <Button
            onClick={handlePlay}
            className="text-16 w-full max-w-[250px] bg-red-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Play a random podcast
          </Button>
        </div>
      </div>

      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>

        {podcasts && podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcasts?.map(
              ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl as string}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              )
            )}
          </div>
        ) : (
          <>
            <EmptyState
              title="No similar podcasts found"
              buttonLink="/discover"
              buttonText="Discover more podcasts"
            />
          </>
        )}
      </section>
    </section>
  );
};

export default Profile;
