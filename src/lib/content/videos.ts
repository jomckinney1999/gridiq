export type ContentVideo = {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  date: string;
  views: string;
};

export const VIDEOS: ContentVideo[] = [
  {
    id: "1",
    title: "EPA Explained in 5 Minutes Using Real NFL Plays",
    category: "Advanced Stats",
    description:
      "A fast breakdown of how EPA works on actual plays — no jargon, just football and numbers that match what you see on tape.",
    duration: "5 min",
    date: "Mar 2, 2025",
    views: "18.2K views",
  },
  {
    id: "2",
    title: "How I Found a Waiver Wire Gem Using Target Share Data",
    category: "Fantasy",
    description:
      "Step-by-step screen we use to find receivers before the breakout hits the box score. Save this for your league.",
    duration: "8 min",
    date: "Feb 26, 2025",
    views: "24.1K views",
  },
  {
    id: "3",
    title: "The Stat That Predicted Every 2024 Fantasy Bust Before the Season",
    category: "Fantasy",
    description:
      "We flagged the warning signs in ADP and efficiency metrics — here's what to watch for next draft season.",
    duration: "12 min",
    date: "Feb 19, 2025",
    views: "31.5K views",
  },
  {
    id: "4",
    title: "SQL Tutorial: Query NFL Stats Like a Data Scientist",
    category: "Courses Preview",
    description:
      "A hands-on intro to SELECT, JOIN, and WHERE using real player tables — the same patterns we use in production.",
    duration: "15 min",
    date: "Mar 10, 2025",
    views: "9.8K views",
  },
  {
    id: "5",
    title: "Rueben Bain Film Room: Why His Pass Rush Grade Is Elite",
    category: "Prospects",
    description:
      "All-22 clips and pressure metrics on why the tape matches the analytics for a potential Day 1 impact rusher.",
    duration: "10 min",
    date: "Mar 6, 2025",
    views: "14.0K views",
  },
  {
    id: "6",
    title: "Building a Fantasy Football App in Python — Full Tutorial",
    category: "Courses Preview",
    description:
      "From data ingestion to a simple projection model — end-to-end in one sitting. Code walkthrough included.",
    duration: "22 min",
    date: "Mar 1, 2025",
    views: "11.3K views",
  },
];
