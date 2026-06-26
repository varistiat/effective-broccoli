import gsap from "gsap";


/* ==========================================
                DOM ELEMENTS
========================================== */

const blobs = document.querySelectorAll(".blob");
const button = document.getElementById("begin-btn");
let isOpening = false;

/* ==========================================
            BUTTON EFFECTS
========================================== */

function initButtonGlow() {

    if (!button) return;

    button.addEventListener("mouseenter", () => {

        gsap.to(button, {
            boxShadow: "0 18px 45px rgba(216,170,170,.45)",
            duration: 0.3,
            ease: "power2.out"
        });

    });

    button.addEventListener("mouseleave", () => {

        gsap.to(button, {
            boxShadow: "0 12px 30px rgba(216,170,170,.3)",
            duration: 0.3,
            ease: "power2.out"
        });

    });

}

/* ==========================================
        BACKGROUND PARALLAX
========================================== */

function initBlobParallax() {

    if (blobs.length < 3) return;

    window.addEventListener("mousemove", (e) => {

        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        gsap.to(blobs[0], {
            x: x * -25,
            y: y * -25,
            duration: 1.8,
            ease: "power3.out"
        });

        gsap.to(blobs[1], {
            x: x * 35,
            y: y * 25,
            duration: 2.2,
            ease: "power3.out"
        });

        gsap.to(blobs[2], {
            x: x * -20,
            y: y * 35,
            duration: 2,
            ease: "power3.out"
        });

    });

}

/* ==========================================
            HERO PARALLAX
========================================== */

function initHeroParallax() {

    const hero = document.querySelector("#hero");
    const card = document.querySelector(".hero-content");

    if (!hero || !card) return;

    hero.addEventListener("mousemove", (e) => {

        const rect = hero.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
            x: x * 18,
            y: y * 18,
            rotationY: x * 5,
            rotationX: -y * 5,
            duration: 0.6,
            ease: "power2.out"
        });

    });

    hero.addEventListener("mouseleave", () => {

        gsap.to(card, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            duration: 0.8,
            ease: "power3.out"
        });

    });

}

/* ==========================================
            HERO ENTRANCE
========================================== */

function initHeroEntrance() {

    const tl = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    tl.from("#hero", {
        opacity: 0,
        duration: 0.5
    })

        .from(".blob", {
            opacity: 0,
            scale: 0.8,
            stagger: 0.15,
            duration: 1
        }, "-=0.2")

        .from(".hero-content", {
            y: 60,
            opacity: 0,
            scale: 0.96,
            duration: 0.9
        }, "-=0.5")

        .from(".hero-small", {
            y: 20,
            opacity: 0,
            duration: 0.5
        }, "-=0.5")

        .from(".hero-title", {
            y: 30,
            opacity: 0,
            duration: 0.6
        }, "-=0.35")

        .from(".hero-subtitle", {
            y: 20,
            opacity: 0,
            duration: 0.5
        }, "-=0.35")

        .from("#begin-btn", {
            y: 15,
            opacity: 0,
            scale: 0.95,
            clearProps: "opacity",
            duration: 0.4
        }, "-=0.2");

}

/* ==========================================
            OPEN SCRAPBOOK
========================================== */

function initOpenButton() {

    if (!button) return;

    button.addEventListener("click", () => {

        if (isOpening) return;

        isOpening = true;

        const hero = document.querySelector("#hero");
        const timeline = document.querySelector("#timeline");
        const sidebar = document.querySelector(".sidebar");

        if (sidebar) {
            sidebar.classList.add("is-visible");
        }

        document.body.classList.add("scrapbook-open");

        if (!hero || !timeline) return;

        timeline.classList.add("is-active");
        timeline.classList.add("is-visible");
        gsap.set(timeline, {
            opacity: 0,
            y: 32
        });

        const openTl = gsap.timeline({
            defaults: {
                ease: "power2.inOut"
            }
        });

        openTl
            .to(".hero-content", {
                opacity: 0,
                y: -18,
                scale: 0.96,
                duration: 0.45
            })
            .to(blobs, {
                opacity: 0.16,
                duration: 0.45,
                stagger: 0.04
            }, "<")
            .to(hero, {
                opacity: 0,
                height: 0,
                minHeight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                margin: 0,
                duration: 0.8,
                onStart: () => {
                    hero.style.overflow = "hidden";
                },
                onUpdate: () => {
                    window.scrollTo({
                        top: 0
                    });
                },
                onComplete: () => {
                    hero.style.display = "none";
                    hero.setAttribute("aria-hidden", "true");
                    document.dispatchEvent(new CustomEvent("scrapbook:open"));
                }
            }, "-=0.05")
            .to(timeline, {
                opacity: 1,
                y: 0,
                duration: 0.75,
                ease: "power3.out"
            }, "-=0.45");

    });

}

/* ==========================================
            INITIALIZE
========================================== */

function initHero() {

    initButtonGlow();
    initBlobParallax();
    initHeroParallax();
    initHeroEntrance();
    initOpenButton();

}

initHero();
