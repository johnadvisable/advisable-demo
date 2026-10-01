// @ts-nocheck
declare module "embla-carousel-react" {
  import { EmblaCarouselType } from "embla-carousel";
  
  interface EmblaOptionsType {
    align?: "start" | "center" | "end" | number;
    axis?: "x" | "y";
    containScroll?: false | "trimSnaps" | "keepSnaps";
    direction?: "ltr" | "rtl";
    dragFree?: boolean;
    draggable?: boolean;
    inViewThreshold?: number;
    loop?: boolean;
    skipSnaps?: boolean;
    startIndex?: number;
    duration?: number;
    [key: string]: any;
  }

  export default function useEmblaCarousel(
    options?: EmblaOptionsType,
    plugins?: any[]
  ): [React.RefCallback<HTMLElement>, EmblaCarouselType | undefined];
}