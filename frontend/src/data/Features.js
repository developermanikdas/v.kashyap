import {
  Quote,
  Image,
  BookOpen,
  Gift,
} from "lucide-react";

import quoteImg from "../assets/images/quote.webp";
import imageImg from "../assets/images/image.webp";
import storyImg from "../assets/images/story.webp";
import giftImg from "../assets/images/gift.jpg";

export const features = [
  {
    id: 1,
    title: "Daily Quotes",
    subtitle: "Find inspiration every day.",
    icon: Quote,
    image: quoteImg,
    path: "/quotes"
  },
  {
    id: 2,
    title: "Pictures",
    subtitle: "Beautiful moments captured.",
    icon: Image,
    image: imageImg,
    path: "/pictures"
  },
  {
    id: 3,
    title: "Tiny Stories",
    subtitle: "Read stories in under a minute.",
    icon: BookOpen,
    image: storyImg,
    path: "/stories"
  },
  {
    id: 4,
    title: "Birthday Gift",
    subtitle: "A special surprise awaits you.",
    icon: Gift,
    image: giftImg,
    path: "https://birthday-wish-feedback-lovat.vercel.app/"
  },
];