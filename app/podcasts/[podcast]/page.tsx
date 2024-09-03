"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";

const PodcastDetails = ({
  params: { podcastId },
}: {
  params: { podcastId: Id<"podcasts"> };
}) => {
  const podcast = useQuery(api.podcasts.getPodcastById, {
    podcastId,
  });

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
      </header>
      <figure className="flex gap-3">
        <Image
          src="/icons/headphone.svg"
          alt="headphone"
          width={24}
          height={24}
        />
        <h2 className="text-16 font-bold text-white-1">{podcast?.views}</h2>
      </figure>
    </section>
  );
};

export default PodcastDetails;
