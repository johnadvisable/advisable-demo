import { Link } from "react-router-dom";
import { Calendar, MapPin, Monitor, ArrowRight, GraduationCap } from "lucide-react";
import academyHero from "@/assets/academy-hero.jpg";

const SEMINAR = {
  title: "AI for Business",
  subtitle:
    "Διήμερο εισαγωγικό σεμινάριο για ChatGPT και Claude στην καθημερινή σου δουλειά: Cowork, Skills και MCP connectors.",
  dates: "24 και 25 Σεπτεμβρίου 2026",
  endDate: "2026-09-25",
  venue: "Ηρώς 4, Κολωνός, Αθήνα ή online, live",
  priceOnline: 99,
  priceOnsite: 199,
  path: "/academy/seminar/claude",
};

const NextSeminar = () => {
  // Hide the section once the seminar has passed
  if (new Date(SEMINAR.endDate).getTime() < Date.now() - 86400000) return null;

  return (
    <section className="apple-section bg-background">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border/40">
          <img
            src={academyHero}
            alt="Σεμινάριο AI for Business της Advisable Academy"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40"
            aria-hidden="true"
          />

          <div className="relative p-8 lg:p-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-white backdrop-blur">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              ΕΠΟΜΕΝΟ ΣΕΜΙΝΑΡΙΟ
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-white lg:text-5xl">
              {SEMINAR.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base text-white/80 lg:text-lg">{SEMINAR.subtitle}</p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {SEMINAR.dates}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {SEMINAR.venue}
              </li>
              <li className="flex items-center gap-2">
                <Monitor className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {SEMINAR.priceOnline} € online / {SEMINAR.priceOnsite} € με φυσική παρουσία
              </li>
            </ul>

            <Link
              to={SEMINAR.path}
              className="group mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90"
            >
              Κράτησε τη θέση σου
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextSeminar;
