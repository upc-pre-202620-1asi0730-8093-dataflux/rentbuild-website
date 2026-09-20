/* ========================================
   RENTBUILD LANDING PAGE
   ======================================== */


/* ========================================
   NAVIGATION
   ======================================== */

const menuButton =
    document.querySelector("#menu-button");

const navigationPanel =
    document.querySelector("#main-navigation");

const navigationLinks =
    document.querySelectorAll("[data-section-link]");


function closeNavigation() {

    if (!navigationPanel || !menuButton) {
        return;
    }

    navigationPanel.classList.remove("is-open");

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

}


function toggleNavigation() {

    if (!navigationPanel || !menuButton) {
        return;
    }

    const isOpen =
        navigationPanel.classList.toggle("is-open");

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

}


if (menuButton) {

    menuButton.addEventListener(
        "click",
        toggleNavigation
    );

}


navigationLinks.forEach(link => {

    link.addEventListener(
        "click",
        closeNavigation
    );

});


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            navigationPanel?.classList.contains("is-open")
        ) {

            closeNavigation();

            menuButton?.focus();

        }

    }
);


/* ========================================
   ACTIVE NAVIGATION SECTION
   ======================================== */

const sections =
    document.querySelectorAll("main section[id]");


if ("IntersectionObserver" in window) {

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

}


/* ========================================
   INTERNATIONALIZATION
   ======================================== */

const languageButton =
    document.querySelector("#language-switch");

const languageTrack =
    document.querySelector(
        ".language-switch__track"
    );

const languageLabels =
    document.querySelectorAll(
        ".language-switch__label"
    );


/*
    Finds a translation using paths such as:

    nav.features
    hero.title
    benefits.items.0
*/
function getTranslation(language, path) {

    return path
        .split(".")
        .reduce(
            (current, key) =>
                current?.[key],
            translations[language]
        );

}


/*
    Changes all translated content
    to the selected language.
*/
function changeLanguage(language) {

    document.documentElement.lang =
        language;


    /* ----------------------------------------
       Text content
       ---------------------------------------- */

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

            if (value !== undefined) {

                element.textContent =
                    value;

            }

        });


    /* ----------------------------------------
       ARIA labels
       ---------------------------------------- */

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

            if (value !== undefined) {

                element.setAttribute(
                    "aria-label",
                    value
                );

            }

        });


    /* ----------------------------------------
       Alternative text
       ---------------------------------------- */

    document
        .querySelectorAll(
            "[data-i18n-alt]"
        )
        .forEach(element => {

            const key =
                element.dataset.i18nAlt;

            const value =
                getTranslation(
                    language,
                    key
                );

            if (value !== undefined) {

                element.setAttribute(
                    "alt",
                    value
                );

            }

        });


    /* ----------------------------------------
       Language switch appearance
       ---------------------------------------- */

    languageLabels.forEach(label => {

        label.classList.toggle(
            "is-active",
            label.dataset.language === language
        );

    });


    if (languageTrack) {

        languageTrack.classList.toggle(
            "is-spanish",
            language === "es"
        );

    }


    /* ----------------------------------------
       Save selected language
       ---------------------------------------- */

    try {

        localStorage.setItem(
            "rentbuild-language",
            language
        );

    } catch {

        /*
            The page can continue working
            even when localStorage is unavailable.
        */

    }

}


/* ========================================
   LOAD SAVED LANGUAGE
   ======================================== */

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

    /*
        Use English if localStorage
        cannot be accessed.
    */

}


changeLanguage(currentLanguage);


/* ========================================
   EN / ES BUTTON
   ======================================== */

if (languageButton) {

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

}

/* ========================================
   PRODUCT SHOWCASE ACCORDION
   ======================================== */

const accordionTriggers =
    document.querySelectorAll(
        "[data-accordion-trigger]"
    );


function closeAccordionItem(trigger) {

    const panelId =
        trigger.getAttribute(
            "aria-controls"
        );

    const panel =
        document.getElementById(
            panelId
        );

    const item =
        trigger.closest(
            ".showcase__item"
        );


    trigger.setAttribute(
        "aria-expanded",
        "false"
    );


    if (panel) {
        panel.hidden = true;
    }


    item?.classList.remove(
        "is-active"
    );

}


function openAccordionItem(trigger) {

    const panelId =
        trigger.getAttribute(
            "aria-controls"
        );

    const panel =
        document.getElementById(
            panelId
        );

    const item =
        trigger.closest(
            ".showcase__item"
        );


    trigger.setAttribute(
        "aria-expanded",
        "true"
    );


    if (panel) {
        panel.hidden = false;
    }


    item?.classList.add(
        "is-active"
    );

}


accordionTriggers.forEach(trigger => {

    trigger.addEventListener(
        "click",
        () => {

            const isOpen =
                trigger.getAttribute(
                    "aria-expanded"
                ) === "true";


            /*
                Vue used a single `active`
                value, so only one item
                can remain open.
            */

            accordionTriggers.forEach(
                otherTrigger => {

                    closeAccordionItem(
                        otherTrigger
                    );

                }
            );


            /*
                Clicking an already-open
                item closes it.
            */

            if (!isOpen) {

                openAccordionItem(
                    trigger
                );

            }

        }
    );

});

/* ========================================
   TEAM PHOTOS
   ======================================== */

const teamPhotos =
    document.querySelectorAll(
        "[data-team-photo]"
    );


const teamPhotoExtensions = [
    "webp",
    "png",
    "jpg",
    "jpeg"
];


teamPhotos.forEach(image => {

    const photoName =
        image.dataset.photo;

    const fallback =
        image.nextElementSibling;

    let extensionIndex = 0;


    function tryNextExtension() {

        if (
            extensionIndex >=
            teamPhotoExtensions.length
        ) {

            image.hidden = true;

            if (fallback) {
                fallback.hidden = false;
            }

            return;
        }


        const extension =
            teamPhotoExtensions[
                extensionIndex
                ];

        extensionIndex += 1;


        image.src =
            `./assets/images/team/${photoName}.${extension}`;

    }


    image.addEventListener(
        "error",
        tryNextExtension
    );


    image.addEventListener(
        "load",
        () => {

            image.hidden = false;

            if (fallback) {
                fallback.hidden = true;
            }

        }
    );


    tryNextExtension();

});


/* ========================================
   PRICING BILLING SWITCH
   ======================================== */

const billingButtons =
    document.querySelectorAll(
        ".billing-switch [data-billing-period]"
    );

const pricingPeriodNote =
    document.querySelector(
        "#pricing-period-note"
    );


billingButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const selectedPeriod =
                button.dataset.billingPeriod;


            billingButtons.forEach(
                otherButton => {

                    const isSelected =
                        otherButton === button;

                    otherButton.classList.toggle(
                        "is-active",
                        isSelected
                    );

                    otherButton.setAttribute(
                        "aria-pressed",
                        String(isSelected)
                    );

                }
            );


            if (pricingPeriodNote) {

                const translationKey =
                    selectedPeriod === "monthly"
                        ? "pricing.monthlyNote"
                        : "pricing.annualNote";


                pricingPeriodNote.dataset.i18n =
                    translationKey;


                const translatedText =
                    getTranslation(
                        currentLanguage,
                        translationKey
                    );


                if (
                    translatedText !== undefined
                ) {

                    pricingPeriodNote.textContent =
                        translatedText;

                }

            }

        }
    );

});

/* ========================================
   CONTACT FORM
   ======================================== */

/*
    Leave empty while no backend/form
    service has been configured.

    Example:
    const CONTACT_FORM_ENDPOINT =
        "https://example.com/api/contact";
*/

const CONTACT_FORM_ENDPOINT = "";


const contactForm =
    document.querySelector(
        "#contact-form"
    );

const contactSubmitButton =
    document.querySelector(
        "#contact-submit"
    );

const contactStatus =
    document.querySelector(
        "#contact-status"
    );


function setContactStatus(status) {

    if (!contactStatus) {
        return;
    }


    if (!status) {

        contactStatus.textContent = "";

        delete contactStatus.dataset.i18n;

        return;
    }


    const translationKey =
        `contact.${status}`;


    contactStatus.dataset.i18n =
        translationKey;


    const translatedText =
        getTranslation(
            currentLanguage,
            translationKey
        );


    if (translatedText !== undefined) {

        contactStatus.textContent =
            translatedText;

    }

}


function setContactSubmitting(
    isSubmitting
) {

    if (!contactForm) {
        return;
    }


    const controls =
        contactForm.querySelectorAll(
            "input, textarea, button"
        );


    controls.forEach(control => {

        control.disabled =
            isSubmitting;

    });


    if (!contactSubmitButton) {
        return;
    }


    const translationKey =
        isSubmitting
            ? "contact.sending"
            : "contact.send";


    contactSubmitButton.dataset.i18n =
        translationKey;


    const translatedText =
        getTranslation(
            currentLanguage,
            translationKey
        );


    if (translatedText !== undefined) {

        contactSubmitButton.textContent =
            translatedText;

    }

}


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            setContactStatus("");


            /*
                Same behavior as the
                original Vue component:
                without an endpoint,
                nothing is sent or saved.
            */

            if (!CONTACT_FORM_ENDPOINT) {

                setContactStatus(
                    "unavailable"
                );

                return;
            }


            setContactSubmitting(true);


            const formData =
                new FormData(
                    contactForm
                );


            const payload = {

                name:
                    formData.get("name"),

                email:
                    formData.get("email"),

                message:
                    formData.get("message")

            };


            const controller =
                new AbortController();


            const timeout =
                setTimeout(
                    () =>
                        controller.abort(),
                    10000
                );


            try {

                const response =
                    await fetch(
                        CONTACT_FORM_ENDPOINT,
                        {

                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    payload
                                ),

                            signal:
                            controller.signal

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Message was not accepted"
                    );

                }


                setContactStatus(
                    "success"
                );


                contactForm.reset();


            } catch {

                setContactStatus(
                    "error"
                );


            } finally {

                clearTimeout(
                    timeout
                );


                setContactSubmitting(
                    false
                );

            }

        }
    );

}