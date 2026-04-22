/** Landing copy migrated from the former WordPress site (homepage, cavemen.africa). */

export const heroEyebrow = "Creative studio · Northern Nigeria";

export const heroTitle =
  "We are more than a creative studio—we are a studio of studios.";

export const heroIntro =
  "Cavemen is an innovative studio that offers a collaborative workforce for executing creative services including content creation.";

export const aboutParagraphs = [
  "Impactful creative solutions—we don't just create, we craft experiences.",
  "Cavemen was formed as a consortium between Sal's Epiphany Studio, Startup Kano, and other strategic partners to share resources and create a comfortable environment for creatives in Northern Nigeria.",
];

export type Partner = { name: string; summary: string };

export const partners: Partner[] = [
  {
    name: "Sal's Epiphany Studio",
    summary:
      "Northern Nigeria's first creative studio dedicated to product presentation—and winner of the Creative Business Cup Nigeria 2020.",
  },
  {
    name: "Startup Kano",
    summary:
      "A leading innovation hub and ecosystem enabler in Northern Nigeria, empowering early-stage entrepreneurs through capacity building, mentorship, and inclusive community programmes.",
  },
  {
    name: "CEMO Media Hub",
    summary:
      "Founded to bridge the gap in creative media training and production in Northern Nigeria.",
  },
  {
    name: "Symmetric Dimensions",
    summary:
      "A technology solutions provider committed to empowering businesses through innovative solutions.",
  },
];

export type PastProject = {
  title: string;
  summary: string;
  year?: string;
};

export const previousProjects: PastProject[] = [
  {
    title: "Impact-X",
    summary:
      "A special tool created by Cavemen to help high-impact organisations with over seven years of existence communicate their value and impact through innovative data storytelling.",
  },
  {
    title: "Docuscreen",
    summary:
      "Documentary screenings that invite audiences to reflect on community and change—including curated films such as a powerful story by Vinícius Girnys, with conversations hosted by Cavemen Africa.",
  },
  {
    title: "Fluid Identities",
    summary:
      "Art without borders—an exhibition hosted at Cavemen Africa that brought together calligraphic scripts, mandala patterns, abstraction, and pop influences to explore how identity moves between tradition, spirituality, and modern visual culture.",
  },
  {
    title: "Creative services delivery",
    summary:
      "End-to-end work across photography (e-commerce, lifestyle, corporate), videography, brand strategy, packaging, web, and copywriting—from social content plans to campaign narratives.",
  },
  {
    title: "Tsangaya Creative Bootcamp",
    summary:
      "A hybrid creative training programme that incubates young creatives through hands-on learning, digital storytelling, design thinking, and entrepreneurial development.",
  },
];

export type UpcomingEvent = {
  title: string;
  dateLabel: string;
  description: string;
  href?: string;
  ctaLabel?: string;
};

export const upcomingEvents: UpcomingEvent[] = [
  {
    title: "Creative Meetup",
    dateLabel: "Seasonal dates — follow announcements",
    description:
      "A gathering for creatives to connect, share work, and build collaborations across disciplines.",
  },
  {
    title: "Docuscreen",
    dateLabel: "Register for the next screening",
    description:
      "Sometimes light doesn't just brighten a room—it changes a life. Cavemen Africa hosts documentary nights that invite you to reflect on community and how stories reshape us. Registration and updates via the link below.",
    href: "https://bit.ly/CavemenDocuscreen",
    ctaLabel: "Register",
  },
  {
    title: "Asali Open Mic",
    dateLabel: "Recurring at Cavemen Africa, Kano",
    description:
      "Asali is where raw voices rise—a mic, a stage, and the stories we carry. We close each season with the community that has grown the room; check the event page for the next date.",
    href: "/asali-open-mic",
    ctaLabel: "Event details",
  },
  {
    title: "Tsangaya Creative Bootcamp",
    dateLabel: "Hybrid cohorts — dates announced per run",
    description:
      "Hands-on creative training combining digital storytelling, design thinking, and entrepreneurship for passionate young creatives.",
    href: "https://cavemen.africa/elementor-625/",
    ctaLabel: "Read more",
  },
];

export type ImpactStat = { value: string; label: string };

export const impactStats: ImpactStat[] = [
  { value: "4", label: "Consortium partner organisations" },
  { value: "6+", label: "Seasons of Asali Open Mic to date" },
  {
    value: "7+",
    label: "Years working with high-impact organisations (Impact-X)",
  },
  { value: "4", label: "Signature programme tracks on the annual calendar" },
];

export type Testimonial = { quote: string; cite: string };

/** Pulled from the former homepage; replace any template lines you do not use. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "My heartfelt thanks for the opportunity to share my knowledge with you. The energy, creativity, and openness of your team made it not only enjoyable but deeply inspiring.",
    cite: "Sir Altium Photography",
  },
  {
    quote:
      "“Olivia is the most impressive interior designer I’ve ever worked with! She had such a good eye for what I was looking for and we even came in under budget!”",
    cite: "Reeva Moran",
  },
  {
    quote:
      "“I couldn’t be happier with my new home! I was nervous because of the strange layout of my house, but the team was able to create custom furniture and build the perfect space!”",
    cite: "Maggie Ramos",
  },
];
