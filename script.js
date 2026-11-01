// =====================================
// EMAILJS INITIALIZATION
// =====================================

// =====================================
// SUPABASE INITIALIZATION
// =====================================

const SUPABASE_URL = "https://lcfwpnsbmnkmubmkcwmu.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_yVsJv1Slv6oC8lzzLhhrFg_ZBdcLg80";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

emailjs.init({
    publicKey: "UNPzQJJ30qhyF0JKe"
});

document.addEventListener("DOMContentLoaded", () => {

    // 1. SCROLL REVEAL ANIMATION

    const revealElements = document.querySelectorAll(
        ".section-heading, .project-card, .service-card, .about, .contact"
    );

    revealElements.forEach((element, index) => {
        element.classList.add("reveal");

        if (element.classList.contains("project-card")) {
            element.style.transitionDelay = `${(index % 3) * 120}ms`;
        }
    });

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }

            });

        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }


    // 2. NAVBAR SCROLL EFFECT

    const navbar = document.querySelector(".navbar");

    if (navbar) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }

        });

    }


    // 3. MOUSE GLOW EFFECT

    const glow = document.querySelector(".background-glow");

    if (glow && window.matchMedia("(pointer: fine)").matches) {

        window.addEventListener("pointermove", (event) => {

            glow.style.left = `${event.clientX}px`;
            glow.style.top = `${event.clientY - 180}px`;
            glow.style.transform = "translateX(-50%)";

        });

    }


    // 4. CURRENT YEAR IN FOOTER

    const yearElement = document.querySelector("#current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    
    // 5. MAGNETIC BUTTON EFFECT

    const canUseMagneticEffect =
        window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canUseMagneticEffect) {

        const magneticButtons = document.querySelectorAll(
            ".primary-btn, .secondary-btn"
        );

        magneticButtons.forEach(button => {

            button.addEventListener("pointermove", (event) => {

                const rect = button.getBoundingClientRect();

                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const moveX = (event.clientX - centerX) * 0.18;
                const moveY = (event.clientY - centerY) * 0.18;

                button.style.setProperty(
                    "--magnet-x",
                    `${moveX}px`
                );

                button.style.setProperty(
                    "--magnet-y",
                    `${moveY}px`
                );

            });

            button.addEventListener("pointerleave", () => {

                button.style.setProperty("--magnet-x", "0px");
                button.style.setProperty("--magnet-y", "0px");

            });

        });

    }

    
   
    // PREMIUM 3D PROJECT CARD TILT

    const canUse3DTilt =
        window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canUse3DTilt) {

        const projectCards = document.querySelectorAll(".project-card");

        projectCards.forEach(card => {

            card.addEventListener("pointermove", (event) => {

                const rect = card.getBoundingClientRect();

                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;

                const rotateY = (x - 0.5) * 24;
                const rotateX = (0.5 - y) * 24;

                card.style.setProperty("--tilt-x", `${rotateX}deg`);
                card.style.setProperty("--tilt-y", `${rotateY}deg`);

                card.style.setProperty("--light-x", `${x * 100}%`);
                card.style.setProperty("--light-y", `${y * 100}%`);

            });

            card.addEventListener("pointerleave", () => {

                card.style.setProperty("--tilt-x", "0deg");
                card.style.setProperty("--tilt-y", "0deg");
                card.style.setProperty("--light-x", "50%");
                card.style.setProperty("--light-y", "50%");

            });

        });

    }


    
    // 7. CUSTOM ANIMATED CURSOR

    const canUseCustomCursor =
        window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canUseCustomCursor) {

        const dot = document.querySelector(".cursor-dot");
        const outline = document.querySelector(".cursor-outline");

        if (dot && outline) {

            let mouseX = 0;
            let mouseY = 0;
            let ringX = 0;
            let ringY = 0;

            document.addEventListener("pointermove", (event) => {

                mouseX = event.clientX;
                mouseY = event.clientY;

                dot.style.left = `${mouseX}px`;
                dot.style.top = `${mouseY}px`;

                document.body.classList.add("cursor-active");

            });

            function animateCursor() {

                ringX += (mouseX - ringX) * 0.18;
                ringY += (mouseY - ringY) * 0.18;

                outline.style.left = `${ringX}px`;
                outline.style.top = `${ringY}px`;

                requestAnimationFrame(animateCursor);

            }

            animateCursor();

            const interactiveElements = document.querySelectorAll(
                "a, button, .project-card, .service-card"
            );

            interactiveElements.forEach(element => {

                element.addEventListener("pointerenter", () => {
                    document.body.classList.add("cursor-hover");
                });

                element.addEventListener("pointerleave", () => {
                    document.body.classList.remove("cursor-hover");
                });

            });

            document.addEventListener("pointerleave", () => {
                document.body.classList.remove("cursor-active");
            });

            document.addEventListener("pointerenter", () => {
                document.body.classList.add("cursor-active");
            });

        }

    }


    console.log("PixelCraft Studio is ready!");

});


/* =========================================
   SCROLL PROGRESS INDICATOR
========================================= */

const scrollProgress = document.querySelector("#scrollProgress");

function updateScrollProgress() {

    if (!scrollProgress) return;

    const scrollableHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress = scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

    scrollProgress.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress, {
    passive: true
});

window.addEventListener("resize", updateScrollProgress);

updateScrollProgress();

/* =====================================
   STEP 16 — BACK TO TOP FUNCTION
===================================== */

const backToTop = document.querySelector("#backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


/* =========================================
   STEP 19 — LOADING SCREEN FUNCTIONALITY
========================================= */

const siteLoader = document.querySelector("#siteLoader");

if (siteLoader) {
    const loaderStartTime = performance.now();
    const minimumDisplayTime = 1400;
    let loaderFinished = false;

    function hideSiteLoader() {
        if (loaderFinished) return;

        loaderFinished = true;

        const elapsed = performance.now() - loaderStartTime;
        const remainingTime = Math.max(
            0,
            minimumDisplayTime - elapsed
        );

        setTimeout(() => {
            siteLoader.classList.add("is-hidden");
        }, remainingTime);
    }

    window.addEventListener("load", hideSiteLoader, {
        once: true
    });

    if (document.readyState === "complete") {
        hideSiteLoader();
    }

    // Safety fallback if a resource takes unusually long.
    setTimeout(hideSiteLoader, 8000);
}


/* =========================================
   STEP 22 — SUPABASE + EMAILJS + WHATSAPP
========================================= */

const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

if (contactForm) {

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
        formStatus.textContent = "";

        try {

            // 1. Collect customer details
            const formData = new FormData(contactForm);

            const name = formData.get("name");
            const email = formData.get("email");
            const phone = formData.get("phone");
            const service = formData.get("service");
            const budget = formData.get("budget");
            const message = formData.get("message");

            // 2. Save enquiry in Supabase
            const databaseResult = await supabaseClient
                .from("enquiries")
                .insert([
                    {
                        name: name,
                        email: email,
                        phone: phone,
                        service: service,
                        budget: budget,
                        message: message
                    }
                ]);

            if (databaseResult.error) {
                throw new Error(
                    "Database Error: " + databaseResult.error.message
                );
            }

            // 3. Send enquiry through EmailJS
            await emailjs.sendForm(
                "service_hyw27lf",
                "template_6jeoh8l",
                contactForm
            );

            // 4. Prepare WhatsApp message
            const whatsappMessage = `
Hello PixelCraft Studio!

I would like to enquire about your services.

Name: ${name}
Email: ${email}
Service: ${service}
Budget: ${budget}

Message: ${message}

Looking forward to hearing from you!
            `;

            const whatsappURL =
                `https://wa.me/918928874120?text=${encodeURIComponent(whatsappMessage)}`;

            // 5. Show success message
            formStatus.textContent =
                "Your enquiry has been received successfully!";

            // 6. Open WhatsApp
            window.open(whatsappURL, "_blank");

            // 7. Reset form
            contactForm.reset();

            console.log("Enquiry saved successfully in Supabase!");

        } catch (error) {

            console.error("Enquiry Submission Error:", error);

            formStatus.textContent =
                "Unable to complete your enquiry. Please try again or contact us on WhatsApp.";

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Submit Enquiry ↗";

        }

    });

}



/* =========================================
   STEP 23 — MOBILE NAVIGATION
========================================= */

const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

if (menuToggle && mainNav) {

    // Open and close mobile menu
    menuToggle.addEventListener("click", () => {

        const isOpen = mainNav.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

    });

    // Close menu after clicking a navigation link
    mainNav.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("active");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });

}

