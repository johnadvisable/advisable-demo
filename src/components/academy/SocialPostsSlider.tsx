// @ts-nocheck
import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import reelThumb from '@/assets/academy-reel-thumb.jpg';

type SocialPost = {
  network: 'instagram' | 'linkedin' | 'image';
  /** Instagram shortcode or LinkedIn urn */
  id: string;
  label: string;
  /** Visible window height of the embed */
  windowHeight: number;
  /** Total iframe height rendered behind the window */
  frameHeight?: number;
  /** How much of the embed top (usually the long caption) is scrolled out of view */
  offset?: number;
  image?: string;
  url: string;
};

const POSTS: SocialPost[] = [
  {
    network: 'image',
    id: 'insurancemarket-ai-training',
    label: 'Εκπαίδευση AI στην InsuranceMarket, δημοσίευση στο LinkedIn',
    windowHeight: 560,
    image: '/images/academy/insurancemarket-linkedin.png',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7484964140403474432',
  },
  {
    network: 'instagram',
    id: 'Dc6CkgRs1qM',
    label: 'Instagram reel από εκπαίδευση Advisable Academy',
    windowHeight: 560,
    url: 'https://www.instagram.com/reel/Dc6CkgRs1qM/',
  },
  {
    network: 'linkedin',
    id: 'urn:li:ugcPost:7496160114152894464',
    label: 'Αναφορά στο LinkedIn από συμμετέχουσα',
    windowHeight: 560,
    frameHeight: 700,
    offset: 0,
    url: 'https://www.linkedin.com/posts/marianna-maragkou_advisable-x-insurancemarket-ai-training-activity-7500462502158434304-K7eV?utm_source=share&utm_medium=member_desktop&rcm=ACoAACQGEZ8BdMqagU2_RkMUYH7EvC2wtMVBSA8',
  },
];

const srcFor = (p: SocialPost) =>
  p.network === 'instagram'
    ? `https://www.instagram.com/reel/${p.id}/embed/captioned/`
    : `https://www.linkedin.com/embed/feed/update/${p.id}`;


type Props = { title?: string; subtitle?: string };

const SocialPostsSlider = ({ title, subtitle }: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section className="border-b border-border/50 bg-card/20">
      <div className="container mx-auto px-4 py-14 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{title ?? 'Δημοσιεύσεις από τα social media'}</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {subtitle ?? 'Δημοσιεύσεις από συνεργάτες και συμμετέχοντες στα social media.'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Προηγούμενο"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Επόμενο"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-9 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {POSTS.map((p) => (
            <article
              key={p.id}
              className="flex w-[330px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border/60 bg-background sm:w-[360px]"
            >
              {p.network === 'image' ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.label}
                  className="group relative block overflow-hidden bg-background"
                  style={{ height: p.windowHeight }}
                >
                  <img
                    src={p.image}
                    alt={p.label}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </a>
              ) : p.network === 'instagram' ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.label}
                  className="group relative block overflow-hidden bg-black"
                  style={{ height: p.windowHeight }}
                >
                  <img
                    src={reelThumb}
                    alt="Στιγμιότυπο από βίντεο εκπαίδευσης της Advisable Academy"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background/85 shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-0.5 h-7 w-7 text-foreground" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold text-foreground">
                    Δες το reel στο Instagram
                  </span>
                </a>
              ) : (
                <div className="relative overflow-hidden" style={{ height: p.windowHeight }}>
                  <iframe
                    src={srcFor(p)}
                    title={p.label}
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    scrolling="no"
                    frameBorder="0"
                    className="absolute left-0 w-full"
                    style={{ height: p.frameHeight, top: -(p.offset ?? 0) }}
                  />
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={p.label}
                    className="absolute inset-0"
                  />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialPostsSlider;
