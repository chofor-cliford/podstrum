"use client";
import PodcastCard from "@/components/PodcastCard";
import LatestPodcastCard from "@/components/LatestPodcastCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  const popularPodcasts = useQuery(api.podcasts.getPopularPodcasts);
  console.log(trendingPodcasts);
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

      <section className="flex flex-col">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <h1 className="text-20 font-bold text-white-1 text-nowrap">
              Lastest Postcasts
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
                views={item.views}
                index={index + 1}
                audioUrl={item.audioUrl ?? ""}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1 text-nowrap">
          Popular Postcasts
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
