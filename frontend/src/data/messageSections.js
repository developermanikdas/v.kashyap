import { Heart, Sprout, Gift } from "lucide-react";

export const messageSections = [
  {
    id: 1,
    key: "likes",
    step: "01",
    title: "Things You Like About Me",
    subtitle: "Share the little things you genuinely appreciate.",
    icon: Heart,
    color: "from-pink-100 via-rose-100 to-violet-100",
    path: "/message/likes",
    status: "not-started",
  },
  {
    id: 2,
    key: "improve",
    step: "02",
    title: "Help Me Become Better",
    subtitle: "Honest feedback helps me become a better person.",
    icon: Sprout,
    color: "from-emerald-100 via-green-100 to-teal-100",
    path: "/message/improve",
    status: "in-progress",
  },
  {
    id: 3,
    key: "birthday",
    step: "03",
    title: "Birthday Letter",
    subtitle: "Write something I'll read on my birthday.",
    icon: Gift,
    color: "from-violet-100 via-purple-100 to-fuchsia-100",
    path: "/message/birthday",
    status: "completed",
  },
];