(function () {
    const root = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const langButtons = document.querySelectorAll(".lang-btn");
    const translatables = document.querySelectorAll("[data-tr][data-en]");
    const htmlTranslatables = document.querySelectorAll("[data-tr-html][data-en-html]");
    const pageContent = document.querySelector(".page-content");
    const reveals = document.querySelectorAll(".reveal");

    const savedTheme = localStorage.getItem("theme") || "light";
    const savedLang = localStorage.getItem("lang") || "tr";

    function triggerThemeAnimation() {
        root.classList.add("theme-animating");
        window.clearTimeout(triggerThemeAnimation._timer);
        triggerThemeAnimation._timer = window.setTimeout(() => {
            root.classList.remove("theme-animating");
        }, 320);
    }

    function animateLanguageSwitch() {
        if (pageContent) {
            pageContent.classList.add("is-switching");
        }

        translatables.forEach((el) => {
            el.classList.remove("is-text-switching");
            void el.offsetWidth;
            el.classList.add("is-text-switching");
        });

        htmlTranslatables.forEach((el) => {
            el.classList.remove("is-text-switching");
            void el.offsetWidth;
            el.classList.add("is-text-switching");
        });

        window.clearTimeout(animateLanguageSwitch._timer);
        animateLanguageSwitch._timer = window.setTimeout(() => {
            if (pageContent) {
                pageContent.classList.remove("is-switching");
            }
        }, 220);
    }

    function applyTheme(theme, withAnimation = false) {
        if (withAnimation) {
            triggerThemeAnimation();
        }

        root.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);

        const themeText = document.querySelector(".theme-toggle-text");
        const currentLang = localStorage.getItem("lang") || "tr";

        if (themeText) {
            if (theme === "dark") {
                themeText.textContent = currentLang === "tr" ? "Açık" : "Light";
            } else {
                themeText.textContent = currentLang === "tr" ? "Koyu" : "Dark";
            }
        }
    }

    function applyLanguage(lang, withAnimation = false) {
        document.documentElement.lang = lang;
        localStorage.setItem("lang", lang);

        translatables.forEach((el) => {
            const value = el.getAttribute(`data-${lang}`);
            if (value !== null) {
                el.textContent = value;
            }
        });

        htmlTranslatables.forEach((el) => {
            const value = el.getAttribute(`data-${lang}-html`);
            if (value !== null) {
                el.innerHTML = value;
            }
        });

        langButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.lang === lang);
        });

        const currentTheme = localStorage.getItem("theme") || "light";
        applyTheme(currentTheme, false);

        if (withAnimation) {
            animateLanguageSwitch();
        }
    }

    function initRevealAnimation() {
        if (!("IntersectionObserver" in window)) {
            reveals.forEach((el) => el.classList.add("visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        reveals.forEach((el) => observer.observe(el));
    }

    themeToggle.addEventListener("click", function () {
        const currentTheme = root.getAttribute("data-theme") || "light";
        const nextTheme = currentTheme === "light" ? "dark" : "light";
        applyTheme(nextTheme, true);
    });

    langButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const selectedLang = btn.dataset.lang;
            const currentLang = localStorage.getItem("lang") || "tr";

            if (selectedLang !== currentLang) {
                applyLanguage(selectedLang, true);
            }
        });
    });

    applyTheme(savedTheme, false);
    applyLanguage(savedLang, false);
    initRevealAnimation();
})();
