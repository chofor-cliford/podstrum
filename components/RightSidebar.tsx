"use client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Carousel from "./Carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import LoaderSpinner from "./LoaderSpinner";
import { useAudio } from "@/providers/AudioProvider";
import { cn } from "@/lib/utils";

const RightSidebar = () => {
  const { user } = useUser();
  const router = useRouter();

  const fetchTopPodcasters = useQuery(api.users.getTopUserByPodcastCount);
  const topPodcasters = fetchTopPodcasters?.map((podcaster) => ({
    ...podcaster,
    podcast: podcaster.podcast.map((pod) => ({
      ...pod,
      podcastId: pod.pocastId, // Rename `pocastId` to `podcastId`
    })),
  }));

  function formatPodcastCount(totalPodcasts: number) {
    return totalPodcasts > 1
      ? `${totalPodcasts} podcasts`
      : `${totalPodcasts} podcast`;
  }
  const { audio } = useAudio();

  if (!topPodcasters) return <LoaderSpinner />;

  return (
    <section
      className={cn("right_sidebar h-[calc(100vh - 5px)]", {
        "h-[calc(100vh-140px)]": audio?.audioUrl,
      })}
    >
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {user?.firstName} {user?.lastName}
            </h1>
            <Image
              src="/icons/right-arrow.svg"
              alt="arrow"
              width={24}
              height={24}
            />
          </div>
        </Link>
      </SignedIn>
      <Header headerTitle="Fans Like You" />
      <Carousel fansLikeDetail={topPodcasters!} />

      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Podcasters" />
        <div className="flex flex-col gap-6">
          {topPodcasters?.slice(0, 4).map((orator) => (
            <div
              key={orator._id}
              className="flex cursor-pointer justify-between"
              onClick={() => router.push(`/profile/${orator.clerkId}`)}
            >
              <figure className="flex items-center gap-2">
                <Image
                  src={orator.imageUrl}
                  alt={orator.name}
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-14 font-semibold text-white-1">
                  {orator.name}
                </h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 font-normal">
                  {formatPodcastCount(orator.totalPodcasts)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default RightSidebar;
