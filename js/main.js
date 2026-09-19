/* ========================================
   RENTBUILD LANDING PAGE
   ======================================== */


/* ----------------------------------------
   Navigation
   ---------------------------------------- */

const menuButton = document.querySelector("#menu-button");
const navigationPanel = document.querySelector("#main-navigation");
const navigationLinks = document.querySelectorAll("[data-section-link]");


function closeNavigation() {

    navigationPanel.classList.remove("is-open");

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

}


function toggleNavigation() {

    const isOpen =
        navigationPanel.classList.toggle("is-open");

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

}


menuButton.addEventListener(
    "click",
    toggleNavigation
);


navigationLinks.forEach(link => {

    link.addEventListener(
        "click",
        closeNavigation
    );

});


document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        navigationPanel.classList.contains("is-open")
    ) {

        closeNavigation();

        menuButton.focus();

    }

});


/* ----------------------------------------
   Active navigation section
   ---------------------------------------- */

const sections =
    document.querySelectorAll("main section[id]");


const sectionObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                const sectionId =
                    entry.target.id;

                navigationLinks.forEach(link => {

                    const target =
                        link.getAttribute("href");

                    if (target === `#${sectionId}`) {

                        link.setAttribute(
                            "aria-current",
                            "location"
                        );

                    } else {

                        link.removeAttribute(
                            "aria-current"
                        );

                    }

                });

            });

        },

        {
            rootMargin:
                "-15% 0px -60% 0px"
        }

    );


sections.forEach(section => {

    sectionObserver.observe(section);

});


/* ----------------------------------------
   Internationalization
   ---------------------------------------- */

const languageButton =
    document.querySelector("#language-switch");

const languageTrack =
    document.querySelector(".language-switch__track");

const languageLabels =
    document.querySelectorAll(
        ".language-switch__label"
    );


function getTranslation(language, path) {

    return path
        .split(".")
        .reduce(
            (current, key) =>
                current?.[key],
            translations[language]
        );

}


function changeLanguage(language) {

    document.documentElement.lang = language;


    /* Text content */

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            const value =
                getTranslation(
                    language,
                    key
                );

            if (value) {
                element.textContent = value;
            }

        });


    /* ARIA labels */

    document
        .querySelectorAll(
            "[data-i18n-aria-label]"
        )
        .forEach(element => {

            const key =
                element.dataset.i18nAriaLabel;

            const value =
                getTranslation(
                    language,
                    key
                );

            if (value) {

                element.setAttribute(
                    "aria-label",
                    value
                );

            }

        });


    /* Language switch */

    languageLabels.forEach(label => {

        label.classList.toggle(
            "is-active",
            label.dataset.language === language
        );

    });


    languageTrack.classList.toggle(
        "is-spanish",
        language === "es"
    );


    try {

        localStorage.setItem(
            "rentbuild-language",
            language
        );

    } catch {

        /* Optional persistence */

    }

}


/* Load saved language */

let currentLanguage = "en";

try {

    const savedLanguage =
        localStorage.getItem(
            "rentbuild-language"
        );

    if (
        savedLanguage === "en" ||
        savedLanguage === "es"
    ) {

        currentLanguage =
            savedLanguage;

    }

} catch {

    /* localStorage unavailable */

}


changeLanguage(currentLanguage);


/* Toggle EN / ES */

languageButton.addEventListener(
    "click",
    () => {

        currentLanguage =
            currentLanguage === "en"
                ? "es"
                : "en";

        changeLanguage(
            currentLanguage
        );

    }
);