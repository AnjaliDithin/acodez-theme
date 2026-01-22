import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initFeaturedWorks() {
    const section = document.querySelector(".featured-work-sec");
    const title = section?.querySelector(".heading-text");
    const cards = gsap.utils.toArray(".card-block");
    const exploreBtn = section?.querySelector(".explore");

    if (!section || !title || !cards.length) return;

    const init = () => {
        // 🔒 Clear existing ScrollTriggers
        ScrollTrigger.getAll().forEach((st) => {
            if (st.trigger && (st.trigger === section || section.contains(st.trigger))) {
                st.kill();
            }
        });

        // 🏗 1. Reset everything
        gsap.set([title, ...cards, exploreBtn], { clearProps: "all" });

        // Set height of the grid to match the height of the first card
        const grid = section.querySelector(".cards-grid");
        const firstCardHeight = cards[0].offsetHeight;
        if (grid) {
            gsap.set(grid, { height: firstCardHeight });
        }

        const sectionRect = section.getBoundingClientRect();
        const vCenter = window.innerHeight / 2;

        // With cards now being absolute, their Natural Top is always the top of the grid
        const cardData = cards.map((card) => {
            const rect = card.getBoundingClientRect();
            const topInSec = rect.top - sectionRect.top;
            const targetY = vCenter - topInSec - rect.height / 2;
            return { targetY };
        });

        // 🏗 2. Set Initial states
        gsap.set(title, { x: "70vw", zIndex: 1, force3D: true });

        cards.forEach((card, i) => {
            gsap.set(card, {
                y: "110vh",
                opacity: 0,
                zIndex: 10 + i,
                force3D: true,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transition: "none"
            });
        });

        if (exploreBtn) {
            gsap.set(exploreBtn, { opacity: 0, y: 30, zIndex: 100 });
        }

        // 🏗 3. Scroll Timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => "+=" + (window.innerHeight + 400),
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            },
        });

        // Title rolls
        tl.to(title, {
            x: "-50vw",
            duration: 1.5,
            ease: "none",
        });

        // Cards land individually
        cards.forEach((card, i) => {
            tl.to(
                card,
                {
                    y: cardData[i].targetY,
                    opacity: 1,
                    duration: 1.2,
                    ease: "none",
                    onStart: () => card.classList.add("is-active"),
                },
                ">" // Wait for previous to finish
            );
        });

        // Explore button appears after all cards are stacked
        if (exploreBtn) {
            tl.to(
                exploreBtn,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "none",
                },
                ">"
            );
        }

        tl.set({}, {}, "+=0.01");
        ScrollTrigger.refresh();
    };

    const imgs = Array.from(section.querySelectorAll("img"));
    let loaded = 0;
    if (imgs.length === 0) {
        init();
    } else {
        imgs.forEach((img) => {
            if (img.complete) {
                loaded++;
                if (loaded === imgs.length) init();
            } else {
                img.addEventListener("load", () => {
                    loaded++;
                    if (loaded === imgs.length) init();
                });
            }
        });
        setTimeout(() => { if (loaded < imgs.length) init(); }, 1200);
    }
}
