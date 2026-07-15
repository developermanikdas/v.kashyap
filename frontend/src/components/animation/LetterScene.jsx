import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const lines = [1, 2, 3, 4, 5, 6, 7];

const LetterScene = () => {
  const paragraphs = [
    "Thank you for always being there.",
    "Every moment we shared became a beautiful memory.",
    "You made my life brighter every single day.",
  ];

  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [line3, setLine3] = useState("");

  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;

    const first = setInterval(() => {
      setLine1(paragraphs[0].slice(0, i));
      i++;

      if (i > paragraphs[0].length) {
        clearInterval(first);

        let j = 0;

        const second = setInterval(() => {
          setLine2(paragraphs[1].slice(0, j));
          j++;

          if (j > paragraphs[1].length) {
            clearInterval(second);

            let k = 0;

            const third = setInterval(() => {
              setLine3(paragraphs[2].slice(0, k));
              k++;

              if (k > paragraphs[2].length) {
                clearInterval(third);
              }
            }, 35);
          }
        }, 35);
      }
    }, 35);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-[#faf8f4]">
      <motion.div
        initial={{
          opacity: 0,
          rotateX: -90,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          rotateX: 0,
          scale: 1,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        style={{ transformPerspective: 1200 }}
        className="w-[420px] origin-top rounded-xl bg-white p-10 shadow-2xl"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 text-2xl font-semibold"
        >
          Dear Friend,
        </motion.h2>

        <div className="space-y-6">
          <p className="min-h-[180px] whitespace-pre-line text-lg leading-8 text-gray-700">
            <>
              <p>{line1}</p>

              <p className="mt-5">{line2}</p>

              <p className="mt-5">{line3}</p>
            </>
          </p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: line3.length === paragraphs[2].length ? 1 : 0,
              y: line3.length === paragraphs[2].length ? 0 : 20,
            }}
            transition={{ duration: 0.5 }}
            className="text-right text-xl font-semibold text-gray-800"
          >
            — With Love ❤️
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default LetterScene;
