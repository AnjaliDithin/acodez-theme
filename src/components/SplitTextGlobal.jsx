import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SplitTextGlobal() {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  // ✅ MAIN TEXT
  const text = useMemo(() => (
    "Acodez is rated as one of the top web agencies in India by various industry magazines and review sites. We have a right blend of award-winning designers, expert web developers and Google certified digital marketers which make us a unique one-stop solution for hundreds of our clients, spread across 80+ countries."
  ), []);

  const words = useMemo(() => text.split(" "), [text]);

  // ✅ ✅ EDIT ONLY THIS DATA

  // ✅ PHRASES TO HIGHLIGHT (MULTI-WORD SUPPORTED)
  const highlightPhrases = [
    "acodez",
    "top web agencies",
    "google certified"
  ];

  // ✅ IMAGES AFTER SPECIFIC WORDS (DIFFERENT IMAGES)
  const imageAfterRules = [
    {
      phrase: "india",
      src: "/images/home/oval-img1.png"
    },
    {
      phrase: "developers",
      src: "/images/home/oval-img2.jpg"   // ✅ different image
    }
  ];

  // ✅ ✅ HIGHLIGHT MAP → MARKS *ALL WORDS* IN A PHRASE
  const highlightMap = useMemo(() => {
    const map = new Array(words.length).fill(false);

    highlightPhrases.forEach(phrase => {
      const phraseWords = phrase.split(" ");

      for (let i = 0; i <= words.length - phraseWords.length; i++) {
        const segment = words
          .slice(i, i + phraseWords.length)
          .join(" ")
          .toLowerCase()
          .replace(/[.,]/g, "");

        if (segment === phrase) {
          phraseWords.forEach((_, idx) => {
            map[i + idx] = true; // ✅ highlights ALL words in phrase
          });
        }
      }
    });

    return map;
  }, [words]);

  // ✅ ✅ IMAGE MATCH (NO DUPLICATION)
  const getImageAfter = (cleanWord) => {
    const rule = imageAfterRules.find(r => r.phrase === cleanWord);
    return rule ? rule.src : null;
  };

  // ✅ ✅ GSAP SCROLL OPACITY ANIMATION
  useEffect(() => {
    if (!textRef.current) return;

    const el = textRef.current;
    const wordNodes = el.querySelectorAll(".word");

    ScrollTrigger.getAll().forEach(t => {
      if (t.trigger === el) t.kill();
    });

    gsap.killTweensOf(wordNodes);
    gsap.set(wordNodes, { opacity: 0.2 });

    const tween = gsap.to(wordNodes, {
      opacity: 1,
      duration: 0.6,
      ease: "power1.out",
      stagger: 0.06,
      scrollTrigger: {
        trigger: containerRef.current || el,
        start: "top 80%",
        end: "top 20%",
        scrub: true,
        invalidateOnRefresh: true
      }
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [words]);

  // ✅ ✅ JSX OUTPUT
  return (
    <div className="smooth-wrapper">
      <div ref={containerRef} className="smooth-content">
        <h3 ref={textRef} className="scroll-opacity-text">

          {words.map((word, index) => {
            const cleanWord = word.replace(/[.,]/g, "").toLowerCase();

            // ✅ FULL PHRASE HIGHLIGHT
            const shouldHighlight = highlightMap[index];

            // ✅ DIFFERENT IMAGE AFTER WORD
            const imageSrc = getImageAfter(cleanWord);

            return (
              <React.Fragment key={index}>
                <span
                  className={`word inline-block transition-opacity duration-300 ${
                    shouldHighlight ? "font-medium text-[#0F172A]" : ""
                  }`}
                  style={{ opacity: 0.2 }}
                >
                  {word}
                </span>

                {/* ✅ IMAGE AFTER WORD */}
                {imageSrc && (
                  <span className="word inline-block align-middle" style={{ opacity: 0.2 }}>
                    <span className="inline-flex items-center justify-center highlight-img">
                      <img
                        className="oval-image"
                        src={imageSrc}
                        alt="icon"
                      />
                    </span>
                  </span>
                )}

              </React.Fragment>
            );
          })}

        </h3>
      </div>
    </div>
  );
}
