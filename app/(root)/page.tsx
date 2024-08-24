"use client";
import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Home = () => {
  // const tasks = useQuery(api.tasks.get);
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Postcasts</h1>

        <div className="flex min-h-screen flex-col items-center justify-between p-24 text-white-1">
        </div>
        <div className="podcast_grid">
          {podcastData.map((item) => (
            <PodcastCard
              key={item.id}
              title={item.title}
              imgURL={item.imgURL}
              description={item.description}
              podcastId={item.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
