"use client";
import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);

  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden ">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1 text-nowrap">
          Trending Postcasts
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
    </div>
  );
};

export default Home;
