/* ===========================================================
                    LETTER — two-face card
    Envelope face fades out, letter face fades in.
    Container never changes size → zero layout shift.
=========================================================== */

export function initLetter() {

    const stage    = document.getElementById("letter-stage");
    const envelope = document.getElementById("envelope");
    const ltrFace  = document.getElementById("ltr-face");
    const closeBtn = document.getElementById("letter-close-btn");

    if (!stage || !envelope) return;

    function open() {
        stage.classList.add("is-open");
        if (ltrFace) ltrFace.setAttribute("aria-hidden", "false");
        envelope.setAttribute("aria-expanded", "true");
    }

    function close() {
        stage.classList.remove("is-open");
        if (ltrFace) ltrFace.setAttribute("aria-hidden", "true");
        envelope.setAttribute("aria-expanded", "false");
        // scroll letter back to top so it's fresh on next open
        if (ltrFace) ltrFace.scrollTop = 0;
    }

    envelope.addEventListener("click", open);

    if (closeBtn) {
        closeBtn.addEventListener("click", close);
    }

}
