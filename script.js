const loader = document.getElementById("loader");
const themeToggle = document.getElementById("themeToggle");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const scrollProgress = document.getElementById("scrollProgress");
const cursorDot = document.getElementById("cursorDot");
const cursorOutline = document.getElementById("cursorOutline");
const typingText = document.getElementById("typingText");
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const contributionGrid = document.getElementById("contributionGrid");

const typingRoles = ["Full-Stack Developer", "BCA Graduate", "React Developer", "Problem Solver"];

let roleIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let countersStarted = false;

window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 650);
});

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
    const icon = themeToggle.querySelector("i");
    icon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

const savedTheme = localStorage.getItem("portfolio-theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
setTheme(savedTheme || systemTheme);

themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
});

navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    });
});

function typeRole() {
    const currentRole = typingRoles[roleIndex];
    typingText.textContent = currentRole.slice(0, characterIndex);

    if (!isDeleting && characterIndex < currentRole.length) {
        characterIndex += 1;
        setTimeout(typeRole, 78);
        return;
    }

    if (!isDeleting && characterIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeRole, 1150);
        return;
    }

    if (isDeleting && characterIndex > 0) {
        characterIndex -= 1;
        setTimeout(typeRole, 42);
        return;
    }

    isDeleting = false;
    roleIndex = (roleIndex + 1) % typingRoles.length;
    setTimeout(typeRole, 180);
}

typeRole();

function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (event) => {
        cursorDot.style.left = `${event.clientX}px`;
        cursorDot.style.top = `${event.clientY}px`;
        cursorOutline.animate(
            { left: `${event.clientX}px`, top: `${event.clientY}px` },
            { duration: 420, fill: "forwards" }
        );
    });

    document.querySelectorAll("a, button, input, textarea").forEach((item) => {
        item.addEventListener("mouseenter", () => cursorOutline.classList.add("active"));
        item.addEventListener("mouseleave", () => cursorOutline.classList.remove("active"));
    });
}

function createParticles() {
    const container = document.getElementById("particles");
    const particleCount = window.innerWidth < 768 ? 24 : 46;

    for (let index = 0; index < particleCount; index += 1) {
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * -18}s`;
        particle.style.setProperty("--duration", `${12 + Math.random() * 16}s`);
        particle.style.setProperty("--opacity", `${0.18 + Math.random() * 0.55}`);
        container.appendChild(particle);
    }
}

createParticles();

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");

                if (!countersStarted && entry.target.classList.contains("stats-grid")) {
                    countersStarted = true;
                    animateCounters();
                }
            }
        });
    },
    { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function animateCounters() {
    document.querySelectorAll("[data-count]").forEach((counter) => {
        const target = Number(counter.dataset.count);
        const duration = 1400;
        const startTime = performance.now();

        function updateCounter(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;
        document.querySelectorAll(".project-card").forEach((card) => {
            const categories = card.dataset.category.split(" ");
            card.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
        });
    });
});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
                });
            }
        });
    },
    { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

function createContributionGraph() {
    const levels = [0, 1, 1, 2, 0, 3, 2, 1, 4, 0, 2, 3, 1, 0, 4, 2, 1, 3];
    for (let index = 0; index < 126; index += 1) {
        const cell = document.createElement("span");
        const level = levels[(index + Math.floor(index / 7)) % levels.length];
        if (level > 0) cell.classList.add(`level-${level}`);
        contributionGrid.appendChild(cell);
    }
}

createContributionGraph();

function validateField(field) {
    const wrapper = field.closest(".field");
    const value = field.value.trim();
    let isValid = value.length > 0;

    if (field.type === "email") {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    if (field.type === "tel") {
        isValid = /^[0-9+\-\s()]{7,16}$/.test(value);
    }

    wrapper.classList.toggle("error", !isValid);
    return isValid;
}

form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => validateField(field));
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [...form.querySelectorAll("input, textarea")];
    const isValid = fields.every(validateField);

    if (!isValid) {
        formStatus.textContent = "Please complete all fields with valid contact details.";
        formStatus.className = "form-status error";
        return;
    }

    const formData = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem("portfolio-contact-draft", JSON.stringify(formData));
    formStatus.textContent = "Message validated successfully. Email integration is ready to connect.";
    formStatus.className = "form-status success";
    form.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener("scroll", () => {
    document.querySelector(".hero-visual")?.style.setProperty("--scroll", `${window.scrollY * 0.04}px`);
}, { passive: true });
