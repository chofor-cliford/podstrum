import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import { CarouselProps } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoaderSpinner from "./LoaderSpinner";

const EmblaCarousel = ({ fansLikeDetail }: CarouselProps) => {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const slides = fansLikeDetail && fansLikeDetail?.filter((item) => item.totalPodcasts > 0);

  if (!slides) return <LoaderSpinner />;

  return (
    <section className="flex w-full flex-col gap-4 overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.slice(0, 5).map((item) => (
          <figure
            key={item._id}
            className="carousel_box"
            onClick={() => router.push(`/profile/${item.podcast[0]?.podcastId}`)}
          >
          <Image
            src={item?.imageUrl}
            alt="card"
            fill
            className="absolute size-full rounded-xl border-none"
          />
          <div className="glassmorphism-black relative z-10 flex flex-col rounded-b-xl p-4">
            <h2 className="text-14 font-semibold text-white-1">{item.podcast[0]?.podcastTitle}</h2>
            <p className="text-12 font-normal text-white-2">{item.name}</p>
          </div>
          </figure>
        ))}
      </div>
        <div className="flex justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              selected={index === selectedIndex}
            />
          ))}
        </div>
    </section>
  );
};

export default EmblaCarousel;
