import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import BotMemory from "../models/BotMemory.js";

/**
 * Live Synchronized Bot Memories (Fetched from MongoDB database)
 * Preserves all memories added via the Admin Dashboard.
 */
export const comprehensiveBotMemories = [
  {
    "topic": "About Vanshika (Her Identity & Essence)",
    "category": "About Her (Vanshika)",
    "keywords": [
      "vanshika",
      "vanshu",
      "devi ji",
      "who is vanshika",
      "about me",
      "who am i",
      "v. kashyap"
    ],
    "answer": "**Vanshika** (affectionately called **Vanshu** or **Devi ji**) is a deeply observant, thoughtful, and artistic soul.\n\nShe carries a quiet inner strength, values emotional authenticity over superficial noise, and brings immense grace and meaning to every space she touches.",
    "priority": 5,
    "isActive": true
  },
  {
    "topic": "Vanshika's Core Values & Mindset",
    "category": "About Her (Vanshika)",
    "keywords": [
      "values",
      "nature",
      "personality",
      "traits",
      "mindset",
      "boundaries",
      "clarity"
    ],
    "answer": "Vanshika prizes clarity, emotional honesty, and gentle respect:\n- **Authenticity**: Value for honest conversations over superficial pleasantries.\n- **Inner Boundaries**: Honoring one's personal comfort and emotional well-being without guilt.\n- **Mindful Healing**: Giving oneself permission to pause, breathe, and heal at one's own pace.",
    "priority": 4,
    "isActive": true
  },
  {
    "topic": "Manik's Feelings & Respect for Vanshika",
    "category": "About Him (Manik)",
    "keywords": [
      "manik feelings",
      "what does manik think",
      "manik care",
      "respect",
      "manik promise",
      "devotion"
    ],
    "answer": "Manik holds an enduring, unconditional respect for Vanshika:\n- **Unconditional Care**: Values her peace of mind above everything else.\n- **Zero Pressure**: Believes that genuine care means being a steady, dependable presence without expecting anything in return.\n- **Quiet Protection**: Dedicated to ensuring she feels safe, supported, and respected at all times.",
    "priority": 5,
    "isActive": true
  },
  {
    "topic": "Manik's Feelings & Understanding of Love (Tattva & Document)",
    "category": "About Him (Manik)",
    "keywords": [
      "love",
      "do you love me",
      "does manik love me",
      "manik feelings",
      "what is love",
      "depth",
      "kama",
      "shringara",
      "sneha",
      "maitri",
      "karuna",
      "bhakti",
      "prema",
      "tattva",
      "document",
      "pdf",
      "article",
      "how he feels"
    ],
    "answer": "When Manik wondered whether he loved Vanshika in the conventional, dramatic way portrayed in movies, he had genuine doubts about whether he possessed that kind of depth or knew how to express it.\n\nSeeking truth, he researched ancient Indian wisdom (**Tattva**) and found that love is a 7-layered spectrum:\n- **Kāma & Shringāra**: Romantic attraction and aesthetic appreciation\n- **Sneha**: Constant, steady, lubricating care\n- **Maitri**: Unpossessive, unconditional friendship\n- **Karuṇā**: Active compassion and protective empathy\n- **Bhakti & Prema**: Deep reverence and pure selfless oneness\n\nHe realized his devotion is firmly rooted in **Sneha, Maitri, and Karuṇā**—a patient, protective presence asking nothing in return.\n\n📖 Read Manik's complete reflection and research:\n[Indian Scripture Definitions of Love (PDF)](/api/v1/resources/Indian_Scripture_Definitions_of_Love/view)",
    "priority": 5,
    "isActive": true
  },
  {
    "topic": "Mindful 4-4-6 Calming Breath",
    "category": "Mindfulness & Reflection",
    "keywords": [
      "breath",
      "calm",
      "anxiety",
      "mindful",
      "ocd",
      "panic",
      "relax",
      "stress",
      "peace"
    ],
    "answer": "**Mindful 4-4-6 Breathing Exercise**:\n1. 🌿 **Inhale** gently through your nose for **4 seconds**...\n2. ⏸️ **Hold** the breath gently for **4 seconds**...\n3. 🍃 **Exhale** slowly and completely through your mouth for **6 seconds**...\n\nYou don't need to fight every passing thought; simply give yourself permission to be still right now.",
    "priority": 4,
    "isActive": true
  },
  {
    "topic": "Inner Peace & Releasing Self-Doubt",
    "category": "Mindfulness & Reflection",
    "keywords": [
      "peace",
      "doubt",
      "overthinking",
      "worry",
      "healing",
      "space",
      "acceptance"
    ],
    "answer": "Not every question needs an immediate answer, and not every anxious thought is a truth.\n\nGive your mind room to rest like calm, undisturbed water. **You are doing well, and you are safe.**",
    "priority": 3,
    "isActive": true
  },
  {
    "topic": "Boundaries Without Guilt",
    "category": "Safety & Boundaries",
    "keywords": [
      "boundary",
      "guilt",
      "no",
      "polite",
      "firm",
      "uncomfortable",
      "pressure"
    ],
    "answer": "Setting a boundary is not an act of conflict; it is an act of **clarity and self-respect**:\n- When you say *\"I am not comfortable with this,\"* you are not offending anyone—you are protecting your peace.\n- You never owe anyone a debate or justification for needing respect and safety.\n\n📖 Reference Guide: [Women's Safety & Boundary Guide (PDF)](/api/v1/resources/womens-safety-and-ocd-guide/view)",
    "priority": 5,
    "isActive": true
  },
  {
    "topic": "The DEC Safety Framework",
    "category": "Safety & Boundaries",
    "keywords": [
      "dec",
      "framework",
      "safety",
      "detect",
      "evaluate",
      "choose",
      "protocol",
      "danger",
      "stalking"
    ],
    "answer": "The **DEC Safety Protocol** provides immediate clarity in uncertain situations:\n1. **Detect**: Recognize boundary violations or discomfort early without gaslighting your instincts.\n2. **Evaluate**: Quickly assess exits, nearby populated spaces, and available support.\n3. **Choose**: Take decisive action immediately—assert a firm boundary or transition to a safe location.\n\n📖 Full Protocol Guide: [Women's Safety & Boundary Guide (PDF)](/api/v1/resources/womens-safety-and-ocd-guide/view)",
    "priority": 4,
    "isActive": true
  },
  {
    "topic": "Brahma Kamal Wish & Badrinath Promise",
    "category": "Shared Memories & Moments",
    "keywords": [
      "brahma",
      "kamal",
      "badrinath",
      "flower",
      "wish",
      "promise",
      "sacred"
    ],
    "answer": "The **Brahma Kamal** holds a sacred, quiet meaning—a heartfelt promise remembered for **Badrinath** and the rare high-altitude bloom.\n\nSome wishes don't need frequent words; they remain vibrant because they were shared with pure intent.",
    "priority": 5,
    "isActive": true
  },
  {
    "topic": "The 60-Minute Miracle: Meeting Vanshika on Josh Skills (Jan 13, 2026)",
    "category": "Shared Memories & Moments",
    "keywords": [
      "josh skills",
      "first call",
      "vanshika kashyap",
      "ocd",
      "hygiene",
      "instagram v.ship99",
      "introversion",
      "soulmate connection",
      "january 13",
      "2026"
    ],
    "answer": "On January 13, 2026, at 10:13 AM on a winter morning, Manik made a random call on the Josh Skills app seeking 'sunshine.' He connected with Vanshika Kashyap from Delhi. The 60-minute call (the app's limit) was described as one of the rarest moments in his life. They discovered profound similarities, including shared OCD and high hygiene standards, feeling like 'Xerox copies' of each other despite different backgrounds. As the call was ending, Vanshika asked if he used LinkedIn, leading to a discussion about social media. Despite being a 'hyper-introvert' who had never personally created an Instagram account (previously using a colleague's), Manik felt an immediate shift in mentality and created his own account to connect with her. He remembered her ID 'v.kashyap99' and sent a request, which she accepted. This event marked a significant breakthrough in his social connectivity and a special beginning to their bond, occurring on a date (13th) that resonates with his birthday (August 13th).",
    "priority": 5,
    "isActive": true
  }
];

async function seedMemories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Bot Memory sync/seed...");

    // 1. Fetch live DB count first
    const existingCount = await BotMemory.countDocuments();
    console.log(`Current records in MongoDB: ${existingCount}`);

    // 2. Non-destructive upsert: updates or adds topics without deleting any existing records
    for (const mem of comprehensiveBotMemories) {
      await BotMemory.findOneAndUpdate(
        { topic: mem.topic },
        { $set: mem },
        { upsert: true, returnDocument: "after" }
      );
    }

    const totalCount = await BotMemory.countDocuments();
    console.log(`🎉 Bot Memories synced successfully! Total in DB: ${totalCount}`);

    await mongoose.disconnect();
    console.log("Disconnected cleanly.");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedMemories();
