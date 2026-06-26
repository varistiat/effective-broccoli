import gsap from "gsap";

import "./hero.js";
import { initLetter } from "./letters.js";

/* ==========================================
                DOM ELEMENTS
========================================== */

const loader = document.getElementById("loader");
const progress = document.querySelector(".loader-progress");
const hero = document.querySelector(".hero-content");

/* ==========================================
                LOADER
========================================== */

function initLoader() {

    if (!loader || !progress || !hero) return;

    gsap.set(hero, {
        opacity: 0,
        y: 40
    });

    gsap.to(progress, {
        width: "100%",
        duration: 2.8,
        ease: "power2.inOut",
        onComplete: finishLoading
    });

}

function finishLoading() {

    gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => loader.remove()
    });

    gsap.to(hero, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out"
    });

}

/* ==========================================
            SIDEBAR NAVIGATION
========================================== */

function initSidebarState() {

    const sidebar = document.querySelector(".sidebar");
    const links = Array.from(document.querySelectorAll(".sidebar a"));
    const sectionIds = ["timeline", "note-spread", "next-page"];
    const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    if (!sidebar || !links.length || !sections.length) return;

    const setActiveLink = (id) => {
        links.forEach((link) => {
            const item = link.parentElement;
            if (!item) return;

            item.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
    };

    const showSection = (id, animate = true) => {

        const nextSection = document.getElementById(id);

        if (!nextSection || !document.body.classList.contains("scrapbook-open")) return;

        const currentSection = sections.find((section) => section.classList.contains("is-active"));

        if (currentSection === nextSection) {
            setActiveLink(id);
            return;
        }

        const revealNext = () => {

            sections.forEach((section) => {
                const isTarget = section.id === id;
                section.classList.toggle("is-active", isTarget);
                section.classList.remove("is-visible");
            });

            setActiveLink(id);

            // Force the browser to commit the new display state before animating
            // so first-time reveals behave the same as later revisits.
            void nextSection.offsetWidth;

            if (animate) {
                gsap.fromTo(nextSection, {
                    opacity: 0,
                    y: 18
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.42,
                    ease: "power2.out",
                    onStart: () => {
                        nextSection.classList.add("is-visible");
                    }
                });
            } else {
                nextSection.classList.add("is-visible");
                gsap.set(nextSection, {
                    opacity: 1,
                    y: 0
                });
            }

        };

        if (currentSection && animate) {
            gsap.to(currentSection, {
                opacity: 0,
                y: -10,
                duration: 0.22,
                ease: "power2.in",
                onComplete: () => {
                    currentSection.classList.remove("is-visible");
                    revealNext();
                }
            });
        } else {
            revealNext();
        }

    };

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const id = link.getAttribute("href")?.replace("#", "");
            if (!id) return;

            showSection(id, true);
        });
    });

    document.addEventListener("scrapbook:open", () => {
        sidebar.classList.add("is-visible");
        setActiveLink("timeline");
    });

    setActiveLink("timeline");

}

/* ==========================================
            MEMORY WALL
========================================== */

function initMemoryWall() {

    const tiles = Array.from(document.querySelectorAll(".memory-tile"));
    const lightbox = document.querySelector(".memory-lightbox");
    const dialog = document.querySelector(".memory-lightbox-dialog");
    const closeButton = document.querySelector(".memory-lightbox-close");

    if (!tiles.length || !lightbox || !dialog || !closeButton) return;

    const setTileRatio = (tile, media) => {
        if (!tile || !media) return;

        const width = media.tagName === "VIDEO" ? media.videoWidth : media.naturalWidth;
        const height = media.tagName === "VIDEO" ? media.videoHeight : media.naturalHeight;

        if (!width || !height) return;

        const ratio = width / height;
        tile.style.setProperty("--memory-ratio", ratio.toFixed(4));

        if (ratio > 1.25) {
            tile.classList.add("is-landscape");
        } else if (ratio < 0.8) {
            tile.classList.add("is-portrait");
        } else {
            tile.classList.add("is-square");
        }
    };

    const openLightbox = (tile) => {
        const media = tile.querySelector(".memory-media");
        if (!media) return;

        dialog.innerHTML = "";

        const frame = document.createElement("figure");
        frame.className = "memory-lightbox-frame";

        const clone = media.cloneNode(true);
        clone.removeAttribute("id");
        clone.controls = clone.tagName === "VIDEO";
        clone.autoplay = false;
        clone.muted = false;
        clone.loop = false;
        clone.classList.add("memory-lightbox-media");

        const caption = document.createElement("figcaption");
        caption.className = "memory-lightbox-caption";
        caption.textContent = tile.dataset.memoryTitle || tile.querySelector(".memory-caption")?.textContent || "";

        frame.appendChild(clone);
        frame.appendChild(caption);
        dialog.appendChild(frame);

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
    };

    const closeLightbox = () => {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        dialog.innerHTML = "";
    };

    tiles.forEach((tile) => {
        if (tile.disabled) return;

        const media = tile.querySelector(".memory-media");
        if (!media) return;

        if (media.tagName === "IMG") {
            if (media.complete) {
                setTileRatio(tile, media);
            } else {
                media.addEventListener("load", () => setTileRatio(tile, media), {
                    once: true
                });
            }
        }

        if (media.tagName === "VIDEO") {
            if (media.readyState >= 1) {
                setTileRatio(tile, media);
            } else {
                media.addEventListener("loadedmetadata", () => setTileRatio(tile, media), {
                    once: true
                });
            }
        }

        tile.addEventListener("click", () => openLightbox(tile));
    });

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeLightbox();
        }
    });

}

/* ==========================================
                INITIALIZE
========================================== */

function initApp() {

    initLoader();
    initSidebarState();
    initMemoryWall();
    initLetter();

}

initApp();
