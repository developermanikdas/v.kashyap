import {
  Quote,
  Image,
  BookOpen,
  Lock,
} from "lucide-react";

import quoteImg from "../assets/images/quote.png";
import imageImg from "../assets/images/image.png";
import storyImg from "../assets/images/story.png";
import secretImg from "../assets/images/secret.png";

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
    title: "Secret Message",
    subtitle: "A surprise awaits you.",
    icon: Lock,
    image: secretImg,
    path: "/secret-message"
  },
];