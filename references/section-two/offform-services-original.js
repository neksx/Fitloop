document.addEventListener(
        "click",
        function (event) {

            if (!tabletInteraction.matches) {
                return;
            }


            if (
                event.target.closest(
                    ".talents-roster-row"
                ) ||
                event.target.closest(
                    ".talents-roster-preview"
                )
            ) {

                return;

            }


            preview.classList.remove(
                "is-visible"
            );


            section.querySelectorAll(
                ".talents-roster-row.is-tablet-active"
            ).forEach(
                function (activeRow) {

                    activeRow.classList.remove(
                        "is-tablet-active"
                    );

                }
            );

        }
    );


    /* =====================================================
       START
    ===================================================== */

    requestAnimationFrame(
        animate
    );


})();;
/* =========================================================
   TALENTS ROSTER — WOMEN / MEN SWITCH
   ROW-BY-ROW OPACITY WAVE
========================================================= */

(function () {

    const section =
        document.querySelector(
            ".talents"
        );


    if (!section) {
        return;
    }


    const switchButtons =
        Array.from(
            section.querySelectorAll(
                "[data-roster-switch]"
            )
        );


    const rosterLists =
        Array.from(
            section.querySelectorAll(
                "[data-roster]"
            )
        );


    const preview =
        section.querySelector(
            ".talents-roster-preview"
        );


    if (
        !switchButtons.length ||
        !rosterLists.length
    ) {
        return;
    }


    const rowStagger = 58;
    const fadeDuration = 180;
    const incomingDelay = 95;

    let activeName =
        rosterLists.find(list =>
            list.classList.contains(
                "is-active"
            )
        )?.dataset.roster ||
        "women";

    let switchToken = 0;


    function clearRowTimers(list) {

        if (!list) return;

        const rows =
            Array.from(
                list.querySelectorAll(
                    ".talents-roster-row"
                )
            );

        rows.forEach(row => {

            if (row._rosterFadeTimer) {
                clearTimeout(
                    row._rosterFadeTimer
                );
            }

            row._rosterFadeTimer = null;

        });

    }


    function setButtonState(name) {

        switchButtons.forEach(button => {

            const isActive =
                button.dataset.rosterSwitch ===
                name;

            button.classList.toggle(
                "is-active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                isActive
                    ? "true"
                    : "false"
            );

        });

    }


    function setRoster(name, immediate = false) {

        const nextList =
            rosterLists.find(list =>
                list.dataset.roster ===
                name
            );


        const currentList =
            rosterLists.find(list =>
                list.dataset.roster ===
                activeName
            );


        if (!nextList) {
            return;
        }


        if (
            name === activeName &&
            !immediate
        ) {

            setButtonState(name);
            return;

        }


        switchToken += 1;
        const token = switchToken;


        rosterLists.forEach(list => {
            clearRowTimers(list);
        });


        const nextRows =
            Array.from(
                nextList.querySelectorAll(
                    ".talents-roster-row"
                )
            );


        if (immediate || !currentList) {

            rosterLists.forEach(list => {

                const isActive =
                    list === nextList;

                list.classList.toggle(
                    "is-active",
                    isActive
                );

                list.setAttribute(
                    "aria-hidden",
                    isActive
                        ? "false"
                        : "true"
                );

                Array.from(
                    list.querySelectorAll(
                        ".talents-roster-row"
                    )
                ).forEach(row => {
                    row.style.opacity =
                        isActive
                            ? "1"
                            : "0";
                });

            });

            activeName = name;
            setButtonState(name);
            return;

        }


        const currentRows =
            Array.from(
                currentList.querySelectorAll(
                    ".talents-roster-row"
                )
            );


        nextList.classList.add(
            "is-active"
        );

        nextList.setAttribute(
            "aria-hidden",
            "false"
        );

        nextList.style.pointerEvents =
            "none";


        nextRows.forEach(row => {
            row.style.opacity = "0";
        });


        currentList.style.pointerEvents =
            "none";


        currentRows.forEach((row, index) => {

            row._rosterFadeTimer =
                setTimeout(() => {

                    if (token !== switchToken) {
                        return;
                    }

                    row.style.opacity = "0";

                }, index * rowStagger);

        });


        nextRows.forEach((row, index) => {

            row._rosterFadeTimer =
                setTimeout(() => {

                    if (token !== switchToken) {
                        return;
                    }

                    row.style.opacity = "1";

                },
                index * rowStagger +
                incomingDelay);

        });


        const lastIndex =
            Math.max(
                currentRows.length,
                nextRows.length
            ) - 1;


        const finishDelay =
            Math.max(0, lastIndex) *
            rowStagger +
            incomingDelay +
            fadeDuration +
            30;


        setTimeout(() => {

            if (token !== switchToken) {
                return;
            }

            rosterLists.forEach(list => {

                const isActive =
                    list === nextList;

                list.classList.toggle(
                    "is-active",
                    isActive
                );

                list.setAttribute(
                    "aria-hidden",
                    isActive
                        ? "false"
                        : "true"
                );

                list.style.pointerEvents = "";

                if (!isActive) {

                    Array.from(
                        list.querySelectorAll(
                            ".talents-roster-row"
                        )
                    ).forEach(row => {
                        row.style.opacity = "0";
                    });

                }

            });

            activeName = name;

        }, finishDelay);


        activeName = name;
        setButtonState(name);


        if (preview) {
            preview.classList.remove(
                "is-visible"
            );
        }

    }


    switchButtons.forEach(button => {

        /*
         * DESKTOP + WIDE SCREEN ONLY:
         * Prevent mouse focus from changing the browser scroll position
         * inside the sticky Talents section on the first category click.
         *
         * The click itself is untouched.
         * Keyboard focus remains available.
         * Mobile + tablet are completely untouched.
         */
        button.addEventListener(
            "mousedown",
            function (event) {

                if (
                    window.matchMedia(
                        "(min-width: 1025px)"
                    ).matches
                ) {

                    event.preventDefault();

                }

            }
        );


        button.addEventListener(
            "click",
            function () {

                setRoster(
                    button.dataset.rosterSwitch
                );

            }
        );

    });


    setRoster(
        activeName,
        true
    );

})();;
(function () {

    const section =
        document.querySelector(
            ".services"
        );


    if (!section) {
        return;
    }


    /*
     * MOBILE-ONLY MODE.
     * Desktop continues through the original code path unchanged.
     */
    const mobileLayout =
        window.matchMedia(
            "(max-width: 767px)"
        );


    const shell =
        section.querySelector(
            ".services-shell"
        );


    const stage =
        section.querySelector(
            ".services-stage"
        );


    const frame =
        section.querySelector(
            ".services-frame"
        );


    const leftHalf =
        section.querySelector(
            ".services-half--left"
        );


    const rightHalf =
        section.querySelector(
            ".services-half--right"
        );


    const leftImage =
        leftHalf
            ? leftHalf.querySelector("img")
            : null;


    const rightImage =
        rightHalf
            ? rightHalf.querySelector("img")
            : null;


    const flow =
        section.querySelector(
            ".services-flow"
        );


    const imageStage =
        section.querySelector(
            ".services-image-stage"
        );


    const servicesLabel =
        section.querySelector(
            ".services-label"
        );


    const serviceImages =
        Array.from(
            section.querySelectorAll(
                ".services-current-image"
            )
        );


    const serviceBlocks =
        Array.from(
            section.querySelectorAll(
                ".service-block"
            )
        );


    if (
        !shell ||
        !stage ||
        !frame ||
        !leftHalf ||
        !rightHalf ||
        !leftImage ||
        !rightImage ||
        !flow ||
        !imageStage ||
        !servicesLabel ||
        !serviceImages.length ||
        !serviceBlocks.length
    ) {
        return;
    }


    /* =====================================================
       HELPERS
    ===================================================== */

    function clamp(
        value,
        min,
        max
    ) {

        return Math.max(
            min,
            Math.min(
                max,
                value
            )
        );

    }


    function smooth(value) {

        value =
            clamp(
                value,
                0,
                1
            );


        return (
            value *
            value *
            (
                3 -
                2 * value
            )
        );

    }


    function cssPixels(name) {

        const value =
            getComputedStyle(section)
                .getPropertyValue(name)
                .trim();


        if (
            value.endsWith("vh")
        ) {

            const viewportHeight =
                mobileLayout.matches
                    ? getMobileViewportHeight()
                    : window.innerHeight;


            return (
                parseFloat(value) *
                viewportHeight /
                100
            );

        }


        if (
            value.endsWith("vw")
        ) {

            return (
                parseFloat(value) *
                window.innerWidth /
                100
            );

        }


        return (
            parseFloat(value) ||
            0
        );

    }


    function cssNumber(name) {

        const value =
            getComputedStyle(section)
                .getPropertyValue(name)
                .trim();


        return (
            parseFloat(value) ||
            0
        );

    }


    /* =====================================================
       HEADER SPACE
    ===================================================== */

    function updateHeaderSpace() {

        const header =
            document.querySelector(
                ".offform-header"
            );


        const extraGap =
            cssPixels(
                "--services-header-gap"
            );


        let headerBottom =
            0;


        if (header) {

            const headerRect =
                header.getBoundingClientRect();


            headerBottom =
                Math.max(
                    0,
                    headerRect.bottom
                );

        }


        section.style.setProperty(
            "--services-top",
            (
                headerBottom +
                extraGap
            ) +
            "px"
        );

    }


    /* =====================================================
       SCROLL VALUES
    ===================================================== */

    let shellTop =
        0;


    let holdDistance =
        0;


    let splitDistance =
        1;


    let itemDistance =
        1;


    let imageEntryStart =
        0.60;


    let textDelayDistance =
        0;


    let exitCloseDistance =
        1;


    let maxTravel =
        0;


    let entryParallax =
        0;


    let exitParallax =
        0;


    let imageSwapDistance =
        1;


    /*
     * MOBILE ONLY — LOCK THE VIEWPORT GEOMETRY.
     * Real mobile browsers change window.innerHeight when the address bar
     * shows / hides. If all vh distances are recalculated during that change,
     * reversing direction can visibly jump. We lock one stable viewport
     * height for the whole sticky sequence and keep it until a real
     * orientation / width change.
     */
    let mobileLockedViewportHeight =
        0;


    let mobileLockedViewportWidth =
        0;


    function getMobileViewportHeight() {

        if (!mobileLayout.matches) {

            return window.innerHeight;

        }


        if (
            !mobileLockedViewportHeight ||
            !mobileLockedViewportWidth
        ) {

            mobileLockedViewportHeight =
                window.innerHeight;


            mobileLockedViewportWidth =
                window.innerWidth;

        }


        return mobileLockedViewportHeight;

    }


    /* =====================================================
       MEASURE
    ===================================================== */

    function measure() {

        updateHeaderSpace();


        const scrollY =
            window.scrollY ||
            window.pageYOffset;


        shellTop =
            shell
                .getBoundingClientRect()
                .top +
            scrollY;


        holdDistance =
            Math.max(
                0,
                cssPixels(
                    "--services-hold-distance"
                )
            );


        splitDistance =
            Math.max(
                1,
                cssPixels(
                    "--services-split-distance"
                )
            );


        itemDistance =
            Math.max(
                1,
                cssPixels(
                    "--services-item-distance"
                )
            );


        imageSwapDistance =
            Math.max(
                1,
                cssPixels(
                    "--service-image-swap-distance"
                )
            );


        imageEntryStart =
            clamp(
                cssNumber(
                    "--services-image-entry-start"
                ),
                0,
                0.95
            );


        textDelayDistance =
            Math.max(
                0,
                cssPixels(
                    "--services-text-delay-distance"
                )
            );
        exitCloseDistance =
            Math.max(
                1,
                cssPixels(
                    "--services-exit-close-distance"
                )
            );


        entryParallax =
            Math.max(
                0,
                cssPixels(
                    "--services-entry-parallax"
                )
            );


        exitParallax =
            Math.max(
                0,
                cssPixels(
                    "--services-exit-parallax"
                )
            );


        const edgeVisible =
            Math.max(
                0,
                cssPixels(
                    "--services-edge-visible"
                )
            );


        const frameWidth =
            frame.offsetWidth;


        const halfWidth =
            frameWidth /
            2;


        maxTravel =
            Math.max(
                0,
                halfWidth -
                edgeVisible
            );


        update();

    }


    /* =====================================================
       SERVICE IMAGE TRANSITIONS
       SCROLL-LINKED CROSSFADE — NO MOVEMENT, NO SRC JUMP
    ===================================================== */

    function updateServiceImages(textScroll) {

        const transitionProgress = [];


        for (
            let index = 1;
            index < serviceImages.length;
            index++
        ) {

            const boundary =
                index *
                itemDistance;


            const transitionStart =
                boundary -
                (
                    imageSwapDistance /
                    2
                );


            const rawProgress =
                (
                    textScroll -
                    transitionStart
                ) /
                imageSwapDistance;


            transitionProgress[index] =
                smooth(
                    clamp(
                        rawProgress,
                        0,
                        1
                    )
                );

        }


        serviceImages.forEach(
            function (
                image,
                index
            ) {

                let opacity = 0;


                if (index === 0) {

                    opacity =
                        1 -
                        (
                            transitionProgress[1] ||
                            0
                        );

                }

                else if (
                    index ===
                    serviceImages.length - 1
                ) {

                    opacity =
                        transitionProgress[index] ||
                        0;

                }

                else {

                    const enter =
                        transitionProgress[index] ||
                        0;


                    const leave =
                        transitionProgress[index + 1] ||
                        0;


                    opacity =
                        enter *
                        (1 - leave);

                }


                image.style.opacity =
                    clamp(
                        opacity,
                        0,
                        1
                    ).toFixed(3);

            }
        );

    }


    /* =====================================================
       TEXT SPLIT AROUND IMAGE
    ===================================================== */

    function updateTextSplit() {

        const imageRect =
            imageStage.getBoundingClientRect();


        const labelRect =
            servicesLabel.getBoundingClientRect();


        /*
         * COPY + SERVICE TITLES avoid the complete visual unit:
         * SERVICES label + gap + image.
         * Both the regular copy rows and the titles split into
         * left/right halves while crossing the obstacle, then
         * close back together only after passing above SERVICES.
         */
        const obstacleTop =
            Math.min(
                labelRect.top,
                imageRect.top
            );


        const obstacleBottom =
            imageRect.bottom;


        const styles =
            getComputedStyle(section);


        const clearance =
            parseFloat(
                styles.getPropertyValue(
                    "--service-image-clearance"
                )
            ) ||
            35;


        const avoidDistance =
            parseFloat(
                styles.getPropertyValue(
                    "--service-avoid-distance"
                )
            ) ||
            100;


        const targetLeft =
            imageRect.left -
            clearance;


        const targetRight =
            imageRect.right +
            clearance;


        const lines =
            section.querySelectorAll(
                ".service-line, .service-title-line"
            );


        lines.forEach(
            function (line) {

                const leftText =
                    line.querySelector(
                        ".service-text-half--left"
                    );


                const rightText =
                    line.querySelector(
                        ".service-text-half--right"
                    );


                if (
                    !leftText ||
                    !rightText
                ) {
                    return;
                }


                line.style.setProperty(
                    "--left-shift",
                    "0px"
                );


                line.style.setProperty(
                    "--right-shift",
                    "0px"
                );


                const lineRect =
                    line.getBoundingClientRect();


                const leftRect =
                    leftText.getBoundingClientRect();


                const rightRect =
                    rightText.getBoundingClientRect();


                const lineCenterY =
                    lineRect.top +
                    lineRect.height /
                    2;


                let influence =
                    0;


                /* BELOW IMAGE */

                if (
                    lineCenterY >
                    obstacleBottom
                ) {

                    const distance =
                        lineCenterY -
                        obstacleBottom;


                    if (
                        distance <
                        avoidDistance
                    ) {

                        influence =
                            smooth(
                                1 -
                                (
                                    distance /
                                    avoidDistance
                                )
                            );

                    }

                }


                /* BESIDE IMAGE */

                else if (
                    lineCenterY >=
                    obstacleTop &&
                    lineCenterY <=
                    obstacleBottom
                ) {

                    influence =
                        1;

                }


                /* ABOVE IMAGE */

                else {

                    const distance =
                        obstacleTop -
                        lineCenterY;


                    if (
                        distance <
                        avoidDistance
                    ) {

                        influence =
                            smooth(
                                1 -
                                (
                                    distance /
                                    avoidDistance
                                )
                            );

                    }

                }


                const leftStyle =
                    getComputedStyle(
                        leftText
                    );


                const rightStyle =
                    getComputedStyle(
                        rightText
                    );


                const leftPadding =
                    parseFloat(
                        leftStyle.paddingRight
                    ) ||
                    0;


                const rightPadding =
                    parseFloat(
                        rightStyle.paddingLeft
                    ) ||
                    0;


                const realLeftEdge =
                    leftRect.right -
                    leftPadding;


                const realRightEdge =
                    rightRect.left +
                    rightPadding;


                const neededLeftShift =
                    Math.max(
                        0,
                        realLeftEdge -
                        targetLeft
                    );


                const neededRightShift =
                    Math.max(
                        0,
                        targetRight -
                        realRightEdge
                    );


                const finalLeftShift =
                    neededLeftShift *
                    influence;


                const finalRightShift =
                    neededRightShift *
                    influence;


                line.style.setProperty(
                    "--left-shift",
                    finalLeftShift.toFixed(2) +
                    "px"
                );


                line.style.setProperty(
                    "--right-shift",
                    finalRightShift.toFixed(2) +
                    "px"
                );

            }
        );

    }


    /* =====================================================
       SERVICES FLOW
    ===================================================== */

    function updateServicesFlow(
        scrollY,
        splitLinearProgress
    ) {

        /*
         * פתיחת התמונה הגדולה מתחילה כאן.
         */
        const splitStart =
            shellTop +
            holdDistance;


        /*
         * התמונה הקטנה לא מחכה לסוף.
         * היא מתחילה בחלק מתקדם של הפתיחה.
         */
        const smallImageStart =
            splitStart +
            (
                splitDistance *
                imageEntryStart
            );


        /*
         * והיא חייבת להגיע למרכז בדיוק
         * כשהתמונה הגדולה מסיימת להיפתח.
         */
        const smallImageEnd =
            splitStart +
            splitDistance;


        /*
         * הטקסט מתחיל רק אחרי שהשתיים
         * הגיעו יחד למיקום הסופי שלהן.
         */
        const textStart =
            smallImageEnd +
            textDelayDistance;


        /*
         * סוף תנועת שלושת ה-Services.
         * רק אחרי שהאחרון עבר, מתחיל רצף הסגירה.
         */
        const textEnd =
            textStart +
            (
                itemDistance *
                serviceBlocks.length
            );


        const exitCloseStart =
            textEnd;


        const exitCloseEnd =
            exitCloseStart +
            exitCloseDistance;


        /* =================================================
           BEFORE SMALL IMAGE ENTRY
        ================================================= */

        if (
            scrollY <
            smallImageStart
        ) {

            /*
             * MOBILE ONLY:
             * keep the SERVICES flow layer alive BEFORE the small image
             * starts revealing. Toggling visibility exactly at the first
             * reveal frame was forcing a new compositing / paint step and
             * producing the visible "jump" in both scroll directions.
             *
             * Desktop keeps the original visibility behavior.
             */
            flow.style.visibility =
                mobileLayout.matches
                    ? "visible"
                    : "hidden";

            imageStage.style.clipPath =
                "inset(0 0 100% 0)";

            servicesLabel.style.clipPath =
                "inset(0 0 100% 0)";


            /*
             * Because the mobile flow now stays alive, keep all text
             * safely parked off-screen until its own timeline begins.
             */
            if (mobileLayout.matches) {

                serviceBlocks.forEach(
                    function (block) {

                        const title =
                            block.querySelector(
                                ".service-title"
                            );


                        const copy =
                            block.querySelector(
                                ".service-copy"
                            );


                        if (title) {
                            title.style.top =
                                "200vh";
                        }


                        if (copy) {
                            copy.style.top =
                                "200vh";
                        }

                    }
                );

            }

            return;
        }


        flow.style.visibility =
            "visible";


        /* =================================================
           SMALL IMAGE REVEALS TOP → BOTTOM
           DURING LARGE IMAGE SPLIT
        ================================================= */

        const imageEntryRaw =
            (
                scrollY -
                smallImageStart
            ) /
            Math.max(
                1,
                smallImageEnd -
                smallImageStart
            );


        const imageEntryProgress =
            smooth(
                clamp(
                    imageEntryRaw,
                    0,
                    1
                )
            );


        /*
         * התמונה כבר יושבת במיקום הסטיקי שלה.
         * במקום Fade In, היא נחשפת מלמעלה למטה.
         */
        imageStage.style.top =
            "50%";


        const entryClip =
            "inset(0 0 " +
            (
                (1 - imageEntryProgress) * 100
            ).toFixed(3) +
            "% 0)";


        imageStage.style.clipPath =
            entryClip;


        servicesLabel.style.clipPath =
            entryClip;


        /* =================================================
           NO TEXT UNTIL LARGE + SMALL IMAGE BOTH FINISH
        ================================================= */

        if (
            scrollY <
            textStart
        ) {

            serviceImages.forEach(
                function (image, index) {

                    image.style.opacity =
                        index === 0
                            ? "1"
                            : "0";

                }
            );


            serviceBlocks.forEach(
                function (block) {

                    const title =
                        block.querySelector(
                            ".service-title"
                        );


                    const copy =
                        block.querySelector(
                            ".service-copy"
                        );


                    if (title) {

                        title.style.top =
                            "200vh";

                    }


                    if (copy) {

                        copy.style.top =
                            "200vh";

                    }

                }
            );


            return;
        }


        /* =================================================
           SMALL IMAGE IS NOW STICKY IN CENTER
        ================================================= */

        imageStage.style.top =
            "50%";


        /* =================================================
           LAST SMALL IMAGE — EXACT REVERSE REVEAL
           Closing and curtain-close start together.
           The small image closes upward before the
           large image finishes closing, exactly like the
           entrance timeline played backwards.
        ================================================= */

        if (
            scrollY >=
            exitCloseStart
        ) {

            const exitCloseLinearProgress =
                clamp(
                    (
                        scrollY -
                        exitCloseStart
                    ) /
                    Math.max(
                        1,
                        exitCloseDistance
                    ),
                    0,
                    1
                );


            const reverseOpeningProgress =
                1 -
                exitCloseLinearProgress;


            const reverseImageFadeRaw =
                (
                    reverseOpeningProgress -
                    imageEntryStart
                ) /
                Math.max(
                    0.0001,
                    1 -
                    imageEntryStart
                );


            const reverseImageReveal =
                smooth(
                    clamp(
                        reverseImageFadeRaw,
                        0,
                        1
                    )
                );


            const exitClip =
                "inset(0 0 " +
                (
                    (1 - reverseImageReveal) * 100
                ).toFixed(3) +
                "% 0)";


            imageStage.style.clipPath =
                exitClip;


            servicesLabel.style.clipPath =
                exitClip;

        }

        else {

            imageStage.style.clipPath =
                "inset(0 0 0% 0)";


            servicesLabel.style.clipPath =
                "inset(0 0 0% 0)";

        }


        if (
            scrollY >=
            exitCloseEnd
        ) {

            flow.style.visibility =
                "hidden";

        }


        const textScroll =
            scrollY -
            textStart;


        /* =================================================
           ACTIVE SERVICE
        ================================================= */

        updateServiceImages(
            textScroll
        );


        /* =================================================
           TITLE + COPY SCROLL
        ================================================= */

        const styles =
            getComputedStyle(section);


        const titleCopyGap =
            parseFloat(
                styles.getPropertyValue(
                    "--service-title-copy-gap"
                )
            ) ||
            105;


        const titleStartY =
            (
                mobileLayout.matches
                    ? getMobileViewportHeight()
                    : window.innerHeight
            ) +
            80;


        serviceBlocks.forEach(
            function (
                block,
                index
            ) {

                const title =
                    block.querySelector(
                        ".service-title"
                    );


                const copy =
                    block.querySelector(
                        ".service-copy"
                    );


                if (
                    !title ||
                    !copy
                ) {
                    return;
                }


                const blockStart =
                    index *
                    itemDistance;


                const localScroll =
                    textScroll -
                    blockStart;


                const titleY =
                    titleStartY -
                    localScroll;


                const copyY =
                    titleY +
                    titleCopyGap;


                title.style.top =
                    titleY.toFixed(2) +
                    "px";


                copy.style.top =
                    copyY.toFixed(2) +
                    "px";

            }
        );


        updateTextSplit();

    }


    /* =====================================================
       MOBILE PIN ENGINE
       DESKTOP DOES NOT ENTER THIS FUNCTION.
    ===================================================== */

    function updateMobilePin() {

        if (!mobileLayout.matches) {

            stage.classList.remove(
                "services-mobile-pin-engine"
            );

            stage.style.transform = "";

            return;
        }


        const shellRect =
            shell.getBoundingClientRect();


        const mobileStageHeight =
            getMobileViewportHeight();


        /*
         * MOBILE ONLY — NATURAL ENTRY.
         *
         * Before the section reaches the top, the stage stays in its
         * normal absolute position inside the shell. We do NOT turn it
         * into a fixed layer and then translate the whole image upward.
         *
         * Result: when this section follows the previous one, the full
         * image is already sitting exactly at the start of this section.
         * The only entry movement that remains is the existing parallax
         * INSIDE the image itself.
         */
        if (shellRect.top > 0) {

            stage.classList.remove(
                "services-mobile-pin-engine"
            );

            stage.style.transform = "";

            return;
        }


        let mobileStageY = 0;


        /*
         * After the complete sequence is finished:
         * let the stage leave naturally with the bottom of the shell.
         */
        if (
            shellRect.bottom <
            mobileStageHeight
        ) {

            mobileStageY =
                shellRect.bottom -
                mobileStageHeight;

        }


        stage.classList.add(
            "services-mobile-pin-engine"
        );


        stage.style.transform =
            "translate3d(0," +
            mobileStageY.toFixed(2) +
            "px,0)";

    }


    /* =====================================================
       MAIN UPDATE
    ===================================================== */

    function update() {

        updateMobilePin();


        const scrollY =
            window.scrollY ||
            window.pageYOffset;


        /*
         * MOBILE ONLY — ONE CONTINUOUS VISUAL SCROLL TIMELINE.
         *
         * On mobile, browser chrome can make document scrollY and the
         * actually visible position differ by a few pixels between frames.
         * The large-image split used scrollY, which could therefore make
         * the opening appear to jump — especially when reversing direction.
         *
         * We derive the mobile timeline directly from the shell's CURRENT
         * viewport position. Forward and reverse now use the exact same
         * geometry and the exact same equation.
         *
         * Desktop continues to use the original scrollY path unchanged.
         */
        const animationScrollY =
            mobileLayout.matches
                ?
                    (
                        shellTop -
                        shell.getBoundingClientRect().top
                    )
                :
                    scrollY;


        /* =================================================
           ORIGINAL ENTRY PARALLAX
        ================================================= */

        const sectionTopInViewport =
            stage.getBoundingClientRect().top;


        const rawEntryProgress =
            (
                (
                    mobileLayout.matches
                        ? getMobileViewportHeight()
                        : window.innerHeight
                ) -
                sectionTopInViewport
            ) /
            (
                mobileLayout.matches
                    ? getMobileViewportHeight()
                    : window.innerHeight
            );


        const entryProgress =
            smooth(
                clamp(
                    rawEntryProgress,
                    0,
                    1
                )
            );


        const imageEntryTravel =
            entryParallax *
            (
                1 -
                entryProgress
            );


        /* =================================================
           ORIGINAL LARGE IMAGE SPLIT
        ================================================= */

        const splitStart =
            shellTop +
            holdDistance;


        const rawProgress =
            (
                animationScrollY -
                splitStart
            ) /
            splitDistance;


        /*
         * linear version is useful for synchronizing
         * the small image timing.
         */
        const splitLinearProgress =
            clamp(
                rawProgress,
                0,
                1
            );


        const progress =
            smooth(
                splitLinearProgress
            );


        /* =================================================
           LARGE IMAGE EXIT CLOSE — EXACT REVERSE
           Closing starts immediately when the last Service ends.
        ================================================= */

        const textStart =
            splitStart +
            splitDistance +
            textDelayDistance;


        const textEnd =
            textStart +
            (
                itemDistance *
                serviceBlocks.length
            );


        const exitCloseProgress =
            smooth(
                clamp(
                    (
                        animationScrollY -
                        textEnd
                    ) /
                    Math.max(
                        1,
                        exitCloseDistance
                    ),
                    0,
                    1
                )
            );


        /*
         * NO PARALLAX WHILE THE LARGE IMAGE IS CLOSING.
         * During the close, the internal image stays perfectly still.
         *
         * Only AFTER the sticky stage releases and the fully closed
         * section itself begins leaving the viewport do we add the
         * reverse internal parallax.
         */
        const stageRect =
            stage.getBoundingClientRect();


        const stageExitProgress =
            clamp(
                (
                    -stageRect.top
                ) /
                Math.max(
                    1,
                    (
                        mobileLayout.matches
                            ? getMobileViewportHeight()
                            : window.innerHeight
                    )
                ),
                0,
                1
            );


        const imageExitTravel =
            exitParallax *
            smooth(
                stageExitProgress
            );


        /*
         * ENTRY:
         * +parallax -> 0 while the full image arrives.
         *
         * EXIT:
         * 0 -> -parallax only while the already-closed
         * full image leaves the screen.
         */
        const imageTravel =
            exitCloseProgress < 1
                ?
                imageEntryTravel
                :
                -imageExitTravel;


        const imageTransform =
            "translate3d(0," +
            imageTravel.toFixed(2) +
            "px,0)";


        leftImage.style.transform =
            imageTransform;


        rightImage.style.transform =
            imageTransform;


        const travel =
            maxTravel *
            progress *
            (
                1 -
                exitCloseProgress
            );


        leftHalf.style.transform =
            "translate3d(" +
            (-travel).toFixed(2) +
            "px,0,0)";


        rightHalf.style.transform =
            "translate3d(" +
            travel.toFixed(2) +
            "px,0,0)";


        /* =================================================
           SERVICES FLOW
        ================================================= */

        updateServicesFlow(
            animationScrollY,
            splitLinearProgress
        );

    }


    /* =====================================================
       RAF
    ===================================================== */

    let ticking =
        false;


    function requestUpdate() {

        if (ticking) {
            return;
        }


        ticking =
            true;


        requestAnimationFrame(
            function () {

                update();

                ticking =
                    false;

            }
        );

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    window.addEventListener(
        "scroll",
        requestUpdate,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        function () {

            if (mobileLayout.matches) {

                const widthChanged =
                    !mobileLockedViewportWidth ||
                    Math.abs(
                        window.innerWidth -
                        mobileLockedViewportWidth
                    ) > 2;


                /*
                 * Ignore height-only resize events caused by the mobile
                 * browser chrome. They are the main source of forward /
                 * reverse jumps inside a vh-based sticky sequence.
                 */
                if (!widthChanged) {

                    requestUpdate();

                    return;

                }


                mobileLockedViewportHeight =
                    window.innerHeight;


                mobileLockedViewportWidth =
                    window.innerWidth;

            }


            requestAnimationFrame(
                measure
            );

        },
        {
            passive: true
        }
    );


    /* =====================================================
       START
    ===================================================== */

    if (mobileLayout.matches) {

        mobileLockedViewportHeight =
            window.innerHeight;


        mobileLockedViewportWidth =
            window.innerWidth;

    }


    requestAnimationFrame(
        measure
    );


})();;
/* =========================================================
   SERVICES — SMALL IMAGE HOVER WAVE
   SAME BEHAVIOR AS HERO REFERENCE
========================================================= */

(function () {

    const DISTORTION_STRENGTH = 4.5;
    const WAVE_FREQUENCY = 0.045;
    const WAVE_SPEED = 0.13;
    const ORGANIC_AMOUNT = 0.65;
    const FADE_SPEED = 0.14;
    const MOVE_TIMEOUT = 70;


    const desktop =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        );


    if (!desktop.matches) {
        return;
    }


    const section =
        document.querySelector(
            ".services"
        );


    if (!section) {
        return;
    }


    const block =
        section.querySelector(
            ".services-image-stage"
        );


    if (!block) {
        return;
    }


    const images =
        Array.from(
            block.querySelectorAll(
                ".services-current-image"
            )
        );


    const canvas =
        block.querySelector(
            ".services-image-wave"
        );


    if (
        !images.length ||
        !canvas
    ) {
        return;
    }


    const context =
        canvas.getContext(
            "2d"
        );


    if (!context) {
        return;
    }


    const sourceCanvas =
        document.createElement(
            "canvas"
        );


    const sourceContext =
        sourceCanvas.getContext(
            "2d"
        );


    if (!sourceContext) {
        return;
    }


    let mouseY = null;

    let previousX = null;
    let previousY = null;

    let isInside = false;
    let isMoving = false;

    let movementAmount = 0;

    let wavePhase = 0;

    let moveTimer = null;


    /* =====================================================
       SIZE
    ===================================================== */

    function resizeCanvas() {

        const rect =
            block.getBoundingClientRect();


        const width =
            Math.max(
                1,
                Math.round(
                    rect.width
                )
            );


        const height =
            Math.max(
                1,
                Math.round(
                    rect.height
                )
            );


        if (
            canvas.width !== width ||
            canvas.height !== height
        ) {

            canvas.width = width;
            canvas.height = height;

        }


        if (
            sourceCanvas.width !== width ||
            sourceCanvas.height !== height
        ) {

            sourceCanvas.width = width;
            sourceCanvas.height = height;

        }

    }


    /* =====================================================
       CAPTURE CURRENT CROSSFADED IMAGE
    ===================================================== */

    function captureImages() {

        resizeCanvas();


        const width =
            sourceCanvas.width;


        const height =
            sourceCanvas.height;


        sourceContext.clearRect(
            0,
            0,
            width,
            height
        );


        let drewSomething = false;


        images.forEach(
            function (image) {

                if (
                    !image.complete ||
                    image.naturalWidth <= 0 ||
                    image.naturalHeight <= 0
                ) {
                    return;
                }


                const opacity =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            parseFloat(
                                getComputedStyle(image).opacity
                            ) || 0
                        )
                    );


                if (opacity <= 0.001) {
                    return;
                }


                const naturalWidth =
                    image.naturalWidth;


                const naturalHeight =
                    image.naturalHeight;


                const scale =
                    Math.max(
                        width / naturalWidth,
                        height / naturalHeight
                    );


                const sourceWidth =
                    width / scale;


                const sourceHeight =
                    height / scale;


                const sourceX =
                    (
                        naturalWidth -
                        sourceWidth
                    ) / 2;


                const sourceY =
                    (
                        naturalHeight -
                        sourceHeight
                    ) / 2;


                try {

                    sourceContext.save();

                    sourceContext.globalAlpha =
                        opacity;

                    sourceContext.drawImage(
                        image,
                        sourceX,
                        sourceY,
                        sourceWidth,
                        sourceHeight,
                        0,
                        0,
                        width,
                        height
                    );

                    sourceContext.restore();

                    drewSomething = true;

                }

                catch (error) {

                    sourceContext.restore();

                }

            }
        );


        return drewSomething;

    }


    /* =====================================================
       DRAW WAVE
    ===================================================== */

    function drawWave() {

        const width =
            canvas.width;


        const height =
            canvas.height;


        if (
            width <= 0 ||
            height <= 0
        ) {
            return;
        }


        const stripHeight = 2;
        const overlap = 1;


        for (
            let y = 0;
            y < height;
            y += stripHeight
        ) {

            const mainWave =
                Math.sin(
                    y *
                        WAVE_FREQUENCY +
                    wavePhase
                );


            const organicWave =
                Math.sin(
                    y * 0.021 -
                    wavePhase * 1.7
                ) *
                ORGANIC_AMOUNT;


            const mouseInfluence =
                mouseY !== null
                    ? Math.sin(
                        (
                            y -
                            mouseY
                        ) *
                            0.018 +
                        wavePhase *
                            0.65
                    ) *
                        0.35
                    : 0;


            const displacement =
                (
                    mainWave +
                    organicWave +
                    mouseInfluence
                ) *
                DISTORTION_STRENGTH *
                movementAmount;


            const drawHeight =
                Math.min(
                    stripHeight +
                        overlap,
                    height - y
                );


            context.drawImage(
                sourceCanvas,
                0,
                y,
                width,
                drawHeight,
                displacement,
                y,
                width,
                drawHeight
            );


            if (displacement > 0) {

                context.drawImage(
                    sourceCanvas,
                    0,
                    y,
                    1,
                    drawHeight,
                    0,
                    y,
                    displacement + 1,
                    drawHeight
                );

            }


            if (displacement < 0) {

                const gap =
                    Math.abs(
                        displacement
                    );


                context.drawImage(
                    sourceCanvas,
                    Math.max(
                        0,
                        width - 1
                    ),
                    y,
                    1,
                    drawHeight,
                    width -
                        gap -
                        1,
                    y,
                    gap + 1,
                    drawHeight
                );

            }

        }

    }


    /* =====================================================
       MOVEMENT
    ===================================================== */

    function clearMoveTimer() {

        if (moveTimer !== null) {

            clearTimeout(
                moveTimer
            );

            moveTimer = null;

        }

    }


    function registerMovement() {

        isMoving = true;

        clearMoveTimer();

        moveTimer =
            setTimeout(
                function () {

                    moveTimer = null;
                    isMoving = false;

                },
                MOVE_TIMEOUT
            );

    }


    /* =====================================================
       POINTER
    ===================================================== */

    block.addEventListener(
        "mousemove",
        function (event) {

            const rect =
                block.getBoundingClientRect();


            const localX =
                event.clientX -
                rect.left;


            const localY =
                event.clientY -
                rect.top;


            mouseY = localY;


            if (
                previousX !== null &&
                previousY !== null
            ) {

                const dx =
                    localX -
                    previousX;


                const dy =
                    localY -
                    previousY;


                const distance =
                    Math.hypot(
                        dx,
                        dy
                    );


                if (distance > 0.2) {
                    registerMovement();
                }

            }

            else {

                registerMovement();

            }


            previousX = localX;
            previousY = localY;

        },
        {
            passive: true
        }
    );


    block.addEventListener(
        "mouseenter",
        function () {

            isInside = true;

            previousX = null;
            previousY = null;

            movementAmount = 0;

            resizeCanvas();

        }
    );


    block.addEventListener(
        "mouseleave",
        function () {

            isInside = false;
            isMoving = false;

            previousX = null;
            previousY = null;

            mouseY = null;

            clearMoveTimer();

        }
    );


    window.addEventListener(
        "resize",
        resizeCanvas,
        {
            passive: true
        }
    );


    /* =====================================================
       ANIMATION
    ===================================================== */

    function animate() {

        requestAnimationFrame(
            animate
        );


        if (
            !isInside &&
            movementAmount <= 0.001
        ) {

            canvas.style.opacity =
                "0";

            return;

        }


        if (isMoving) {

            movementAmount +=
                (
                    1 -
                    movementAmount
                ) *
                0.45;

        }

        else {

            movementAmount *=
                (
                    1 -
                    FADE_SPEED
                );


            if (movementAmount < 0.01) {
                movementAmount = 0;
            }

        }


        if (movementAmount <= 0) {

            canvas.style.opacity =
                "0";

            context.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            return;

        }


        if (!captureImages()) {
            return;
        }


        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        wavePhase +=
            WAVE_SPEED;


        drawWave();


        canvas.style.opacity =
            "1";

    }


    resizeCanvas();

    requestAnimationFrame(
        animate
    );


})();;
(function () {

    const section =
        document.querySelector(
            ".campaign-selected"
        );


    if (!section) {
        return;
    }


    /*
     * MOBILE-ONLY LAYOUT FLAG.
     * Desktop continues through the original code path unchanged.
     */
    const mobileLayout =
        window.matchMedia(
            "(max-width: 1024px)"
        );


    /* WIDE SCREEN ONLY — same approved reference breakpoint */
    const wideScreenLayout =
        window.matchMedia(
            "(min-width: 1520px)"
        );

    /* DESKTOP ONLY — excludes mobile + tablet */
    const desktopTextFadeLayout =
        window.matchMedia(
            "(min-width: 1025px)"
        );


    const shell =
        section.querySelector(
            ".campaign-selected-shell"
        );


    const stage =
        section.querySelector(
            ".campaign-selected-stage"
        );


    const transition =
        section.querySelector(
            ".campaign-selected-transition"
        );


    const heading =
        section.querySelector(
            ".campaign-selected-heading"
        );


    const headingTitle =
        section.querySelector(
            ".campaign-selected-heading-title"
        );


    const headingLine =
        section.querySelector(
            ".campaign-selected-heading-line"
        );


    const headingView =
        section.querySelector(
            ".campaign-selected-heading-view"
        );


    const headingSquare =
        section.querySelector(
            ".campaign-selected-heading-square"
        );


    const gallery =
        section.querySelector(
            ".campaign-selected-gallery"
        );


    const imagesViewport =
        section.querySelector(
            ".campaign-selected-images"
        );


    /*
     * MOBILE ONLY — ONE SIMPLE ROW ABOVE THE IMAGE:
     * CAMPAIGN NAME LEFT / TALENT NAME RIGHT.
     * Nothing is inserted on desktop.
     */
    let mobileInfoRow = null;
    let mobileInfoName = null;
    let mobileInfoTalent = null;


    if (mobileLayout.matches) {

        mobileInfoRow =
            document.createElement(
                "div"
            );


        mobileInfoRow.className =
            "campaign-selected-mobile-info-row";


        mobileInfoName =
            document.createElement(
                "span"
            );


        mobileInfoName.className =
            "campaign-selected-mobile-info-name";


        mobileInfoTalent =
            document.createElement(
                "span"
            );


        mobileInfoTalent.className =
            "campaign-selected-mobile-info-talent";


        mobileInfoRow.appendChild(
            mobileInfoName
        );


        mobileInfoRow.appendChild(
            mobileInfoTalent
        );


        gallery.insertBefore(
            mobileInfoRow,
            imagesViewport
        );

    }





    const cards =
        Array.from(
            section.querySelectorAll(
                ".campaign-selected-card"
            )
        );


    const progressTrack =
        section.querySelector(
            ".campaign-selected-progress-track"
        );


    const progressSquare =
        section.querySelector(
            ".campaign-selected-info .campaign-selected-progress-square"
        );


    /*
     * MOBILE ONLY — duplicate visual progress bar.
     * Desktop continues using the original progressTrack/progressSquare.
     */
    const mobileProgressTrack =
        section.querySelector(
            ".campaign-selected-mobile-progress .campaign-selected-progress-track"
        );


    const mobileProgressSquare =
        section.querySelector(
            ".campaign-selected-mobile-progress .campaign-selected-progress-square"
        );


    const activeCount =
        section.querySelector(
            ".campaign-selected-active-count"
        );


    const activeInfo =
        section.querySelector(
            ".campaign-selected-active"
        );


    const activeTop =
        section.querySelector(
            ".campaign-selected-active-top"
        );


    const activeMiddle =
        section.querySelector(
            ".campaign-selected-active-middle"
        );


    const activeView =
        section.querySelector(
            ".campaign-selected-view"
        );


    const activeViewLabel =
        activeView
            ?
            activeView.querySelector(
                "span:first-child"
            )
            :
            null;


    const activeViewLine =
        activeView
            ?
            activeView.querySelector(
                ".campaign-selected-view-line"
            )
            :
            null;


    const activeViewSquare =
        activeView
            ?
            activeView.querySelector(
                ".campaign-selected-view-square"
            )
            :
            null;


    const activeBrand =
        section.querySelector(
            ".campaign-selected-active-brand"
        );


    const activeName =
        section.querySelector(
            ".campaign-selected-active-name"
        );


    const activeYear =
        section.querySelector(
            ".campaign-selected-active-year"
        );


    const activeCopy =
        section.querySelector(
            ".campaign-selected-active-copy"
        );


    const activeTalent =
        section.querySelector(
            ".campaign-selected-active-talent-name"
        );


    if (
        !shell ||
        !stage ||
        !transition ||
        !heading ||
        !headingTitle ||
        !headingLine ||
        !headingView ||
        !headingSquare ||
        !gallery ||
        !activeView ||
        !activeViewLabel ||
        !activeViewLine ||
        !activeViewSquare ||
        !cards.length
    ) {

        return;

    }


    /* =====================================================
       GALLERY TIMING
    ===================================================== */

    const HOLD_TIME = 2300;
    const CLOSE_TIME = 950;
    const OPEN_TIME = 950;


    let motionSession = 0;

    let infoFadeTimer = null;
    let infoMiddleTimer = null;


    /* =====================================================
       HELPERS
    ===================================================== */

    const clamp = (
        value,
        min,
        max
    ) => {

        return Math.max(
            min,
            Math.min(
                max,
                value
            )
        );

    };


    const smooth = value => {

        value =
            clamp(
                value,
                0,
                1
            );


        return (
            value *
            value *
            (
                3 -
                2 * value
            )
        );

    };


    const phase = (
        progress,
        start,
        end
    ) => {

        return smooth(
            (
                progress -
                start
            ) /
            (
                end -
                start
            )
        );

    };


    function cssNumber(name) {

        return (
            parseFloat(
                getComputedStyle(section)
                    .getPropertyValue(name)
            ) ||
            0
        );

    }


    function cssPixels(name) {

        const value =
            getComputedStyle(section)
                .getPropertyValue(name)
                .trim();


        if (
            value.endsWith("vh")
        ) {

            const viewportHeight =
                mobileLayout.matches
                    ? getMobileViewportHeight()
                    : window.innerHeight;


            return (
                parseFloat(value) *
                viewportHeight /
                100
            );

        }


        return (
            parseFloat(value) ||
            0
        );

    }


    function wait(ms) {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    ms
                )
        );

    }


    function animateClip(
        card,
        from,
        to,
        duration
    ) {

        const session =
            motionSession;


        return new Promise(
            resolve => {

                const start =
                    performance.now();


                function frame(now) {

                    if (
                        session !== motionSession
                    ) {

                        resolve();
                        return;

                    }


                    const progress =
                        clamp(
                            (
                                now -
                                start
                            ) /
                            duration,
                            0,
                            1
                        );


                    const eased =
                        smooth(
                            progress
                        );


                    const value =
                        from +
                        (
                            to -
                            from
                        ) *
                        eased;


                    const clip =
                        "inset(0 0 0 " +
                        value.toFixed(3) +
                        "%)";


                    card.style.clipPath =
                        clip;


                    card.style.webkitClipPath =
                        clip;


                    if (
                        progress < 1
                    ) {

                        requestAnimationFrame(
                            frame
                        );

                    }

                    else {

                        resolve();

                    }

                }


                requestAnimationFrame(
                    frame
                );

            }
        );

    }


    /* =====================================================
       ACTIVE CAMPAIGN
    ===================================================== */

    let activeIndex = 0;


    let progressAnimationFrame = null;


    function setProgressPosition(
        index,
        duration
    ) {

        if (
            !progressTrack ||
            !progressSquare ||
            cards.length <= 1
        ) {
            return;
        }


        /*
         * MOBILE ONLY — mirror the desktop progress position
         * onto the mobile progress square.
         */
        const syncMobileProgress = function (position) {

            if (
                !mobileLayout.matches ||
                !mobileProgressTrack ||
                !mobileProgressSquare
            ) {
                return;
            }


            mobileProgressSquare.dataset.position =
                String(position);


            mobileProgressSquare.style.left =
                (
                    position * 100
                ).toFixed(3) +
                "%";

        };


        const target =
            clamp(
                index /
                (
                    cards.length - 1
                ),
                0,
                1
            );


        const startLeft =
            parseFloat(
                progressSquare.dataset.position ||
                "0"
            );


        if (
            !duration ||
            duration <= 0
        ) {

            progressSquare.dataset.position =
                String(target);


            progressSquare.style.left =
                (
                    target * 100
                ).toFixed(3) +
                "%";


            syncMobileProgress(
                target
            );


            return;
        }


        if (progressAnimationFrame) {

            cancelAnimationFrame(
                progressAnimationFrame
            );

            progressAnimationFrame =
                null;

        }


        const session =
            motionSession;


        const startTime =
            performance.now();


        function animateProgress(now) {

            if (
                session !== motionSession
            ) {

                progressAnimationFrame =
                    null;

                return;

            }


            const progress =
                clamp(
                    (
                        now -
                        startTime
                    ) /
                    duration,
                    0,
                    1
                );


            const eased =
                smooth(progress);


            const current =
                startLeft +
                (
                    target -
                    startLeft
                ) *
                eased;


            progressSquare.dataset.position =
                String(current);


            progressSquare.style.left =
                (
                    current * 100
                ).toFixed(3) +
                "%";


            syncMobileProgress(
                current
            );


            if (
                progress < 1
            ) {

                progressAnimationFrame =
                    requestAnimationFrame(
                        animateProgress
                    );

            }

            else {

                progressAnimationFrame =
                    null;

            }

        }


        progressAnimationFrame =
            requestAnimationFrame(
                animateProgress
            );

    }


    function updateInfo(index) {

        const card =
            cards[index];


        if (!card) {
            return;
        }


        if (activeCount) {

            activeCount.textContent =
                String(
                    index + 1
                ).padStart(
                    2,
                    "0"
                ) +
                " / " +
                String(
                    cards.length
                ).padStart(
                    2,
                    "0"
                );

        }


        if (activeBrand) {

            activeBrand.textContent =
                card.dataset.brand ||
                "";

        }


        if (activeName) {

            activeName.textContent =
                card.dataset.name ||
                "";

        }


        if (activeYear) {

            activeYear.textContent =
                card.dataset.year ||
                "";

        }


        if (activeCopy) {

            activeCopy.textContent =
                card.dataset.copy ||
                "";

        }


        if (activeTalent) {

            activeTalent.textContent =
                card.dataset.talent ||
                "";

        }


        /*
         * MOBILE ONLY — MINIMAL IMAGE INFO.
         */
        if (
            mobileLayout.matches &&
            mobileInfoName &&
            mobileInfoTalent
        ) {

            mobileInfoName.textContent =
                card.dataset.name ||
                "";


            mobileInfoTalent.textContent =
                card.dataset.talent ||
                "";

        }

    }


    function setActiveCard(index) {

        cards.forEach(
            function (card, cardIndex) {

                card.classList.toggle(
                    "is-active",
                    cardIndex === index
                );

            }
        );


        activeIndex =
            index;


        if (
            activeTop &&
            activeMiddle
        ) {

            if (desktopTextFadeLayout.matches) {

                /*
                 * DESKTOP ONLY:
                 * Pure fade-out / fade-in.
                 * No translate, no movement, no blur.
                 * TALENT label + square stay fixed.
                 */
                if (activeBrand) {
                    activeBrand.style.opacity = "0";
                }

                if (activeName) {
                    activeName.style.opacity = "0";
                }

                if (activeYear) {
                    activeYear.style.opacity = "0";
                }

                if (activeCopy) {
                    activeCopy.style.opacity = "0";
                }

                if (activeTalent) {
                    activeTalent.style.opacity = "0";
                }

            }
            else {

                /* MOBILE + TABLET — original behavior unchanged */
                activeTop.style.opacity =
                    "0";

                if (mobileLayout.matches) {
                    activeMiddle.style.opacity = "0";
                }
                else {
                    activeMiddle.style.opacity = "1";

                    if (activeCopy) {
                        activeCopy.style.opacity = "0";
                    }

                    if (activeTalent) {
                        activeTalent.style.opacity = "0";
                    }
                }

            }


            if (infoFadeTimer !== null) {

                clearTimeout(
                    infoFadeTimer
                );

            }


            if (infoMiddleTimer !== null) {

                clearTimeout(
                    infoMiddleTimer
                );

            }


            const session =
                motionSession;


            infoFadeTimer =
                window.setTimeout(
                    function () {

                        infoFadeTimer =
                            null;


                        if (
                            session !== motionSession
                        ) {
                            return;
                        }


                        updateInfo(
                            index
                        );


                        if (desktopTextFadeLayout.matches) {

                            /* NEW TEXT — fade back in at the exact same position */
                            if (activeBrand) {
                                activeBrand.style.opacity = "1";
                            }

                            if (activeName) {
                                activeName.style.opacity = "1";
                            }

                            if (activeYear) {
                                activeYear.style.opacity = "0.60";
                            }

                            if (activeCopy) {
                                activeCopy.style.opacity = "0.75";
                            }

                            if (activeTalent) {
                                activeTalent.style.opacity = "1";
                            }

                        }
                        else {

                            activeTop.style.opacity =
                                "1";


                            infoMiddleTimer =
                                window.setTimeout(
                                    function () {

                                        infoMiddleTimer =
                                            null;


                                        if (
                                            session !== motionSession
                                        ) {
                                            return;
                                        }


                                        activeMiddle.style.opacity =
                                            "1";

                                        if (!mobileLayout.matches) {
                                            if (activeCopy) {
                                                activeCopy.style.opacity = "0.75";
                                            }

                                            if (activeTalent) {
                                                activeTalent.style.opacity = "1";
                                            }
                                        }

                                    },
                                    90
                                );

                        }

                    },
                    desktopTextFadeLayout.matches
                        ? 650
                        : 280
                );

        }

        else {

            updateInfo(
                index
            );

        }


        setProgressPosition(
            index,
            OPEN_TIME
        );

    }


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    cards.forEach(
        function (card, index) {

            const clip =
                index === 0
                    ? "inset(0 0 0 100%)"
                    : "inset(0 0 0 100%)";


            card.style.clipPath =
                clip;


            card.style.webkitClipPath =
                clip;

        }
    );


    updateInfo(
        0
    );


    activeIndex =
        0;


    if (activeInfo) {

        activeInfo.style.opacity =
            "1";

    }


    if (activeTop) {

        activeTop.style.opacity =
            "1";

    }


    if (activeMiddle) {

        activeMiddle.style.opacity =
            "1";

    }


    setProgressPosition(
        0,
        0
    );


    /* =====================================================
       TIMED GALLERY
    ===================================================== */

    let galleryRunning = false;

    let gallerySession = 0;

    let galleryPaused = false;

    let galleryExitRequested = false;


    async function runGallery(session) {

        while (
            galleryRunning &&
            session === gallerySession
        ) {

            while (
                galleryPaused &&
                !galleryExitRequested &&
                galleryRunning &&
                session === gallerySession
            ) {

                await wait(
                    80
                );

            }


            if (
                !galleryRunning ||
                session !== gallerySession
            ) {
                return;
            }


            /*
             * SAFE STOP:
             * At this point the current card is fully open.
             * If the section has started releasing, stop here.
             */
            if (galleryExitRequested) {

                galleryRunning =
                    false;

                return;

            }


            await wait(
                HOLD_TIME
            );


            if (
                !galleryRunning ||
                session !== gallerySession
            ) {
                return;
            }


            /*
             * If exit happened during the HOLD,
             * the current image is still fully open,
             * so stop immediately without starting a close.
             */
            if (galleryExitRequested) {

                galleryRunning =
                    false;

                return;

            }


            if (galleryPaused) {
                continue;
            }


            const currentCard =
                cards[activeIndex];


            /*
             * Once this close begins, we must finish the
             * current transition all the way to a fully open
             * next image, even if the section starts exiting.
             */
            await animateClip(
                currentCard,
                0,
                100,
                CLOSE_TIME
            );


            if (
                !galleryRunning ||
                session !== gallerySession
            ) {
                return;
            }


            const nextIndex =
                (
                    activeIndex + 1
                ) %
                cards.length;


            setActiveCard(
                nextIndex
            );


            const nextCard =
                cards[nextIndex];


            nextCard.style.clipPath =
                "inset(0 0 0 100%)";


            nextCard.style.webkitClipPath =
                "inset(0 0 0 100%)";


            await animateClip(
                nextCard,
                100,
                0,
                OPEN_TIME
            );


            if (
                !galleryRunning ||
                session !== gallerySession
            ) {
                return;
            }


            /*
             * The new image is now fully open.
             * If exit was requested anywhere during the
             * close/open transition, stop exactly here.
             */
            if (galleryExitRequested) {

                galleryRunning =
                    false;

                return;

            }

        }

    }


    function startGallery() {

        if (galleryRunning) {
            return;
        }


        galleryExitRequested =
            false;


        galleryRunning =
            true;


        gallerySession += 1;


        runGallery(
            gallerySession
        );

    }


    function stopGallery() {

        if (!galleryRunning) {
            return;
        }


        galleryRunning =
            false;


        gallerySession += 1;

    }


    function stopAllMotion() {

        stopGallery();


        motionSession += 1;


        if (progressAnimationFrame) {

            cancelAnimationFrame(
                progressAnimationFrame
            );

            progressAnimationFrame =
                null;

        }


        if (infoFadeTimer !== null) {

            clearTimeout(
                infoFadeTimer
            );

            infoFadeTimer =
                null;

        }


        if (infoMiddleTimer !== null) {

            clearTimeout(
                infoMiddleTimer
            );

            infoMiddleTimer =
                null;

        }

    }


    function requestStopAtFullState() {

        galleryExitRequested =
            true;


        /*
         * Do not cancel clip / text / progress mid-animation.
         * The current transition is allowed to finish,
         * then runGallery stops at the next fully open card.
         */

    }


    /* =====================================================
       PAUSE ON IMAGE HOVER
    ===================================================== */

    if (imagesViewport) {

        imagesViewport.addEventListener(
            "mouseenter",
            function () {

                galleryPaused =
                    true;

            }
        );


        imagesViewport.addEventListener(
            "mouseleave",
            function () {

                galleryPaused =
                    false;

            }
        );


        /*
         * MOBILE ONLY — HOLD THE IMAGE TO PAUSE.
         * Touch down pauses the timed gallery.
         * Releasing the finger resumes it immediately.
         * Desktop behavior remains unchanged.
         */
        imagesViewport.addEventListener(
            "touchstart",
            function () {

                if (!mobileLayout.matches) {
                    return;
                }


                galleryPaused =
                    true;

            },
            {
                passive: true
            }
        );


        imagesViewport.addEventListener(
            "touchend",
            function () {

                if (!mobileLayout.matches) {
                    return;
                }


                galleryPaused =
                    false;

            },
            {
                passive: true
            }
        );


        imagesViewport.addEventListener(
            "touchcancel",
            function () {

                if (!mobileLayout.matches) {
                    return;
                }


                galleryPaused =
                    false;

            },
            {
                passive: true
            }
        );

    }


    /* =====================================================
       STICKY STATE
    ===================================================== */

    let stickyStart = 0;
    let stickyDistance = 1;

    let headingTitleWidth = 0;
    let headingViewWidth = 0;
    let headingWidth = 0;

    let headingSquareSize = 7;
    let headingSideGap = 8;
    let headingLineTitleGap = 8;
    let headingLineButtonGap = 8;

    let headingLineStickyStart =
        null;


    /*
     * MOBILE ONLY — keep one stable viewport height while browser
     * chrome opens/closes, so the pin does not jump.
     */
    let mobileViewportHeight =
        0;


    let mobileViewportWidth =
        0;


    function getMobileViewportHeight() {

        if (!mobileLayout.matches) {
            return window.innerHeight;
        }


        if (!mobileViewportHeight) {

            mobileViewportHeight =
                window.innerHeight;

        }


        return mobileViewportHeight;

    }


    let activeViewLabelWidth = 0;
    let activeViewFinalLineWidth = 0;
    let activeViewSquareSize = 7;
    let activeViewSquareStartY = 0;
    let activeViewSquareFinalY = 0;
    let activeViewSquareSideGap = 8;


    /* =====================================================
       MEASURE
    ===================================================== */

    function measure() {

        const scrollY =
            window.scrollY ||
            window.pageYOffset;


        stickyStart =
            shell
                .getBoundingClientRect()
                .top +
            scrollY;


        stickyDistance =
            Math.max(
                1,
                cssPixels(
                    "--campaign-sticky-distance"
                )
            );


        headingTitleWidth =
            headingTitle.offsetWidth;


        headingViewWidth =
            headingView.offsetWidth;


        headingWidth =
            heading.offsetWidth;


        headingSquareSize =
            cssNumber(
                "--campaign-heading-square-size"
            ) ||
            7;


        headingSideGap =
            cssNumber(
                "--campaign-heading-square-gap"
            ) ||
            8;


        headingLineTitleGap =
            cssNumber(
                "--campaign-heading-line-title-gap"
            ) ||
            8;


        headingLineButtonGap =
            cssNumber(
                "--campaign-heading-line-button-gap"
            ) ||
            8;


        headingLineStickyStart =
            null;


        /* VIEW CAMPAIGN */

        activeViewLabelWidth =
            activeViewLabel.offsetWidth;


        activeViewSquareSize =
            cssNumber(
                "--campaign-view-square-size"
            ) ||
            7;


        activeViewSquareSideGap =
            cssNumber(
                "--campaign-view-square-side-gap"
            ) ||
            8;


        /*
         * TRUE VERTICAL GEOMETRY — NO GUESSED PIXEL VALUE.
         *
         * START:
         * the TOP edge of the square sits exactly on the line.
         *
         * FINAL:
         * the CENTER of the square sits exactly on the center
         * of the VIEW CAMPAIGN text row.
         */
        const activeViewHeight =
            activeView.offsetHeight;


        const activeViewCenterY =
            activeViewHeight /
            2;


        const activeViewLineY =
            activeViewLine.offsetTop;


        const activeViewLabelCenterY =
            activeViewLabel.offsetTop +
            (
                activeViewLabel.offsetHeight /
                2
            );


        activeViewSquareStartY =
            activeViewLineY -
            activeViewCenterY +
            (
                activeViewSquareSize /
                2
            );


        activeViewSquareFinalY =
            activeViewLabelCenterY -
            activeViewCenterY;


        activeViewFinalLineWidth =
            activeViewLabelWidth +
            activeViewSquareSideGap +
            activeViewSquareSize;


        /*
         * Keep the whole finished visual area hoverable, including
         * the extra 8px hover travel.
         */
        activeView.style.setProperty(
            "--campaign-view-hit-width",
            (
                activeViewFinalLineWidth +
                8
            ) +
            "px"
        );


        setProgressPosition(
            activeIndex,
            0
        );


        updateScroll();

    }


    /* =====================================================
       MOBILE — TRUE SECTION PIN
       The whole 100VH stage enters, locks to the viewport,
       the SELECTED CAMPAIGNS line builds during stickyDistance,
       and only when that distance ends does the stage release.
       Desktop never enters this branch.
    ===================================================== */

    function updateMobilePin() {

        if (!mobileLayout.matches) {

            stage.classList.remove(
                "campaign-selected-mobile-pin"
            );

            stage.style.transform = "";

            return;
        }


        const shellRect =
            shell.getBoundingClientRect();


        const viewportHeight =
            getMobileViewportHeight();


        let stageY =
            0;


        /*
         * BEFORE PIN:
         * the complete 100vh section travels naturally into view.
         */
        if (shellRect.top > 0) {

            stageY =
                shellRect.top;

        }

        /*
         * AFTER THE TOP LINE HAS COMPLETED ITS STICKY RANGE:
         * release the complete section and let it leave naturally.
         */
        else if (
            shellRect.bottom <
            viewportHeight
        ) {

            stageY =
                shellRect.bottom -
                viewportHeight;

        }


        stage.classList.add(
            "campaign-selected-mobile-pin"
        );


        stage.style.transform =
            "translate3d(0," +
            stageY.toFixed(2) +
            "px,0)";

    }


    /* =====================================================
       SCROLL
    ===================================================== */

    function updateScroll() {

        updateMobilePin();


        const scrollY =
            window.scrollY ||
            window.pageYOffset;


        const stageRect =
            stage.getBoundingClientRect();


        const stickyProgress =
            clamp(
                (
                    scrollY -
                    stickyStart
                ) /
                stickyDistance,
                0,
                1
            );


        /* =================================================
           SECTION / GALLERY ENTRY PROGRESS
        ================================================= */

        const galleryEntryProgress =
            clamp(
                1 -
                (
                    stageRect.top /
                    (
                        mobileLayout.matches
                            ? getMobileViewportHeight()
                            : window.innerHeight
                    )
                ),
                0,
                1
            );


        /* =================================================
           FIRST IMAGE ENTRANCE
        ================================================= */

        if (
            !galleryRunning &&
            activeIndex === 0
        ) {

            const reveal =
                smooth(
                    galleryEntryProgress
                );


            const hiddenLeft =
                (
                    1 -
                    reveal
                ) *
                100;


            const clipValue =
                "inset(0 0 0 " +
                hiddenLeft.toFixed(3) +
                "%)";


            cards[0].style.clipPath =
                clipValue;


            cards[0].style.webkitClipPath =
                clipValue;

        }


        /* =================================================
           START / STOP TIMED GALLERY
        ================================================= */

        const stickyEnd =
            stickyStart +
            stickyDistance;


        const isInsideStickyRange =
            scrollY >= stickyStart &&
            scrollY < stickyEnd;


        if (isInsideStickyRange) {

            galleryExitRequested =
                false;


            if (!galleryRunning) {

                motionSession += 1;


                cards[activeIndex].style.clipPath =
                    "inset(0 0 0 0%)";


                cards[activeIndex].style.webkitClipPath =
                    "inset(0 0 0 0%)";


                startGallery();

            }

        }

        else {

            requestStopAtFullState();

        }


        /* TOP TEXT STOP */

        const transitionBaseTop =
            transition.offsetTop;


        const transitionStopTop =
            cssNumber(
                "--campaign-transition-stop-top"
            );


        let transitionPinY = 0;


        if (
            stageRect.top > 0
        ) {

            const naturalTransitionTop =
                stageRect.top +
                transitionBaseTop;


            transitionPinY =
                Math.max(
                    0,
                    transitionStopTop -
                    naturalTransitionTop
                );

        }

        else {

            transitionPinY =
                Math.max(
                    0,
                    transitionStopTop -
                    transitionBaseTop
                );

        }


        transition.style.transform =
            "translate3d(0," +
            transitionPinY.toFixed(2) +
            "px,0)";


        /* GALLERY STAYS IN PLACE */

        gallery.style.transform =
            "translate3d(0,0,0)";


        /* =================================================
           VIEW CAMPAIGN — BUTTON BUILD

           EXACT ORDER FROM THE ROSTER SWITCH BUTTONS:

           01. SQUARE STARTS BELOW-LEFT.
           02. SQUARE TRAVELS UNDER THE LABEL WHILE LINE OPENS.
           03. SQUARE RISES TO LABEL HEIGHT.
           04. LINE FINISHES ITS LAST PART.

           This is tied only to the section's natural entry.
           Gallery timing and every other sticky behavior stay untouched.
        ================================================= */

        const activeViewRect =
            activeView.getBoundingClientRect();


        /*
         * VIEW CAMPAIGN TIMING
         *
         * START:
         * a little earlier while the button is already entering the viewport.
         *
         * END:
         * exactly when the section reaches its sticky start.
         *
         * This keeps the same button motion itself and changes only
         * the scroll range over which that motion is played.
         */
        const viewButtonStartScroll =
            stickyStart -
            (
                (
                    mobileLayout.matches
                        ? getMobileViewportHeight()
                        : window.innerHeight
                ) *
                0.60
            );


        const viewButtonEndScroll =
            stickyStart;


        const viewButtonProgress =
            clamp(
                (
                    scrollY -
                    viewButtonStartScroll
                ) /
                Math.max(
                    1,
                    viewButtonEndScroll -
                    viewButtonStartScroll
                ),
                0,
                1
            );


        const viewSquareUnderProgress =
            phase(
                viewButtonProgress,
                0.00,
                0.58
            );


        const viewSquareRiseProgress =
            phase(
                viewButtonProgress,
                0.58,
                0.86
            );


        const viewLineFinishProgress =
            phase(
                viewButtonProgress,
                0.58,
                1.00
            );


        const viewFinalSquareX =
            activeViewLabelWidth +
            activeViewSquareSideGap;


        const viewSquareX =
            viewFinalSquareX *
            viewSquareUnderProgress;


        const viewSquareY =
            activeViewSquareStartY +
            (
                activeViewSquareFinalY -
                activeViewSquareStartY
            ) *
            viewSquareRiseProgress;


        activeViewSquare.style.transform =
            "translate3d(" +
            viewSquareX.toFixed(2) +
            "px," +
            viewSquareY.toFixed(2) +
            "px,0) " +
            "translateY(-50%)";


        /*
         * KEEP THE REQUESTED GAP AT THE START OF THE BUILD,
         * BUT PRESERVE THE ORIGINAL FULL FINAL LINE LENGTH.
         *
         * FIRST PHASE:
         * the line follows behind the travelling square with a gap.
         *
         * FINAL PHASE:
         * once the square starts rising, the line continues opening
         * to the exact original final width, so the finished button
         * remains unchanged.
         */
        const viewGapPhaseWidth =
            Math.max(
                0,
                viewSquareX -
                activeViewSquareSideGap
            );


        const viewFinalLineWidth =
            activeViewFinalLineWidth;


        const viewCurrentLineWidth =
            viewGapPhaseWidth +
            (
                viewFinalLineWidth -
                viewGapPhaseWidth
            ) *
            viewLineFinishProgress;


        activeViewLine.style.width =
            Math.max(
                0,
                viewCurrentLineWidth
            ).toFixed(2) +
            "px";


        /* TOP LINE BUILD */

        const lineStart =
            headingTitleWidth +
            headingLineTitleGap;


        const initialLineWidth =
            Math.max(
                0,
                cssNumber(
                    "--campaign-heading-line-initial-width"
                )
            );


        const finalSquareLeft =
            wideScreenLayout.matches
                ? Math.max(
                    0,
                    document.documentElement.clientWidth -
                    heading.getBoundingClientRect().left -
                    20 -
                    headingSquareSize
                )
                : headingWidth -
                  headingSquareSize;


        const finalButtonX =
            finalSquareLeft -
            headingSideGap -
            headingViewWidth;


        const finalLineEnd =
            finalButtonX -
            headingLineButtonGap;


        const maxLineWidth =
            Math.max(
                initialLineWidth,
                finalLineEnd -
                lineStart
            );


        const viewStartX =
            lineStart +
            initialLineWidth +
            headingLineButtonGap;


        if (
            headingLineStickyStart === null &&
            stickyProgress > 0
        ) {

            headingLineStickyStart =
                stickyProgress;

        }


        const lineProgress =
            headingLineStickyStart === null
                ?
                0
                :
                phase(
                    stickyProgress,
                    headingLineStickyStart,
                    1
                );


        const currentLineWidth =
            initialLineWidth +
            (
                maxLineWidth -
                initialLineWidth
            ) *
            lineProgress;


        const currentLineEnd =
            lineStart +
            currentLineWidth;


        const pushedButtonX =
            currentLineEnd +
            headingLineButtonGap;


        const buttonX =
            Math.min(
                finalButtonX,
                Math.max(
                    viewStartX,
                    pushedButtonX
                )
            );


        headingLine.style.left =
            lineStart +
            "px";


        headingLine.style.width =
            currentLineWidth +
            "px";


        headingView.style.transform =
            "translate3d(" +
            buttonX.toFixed(2) +
            "px,0,0)";


        const squareX =
            buttonX +
            headingViewWidth +
            headingSideGap;


        headingSquare.style.left =
            Math.min(
                finalSquareLeft,
                squareX
            ).toFixed(2) +
            "px";


        if (wideScreenLayout.matches) {

            /* WIDE SCREEN ONLY — same approved square alignment as reference */
            headingSquare.style.top = "0px";
            headingSquare.style.transform = "none";

        }
        else {

            headingSquare.style.top = "";
            headingSquare.style.transform = "translateY(-50%)";

        }

    }


    /* =====================================================
       RESET TO FIRST IMAGE WHEN SECTION IS FULLY OFF-SCREEN
    ===================================================== */

    let sectionWasVisible =
        false;


    function resetGalleryToFirstImage() {

        stopAllMotion();


        galleryRunning =
            false;

        gallerySession += 1;

        galleryPaused =
            false;

        galleryExitRequested =
            false;


        activeIndex =
            0;


        cards.forEach(
            function (card, index) {

                card.classList.toggle(
                    "is-active",
                    index === 0
                );


                card.style.clipPath =
                    "inset(0 0 0 100%)";


                card.style.webkitClipPath =
                    "inset(0 0 0 100%)";

            }
        );


        updateInfo(
            0
        );


        if (activeInfo) {

            activeInfo.style.opacity =
                "1";

        }


        if (activeTop) {

            activeTop.style.opacity =
                "1";

        }


        if (activeMiddle) {

            activeMiddle.style.opacity =
                "1";

        }


        setProgressPosition(
            0,
            0
        );

    }


    function updateSectionVisibility() {

        const sectionRect =
            section.getBoundingClientRect();


        const isVisible =
            sectionRect.bottom > 0 &&
            sectionRect.top <
            (
                mobileLayout.matches
                    ? getMobileViewportHeight()
                    : window.innerHeight
            );


        if (
            sectionWasVisible &&
            !isVisible
        ) {

            resetGalleryToFirstImage();

        }


        sectionWasVisible =
            isVisible;

    }


    /* =====================================================
       SCROLL RAF
    ===================================================== */

    let ticking = false;


    window.addEventListener(
        "scroll",
        function () {

            if (ticking) {
                return;
            }


            ticking =
                true;


            requestAnimationFrame(
                function () {

                    updateScroll();

                    updateSectionVisibility();


                    ticking =
                        false;

                }
            );

        },
        {
            passive: true
        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    let resizeTimer =
        null;


    window.addEventListener(
        "resize",
        function () {

            if (mobileLayout.matches) {

                const widthChanged =
                    !mobileViewportWidth ||
                    Math.abs(
                        window.innerWidth -
                        mobileViewportWidth
                    ) > 2;


                /*
                 * Mobile browser chrome changes only the viewport height.
                 * Do not re-measure the whole sticky timeline for that.
                 */
                if (!widthChanged) {

                    updateScroll();

                    return;

                }


                mobileViewportHeight =
                    window.innerHeight;


                mobileViewportWidth =
                    window.innerWidth;

            }


            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        measure();

                    },
                    80
                );

        },
        {
            passive: true
        }
    );


    /* =====================================================
       START
    ===================================================== */

    if (mobileLayout.matches) {

        mobileViewportHeight =
            window.innerHeight;


        mobileViewportWidth =
            window.innerWidth;

    }


    requestAnimationFrame(
        function () {

            requestAnimationFrame(
                function () {

                    measure();

                    updateSectionVisibility();

                }
            );

        }
    );


})();;
/* =========================================================
   OFFFORM — SELECTED CAMPAIGNS IMAGE WAVE
   SAME EFFECT AS HERO REFERENCE
========================================================= */

(function () {


    const section =
        document.querySelector(
            ".campaign-selected"
        );


    if (!section) {
        return;
    }


    const desktop =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        );


    if (!desktop.matches) {
        return;
    }


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (
        reducedMotion.matches &&
        window.innerWidth <= 767
    ) {
        return;
    }


    const DISTORTION_STRENGTH = 4.5;
    const WAVE_FREQUENCY = 0.045;
    const WAVE_SPEED = 0.13;
    const ORGANIC_AMOUNT = 0.65;
    const FADE_SPEED = 0.14;
    const MOVE_TIMEOUT = 70;


    const blocks =
        Array.from(
            section.querySelectorAll(
                ".campaign-selected-media"
            )
        );


    blocks.forEach(
        function (block) {


            const image =
                block.querySelector(
                    "img"
                );


            if (!image) {
                return;
            }


            let canvas =
                block.querySelector(
                    ".campaign-selected-wave"
                );


            if (!canvas) {

                canvas =
                    document.createElement(
                        "canvas"
                    );


                canvas.className =
                    "campaign-selected-wave";


                canvas.setAttribute(
                    "aria-hidden",
                    "true"
                );


                block.appendChild(
                    canvas
                );

            }


            const context =
                canvas.getContext(
                    "2d"
                );


            if (!context) {
                return;
            }


            const sourceCanvas =
                document.createElement(
                    "canvas"
                );


            const sourceContext =
                sourceCanvas.getContext(
                    "2d"
                );


            if (!sourceContext) {
                return;
            }


            let mouseY = null;

            let previousX = null;
            let previousY = null;

            let isInside = false;
            let isMoving = false;

            let movementAmount = 0;

            let wavePhase = 0;

            let moveTimer = null;


            function resizeCanvas() {

                const rect =
                    block.getBoundingClientRect();


                const width =
                    Math.max(
                        1,
                        Math.round(
                            rect.width
                        )
                    );


                const height =
                    Math.max(
                        1,
                        Math.round(
                            rect.height
                        )
                    );


                if (
                    canvas.width !== width ||
                    canvas.height !== height
                ) {

                    canvas.width =
                        width;

                    canvas.height =
                        height;

                }


                if (
                    sourceCanvas.width !== width ||
                    sourceCanvas.height !== height
                ) {

                    sourceCanvas.width =
                        width;

                    sourceCanvas.height =
                        height;

                }

            }


            function valueToFactor(value) {

                if (!value) {
                    return 0.5;
                }


                const normalized =
                    value
                        .trim()
                        .toLowerCase();


                if (
                    normalized === "left" ||
                    normalized === "top"
                ) {
                    return 0;
                }


                if (
                    normalized === "right" ||
                    normalized === "bottom"
                ) {
                    return 1;
                }


                if (
                    normalized === "center"
                ) {
                    return 0.5;
                }


                if (
                    normalized.endsWith("%")
                ) {

                    const number =
                        parseFloat(
                            normalized
                        );


                    if (
                        !Number.isNaN(number)
                    ) {

                        return Math.max(
                            0,
                            Math.min(
                                1,
                                number / 100
                            )
                        );

                    }

                }


                return 0.5;

            }


            function getObjectPosition() {

                const style =
                    getComputedStyle(
                        image
                    );


                const values =
                    (
                        style.objectPosition ||
                        "50% 50%"
                    )
                        .trim()
                        .split(/\s+/);


                let x =
                    values[0] ||
                    "50%";


                let y =
                    values[1] ||
                    "50%";


                if (
                    values.length === 1
                ) {

                    if (
                        x === "top" ||
                        x === "bottom"
                    ) {

                        y = x;
                        x = "center";

                    }

                    else {

                        y = "center";

                    }

                }


                return {

                    x:
                        valueToFactor(x),

                    y:
                        valueToFactor(y)

                };

            }


            function captureImage() {

                resizeCanvas();


                const width =
                    sourceCanvas.width;


                const height =
                    sourceCanvas.height;


                sourceContext.clearRect(
                    0,
                    0,
                    width,
                    height
                );


                if (
                    !image.complete ||
                    image.naturalWidth <= 0 ||
                    image.naturalHeight <= 0
                ) {

                    return false;

                }


                const naturalWidth =
                    image.naturalWidth;


                const naturalHeight =
                    image.naturalHeight;


                const scale =
                    Math.max(

                        width /
                        naturalWidth,

                        height /
                        naturalHeight

                    );


                const sourceWidth =
                    width /
                    scale;


                const sourceHeight =
                    height /
                    scale;


                const position =
                    getObjectPosition();


                const sourceX =
                    (
                        naturalWidth -
                        sourceWidth
                    ) *
                    position.x;


                const sourceY =
                    (
                        naturalHeight -
                        sourceHeight
                    ) *
                    position.y;


                try {

                    sourceContext.drawImage(

                        image,

                        sourceX,
                        sourceY,

                        sourceWidth,
                        sourceHeight,

                        0,
                        0,

                        width,
                        height

                    );


                    return true;

                }

                catch (error) {

                    return false;

                }

            }


            function drawWave() {

                const width =
                    canvas.width;


                const height =
                    canvas.height;


                if (
                    width <= 0 ||
                    height <= 0
                ) {
                    return;
                }


                const stripHeight =
                    2;


                const overlap =
                    1;


                for (
                    let y = 0;
                    y < height;
                    y += stripHeight
                ) {


                    const mainWave =
                        Math.sin(
                            y *
                            WAVE_FREQUENCY +
                            wavePhase
                        );


                    const organicWave =
                        Math.sin(
                            y * 0.021 -
                            wavePhase * 1.7
                        ) *
                        ORGANIC_AMOUNT;


                    const mouseInfluence =
                        mouseY !== null
                            ?
                            Math.sin(
                                (
                                    y -
                                    mouseY
                                ) *
                                0.018 +
                                wavePhase *
                                0.65
                            ) *
                            0.35
                            :
                            0;


                    const displacement =
                        (
                            mainWave +
                            organicWave +
                            mouseInfluence
                        ) *
                        DISTORTION_STRENGTH *
                        movementAmount;


                    const drawHeight =
                        Math.min(
                            stripHeight +
                            overlap,
                            height -
                            y
                        );


                    context.drawImage(
                        sourceCanvas,
                        0,
                        y,
                        width,
                        drawHeight,
                        displacement,
                        y,
                        width,
                        drawHeight
                    );


                    if (
                        displacement > 0
                    ) {

                        context.drawImage(
                            sourceCanvas,
                            0,
                            y,
                            1,
                            drawHeight,
                            0,
                            y,
                            displacement + 1,
                            drawHeight
                        );

                    }


                    if (
                        displacement < 0
                    ) {

                        const gap =
                            Math.abs(
                                displacement
                            );


                        context.drawImage(
                            sourceCanvas,
                            Math.max(
                                0,
                                width - 1
                            ),
                            y,
                            1,
                            drawHeight,
                            width -
                            gap -
                            1,
                            y,
                            gap + 1,
                            drawHeight
                        );

                    }

                }

            }


            function clearMoveTimer() {

                if (
                    moveTimer !== null
                ) {

                    clearTimeout(
                        moveTimer
                    );


                    moveTimer =
                        null;

                }

            }


            function registerMovement() {

                isMoving =
                    true;


                clearMoveTimer();


                moveTimer =
                    setTimeout(
                        function () {

                            moveTimer =
                                null;

                            isMoving =
                                false;

                        },
                        MOVE_TIMEOUT
                    );

            }


            block.addEventListener(
                "mousemove",
                function (event) {

                    const rect =
                        block
                            .getBoundingClientRect();


                    const localX =
                        event.clientX -
                        rect.left;


                    const localY =
                        event.clientY -
                        rect.top;


                    mouseY =
                        localY;


                    if (
                        previousX !== null &&
                        previousY !== null
                    ) {

                        const dx =
                            localX -
                            previousX;


                        const dy =
                            localY -
                            previousY;


                        const distance =
                            Math.hypot(
                                dx,
                                dy
                            );


                        if (
                            distance > 0.2
                        ) {

                            registerMovement();

                        }

                    }

                    else {

                        registerMovement();

                    }


                    previousX =
                        localX;


                    previousY =
                        localY;

                },
                {
                    passive: true
                }
            );


            block.addEventListener(
                "mouseenter",
                function () {

                    isInside =
                        true;


                    previousX =
                        null;


                    previousY =
                        null;


                    movementAmount =
                        0;


                    resizeCanvas();

                }
            );


            block.addEventListener(
                "mouseleave",
                function () {

                    isInside =
                        false;


                    isMoving =
                        false;


                    previousX =
                        null;


                    previousY =
                        null;


                    mouseY =
                        null;


                    clearMoveTimer();

                }
            );


            window.addEventListener(
                "resize",
                resizeCanvas,
                {
                    passive: true
                }
            );


            const resizeObserver =
                typeof ResizeObserver !== "undefined"
                    ?
                    new ResizeObserver(
                        function () {

                            resizeCanvas();

                        }
                    )
                    :
                    null;


            if (resizeObserver) {

                resizeObserver.observe(
                    block
                );

            }


            function animate() {

                requestAnimationFrame(
                    animate
                );


                if (
                    !isInside &&
                    movementAmount <= 0.001
                ) {

                    canvas.style.opacity =
                        "0";

                    return;

                }


                if (
                    isMoving
                ) {

                    movementAmount +=
                        (
                            1 -
                            movementAmount
                        ) *
                        0.45;

                }

                else {

                    movementAmount *=
                        (
                            1 -
                            FADE_SPEED
                        );


                    if (
                        movementAmount < 0.01
                    ) {

                        movementAmount =
                            0;

                    }

                }


                if (
                    movementAmount <= 0
                ) {

                    canvas.style.opacity =
                        "0";


                    context.clearRect(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );


                    return;

                }


                if (
                    !captureImage()
                ) {

                    canvas.style.opacity =
                        "0";

                    return;

                }


                context.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                wavePhase +=
                    WAVE_SPEED;


                drawWave();


                canvas.style.opacity =
                    "1";

            }


            if (image.complete) {

                resizeCanvas();

            }

            else {

                image.addEventListener(
                    "load",
                    resizeCanvas,
                    {
                        once: true
                    }
                );

            }


            requestAnimationFrame(
                animate
            );


        }
    );


})();;
(function () {

    const section =
        document.querySelector(".offform-final");

    if (!section) return;


    const mobileLayout =
        window.matchMedia(
            "(max-width: 1024px)"
        );

    const wideScreenLayout =
        window.matchMedia(
            "(min-width: 1500px)"
        );


    /*
     * MOBILE CONTACT ONLY:
     * - MOVE THE EXISTING COMPANY FIELD UNDER EMAIL
     * - SHOW ONLY "COMPANY"
     * - KEEP DESKTOP HTML / LAYOUT UNCHANGED
     */
    const contactFieldGroups =
        Array.from(
            section.querySelectorAll(
                ".offform-final-contact-fields"
            )
        );

    const mobileNameEmailGroup =
        contactFieldGroups[0] || null;

    const desktopAgencyProjectGroup =
        contactFieldGroups[1] || null;

    const existingCompanyField =
        desktopAgencyProjectGroup
            ? desktopAgencyProjectGroup.querySelector(
                'input[name="company"]'
              )?.closest(
                ".offform-final-contact-field"
              )
            : null;

    const existingCompanyLabel =
        existingCompanyField
            ? existingCompanyField.querySelector("span")
            : null;

    const originalCompanyLabel =
        existingCompanyLabel
            ? existingCompanyLabel.textContent
            : "AGENCY / COMPANY";


    function syncMobileContactFields() {

        if (
            !mobileNameEmailGroup ||
            !desktopAgencyProjectGroup ||
            !existingCompanyField ||
            !existingCompanyLabel
        ) {
            return;
        }

        if (mobileLayout.matches) {

            if (
                existingCompanyField.parentElement !==
                mobileNameEmailGroup
            ) {
                mobileNameEmailGroup.appendChild(
                    existingCompanyField
                );
            }

            existingCompanyLabel.textContent =
                "COMPANY";
        }

        else {

            if (
                existingCompanyField.parentElement !==
                desktopAgencyProjectGroup
            ) {
                desktopAgencyProjectGroup.insertBefore(
                    existingCompanyField,
                    desktopAgencyProjectGroup.firstElementChild
                );
            }

            existingCompanyLabel.textContent =
                originalCompanyLabel;
        }
    }


    syncMobileContactFields();

    if (mobileLayout.addEventListener) {
        mobileLayout.addEventListener(
            "change",
            syncMobileContactFields
        );
    }
    else if (mobileLayout.addListener) {
        mobileLayout.addListener(
            syncMobileContactFields
        );
    }


    const stage =
        section.querySelector(".offform-final-stage");

    const about =
        section.querySelector(".offform-final-about");

    const heading =
        section.querySelector(".offform-final-heading");

    const headingTitle =
        section.querySelector(".offform-final-heading-title");

    const headingLine =
        section.querySelector(".offform-final-heading-line");

    const headingViewAll =
        section.querySelector(".offform-final-heading-view-all");

    const headingSquare =
        section.querySelector(".offform-final-heading-square");


    const contactHeading =
        section.querySelector(".offform-final-contact-heading");

    const contactHeadingTitle =
        section.querySelector(".offform-final-contact-heading-title");

    const contactHeadingLine =
        section.querySelector(".offform-final-contact-heading-line");

    const contactHeadingViewAll =
        section.querySelector(".offform-final-contact-heading-view-all");

    const contactHeadingSquare =
        section.querySelector(".offform-final-contact-heading-square");


    const roster =
        section.querySelector(
            ".offform-final-roster"
        );


    const rosterRows =
        Array.from(
            section.querySelectorAll(
                ".offform-final-roster-row"
            )
        );


    let mobilePreview = null;
    let mobilePreviewImage = null;
    let mobilePreviewRow = null;


    if (mobileLayout.matches) {

        mobilePreview =
            document.createElement(
                "div"
            );

        mobilePreview.className =
            "offform-final-mobile-preview";

        mobilePreview.setAttribute(
            "aria-hidden",
            "true"
        );


        mobilePreviewImage =
            document.createElement(
                "img"
            );

        mobilePreviewImage.alt = "";
        mobilePreviewImage.draggable = false;


        mobilePreview.appendChild(
            mobilePreviewImage
        );

        stage.appendChild(
            mobilePreview
        );
    }


    const infoImage =
        section.querySelector(
            ".offform-final-info-image"
        );

    const infoTalent =
        section.querySelector(
            ".offform-final-info-talent"
        );

    const infoProject =
        section.querySelector(
            ".offform-final-info-project"
        );

    const infoYear =
        section.querySelector(
            ".offform-final-info-year"
        );


    if (
        !stage ||
        !about ||
        !heading ||
        !headingTitle ||
        !headingLine ||
        !headingViewAll ||
        !headingSquare ||
        !contactHeading ||
        !contactHeadingTitle ||
        !contactHeadingLine ||
        !contactHeadingViewAll ||
        !contactHeadingSquare
    ) {
        return;
    }



    /* =====================================================
       HELPERS
    ===================================================== */

    const clamp = (value, min, max) => {

        return Math.max(
            min,
            Math.min(max, value)
        );

    };


    const smooth = value => {

        value =
            clamp(
                value,
                0,
                1
            );

        return (
            value *
            value *
            (3 - 2 * value)
        );

    };


    function cssNumber(name) {

        return (
            parseFloat(
                getComputedStyle(section)
                    .getPropertyValue(name)
            ) ||
            0
        );

    }


    function cssPixels(name) {

        const value =
            getComputedStyle(section)
                .getPropertyValue(name)
                .trim();


        if (value.endsWith("vh")) {

            const viewportHeight =
                mobileLayout.matches
                    ? getMobileViewportHeight()
                    : window.innerHeight;

            return (
                parseFloat(value) *
                viewportHeight /
                100
            );

        }


        return (
            parseFloat(value) ||
            0
        );

    }



    /* =====================================================
       ACTIVE PARTNER

       ONLY:
       - IMAGE
       - TALENT VALUE
       - PROJECT VALUE
       - YEAR VALUE

       CHANGE.

       DESCRIPTION + LABELS NEVER CHANGE.
    ===================================================== */

    /* =====================================================
       PRELOAD PARTNER IMAGES

       THIS MAKES FAST HOVERING FEEL CONTINUOUS:
       IMAGES ARE REQUESTED BEFORE THE POINTER REACHES THEM.
    ===================================================== */

    rosterRows.forEach(
        function (row) {

            const src =
                row.dataset.image ||
                "";

            if (!src) return;

            const preload =
                new Image();

            preload.src =
                src;

        }
    );


    /* =====================================================
       ACTIVE PARTNER — IMMEDIATE HOVER UPDATE

       NO TIMER.
       NO 220MS DELAY.
       THE IMAGE + VALUES CHANGE AS SOON AS THE POINTER
       ENTERS A ROSTER ROW.
    ===================================================== */

    function updatePartner(index) {

        const row =
            rosterRows[index];


        if (
            !row ||
            !infoImage ||
            !infoTalent ||
            !infoProject ||
            !infoYear
        ) {
            return;
        }


        const nextImage =
            row.dataset.image ||
            "";


        if (
            nextImage &&
            infoImage.getAttribute("src") !== nextImage
        ) {

            infoImage.src =
                nextImage;

        }


        infoTalent.textContent =
            row.dataset.talent ||
            "";


        infoProject.textContent =
            row.dataset.project ||
            "";


        infoYear.textContent =
            row.dataset.year ||
            "";


        /*
         * ACCESSIBILITY ONLY:
         * Keep the changing partner image description synchronized
         * with the existing partner / project / talent metadata.
         * No visual or interaction behavior changes.
         */
        infoImage.alt =
            (row.dataset.partner || "") +
            " — " +
            (row.dataset.project || "") +
            ", featuring " +
            (row.dataset.talent || "");

    }



    /* =====================================================
       ACCESSIBILITY — PARTNER ROW KEYBOARD SUPPORT

       Adds keyboard access to the EXISTING row behavior only.
       No mouse / touch / mobile / wide-screen logic is replaced.
    ===================================================== */

    rosterRows.forEach(
        function (row, index) {

            row.addEventListener(
                "focus",
                function () {
                    updatePartner(index);
                }
            );


            row.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key !== "Enter" &&
                        event.key !== " "
                    ) {
                        return;
                    }

                    event.preventDefault();

                    updatePartner(index);
                }
            );

        }
    );


    /* =====================================================
       VALUES
    ===================================================== */

    let stickyStart = 0;

    let stickyDistance = 1;

    let headingTitleWidth = 0;

    let headingViewAllWidth = 0;

    let headingWidth = 0;

    let headingSquareSize = 7;

    let headingSideGap = 8;

    let headingLineTitleGap = 8;

    let headingLineViewGap = 8;

    let contactTitleWidth = 0;
    let contactViewAllWidth = 0;
    let contactHeadingWidth = 0;


    let mobileViewportHeight =
        0;

    let mobileViewportWidth =
        0;


    function getMobileViewportHeight() {

        if (!mobileLayout.matches) {
            return window.innerHeight;
        }

        if (!mobileViewportHeight) {
            mobileViewportHeight =
                window.innerHeight;
        }

        return mobileViewportHeight;
    }



    /* =====================================================
       MEASURE
    ===================================================== */

    function measure() {

        const scrollY =
            window.scrollY ||
            window.pageYOffset;


        stickyStart =
            section
                .getBoundingClientRect()
                .top +
            scrollY;


        stickyDistance =
            Math.max(
                1,
                cssPixels(
                    "--sticky-distance"
                )
            );


        headingTitleWidth =
            headingTitle.offsetWidth;

        headingViewAllWidth =
            headingViewAll.offsetWidth;

        headingWidth =
            heading.offsetWidth;

        contactTitleWidth =
            contactHeadingTitle.offsetWidth;

        contactViewAllWidth =
            contactHeadingViewAll.offsetWidth;

        contactHeadingWidth =
            contactHeading.offsetWidth;


        headingSquareSize =
            cssNumber(
                "--final-heading-square-size"
            ) ||
            7;


        headingSideGap =
            cssNumber(
                "--final-heading-square-side-gap"
            );


        headingLineTitleGap =
            cssNumber(
                "--final-heading-line-title-gap"
            );


        headingLineViewGap =
            cssNumber(
                "--final-heading-line-view-gap"
            );


        updateScroll();

    }



    /* =====================================================
       MOBILE — TRUE 100VH PIN
    ===================================================== */

    function updateMobilePin() {

        if (!mobileLayout.matches) {

            stage.classList.remove(
                "offform-final-mobile-pin"
            );

            stage.style.transform = "";

            return;
        }


        const sectionRect =
            section.getBoundingClientRect();

        const viewportHeight =
            getMobileViewportHeight();

        let stageY = 0;


        if (sectionRect.top > 0) {

            stageY =
                sectionRect.top;
        }

        else if (
            sectionRect.bottom <
            viewportHeight
        ) {

            stageY =
                sectionRect.bottom -
                viewportHeight;
        }


        stage.classList.add(
            "offform-final-mobile-pin"
        );

        stage.style.transform =
            "translate3d(0," +
            stageY.toFixed(2) +
            "px,0)";
    }


    function positionMobilePreview() {

        if (
            !mobileLayout.matches ||
            !mobilePreview ||
            !roster
        ) {
            return;
        }


        const stageRect =
            stage.getBoundingClientRect();

        const rosterRect =
            roster.getBoundingClientRect();

        const centerY =
            (
                rosterRect.top -
                stageRect.top
            ) +
            (
                rosterRect.height /
                2
            );


        mobilePreview.style.top =
            centerY.toFixed(2) +
            "px";
    }


    /* =====================================================
       SCROLL
    ===================================================== */

    function updateScroll() {

        updateMobilePin();


        const scrollY =
            window.scrollY ||
            window.pageYOffset;


        const stickyProgress =
            clamp(
                (
                    scrollY -
                    stickyStart
                ) /
                stickyDistance,
                0,
                1
            );


        /*
         * MOBILE ONLY — WHOLE CONTACT BLOCK EXIT
         *
         * Resting state: exactly the original position, with the
         * existing 50px gap below the contact.
         *
         * Exit state: as the section leaves toward the next section,
         * the complete contact block moves down by 50px, closing that
         * visible bottom gap.
         */
        if (mobileLayout.matches) {

            const sectionRectForExit =
                section.getBoundingClientRect();

            const viewportHeightForExit =
                getMobileViewportHeight();

            const exitDistance =
                Math.max(
                    1,
                    viewportHeightForExit * 0.18
                );

            const exitProgress =
                clamp(
                    (
                        viewportHeightForExit -
                        sectionRectForExit.bottom
                    ) /
                    exitDistance,
                    0,
                    1
                );

            const contactExitDistance =
                window.matchMedia(
                    "(min-width: 768px) and (max-width: 1024px)"
                ).matches
                    ? 100
                    : 50;

            const contactExitY =
                contactExitDistance *
                smooth(exitProgress);

            section.style.setProperty(
                "--final-mobile-contact-exit-y",
                contactExitY.toFixed(2) + "px"
            );
        }

        else {

            section.style.removeProperty(
                "--final-mobile-contact-exit-y"
            );
        }



        /* =================================================
           VERTICAL POSITION
           SAME ENTRY / PIN / EXIT BEHAVIOR AS THE
           ABOUT + SELECTED TALENT REFERENCE

           - ENTERS NATURALLY WITH THE SECTION
           - STOPS SMOOTHLY AT --final-stop-top
           - STAYS THERE THROUGH THE STICKY RANGE
           - LEAVES NATURALLY WITH THE STICKY STAGE
        ================================================= */

        const stageRect =
            stage.getBoundingClientRect();

        const aboutBaseTop =
            about.offsetTop;

        const aboutStopTop =
            cssNumber(
                "--final-stop-top"
            );

        let aboutPinY = 0;

        if (
            stageRect.top > 0
        ) {

            const naturalAboutTop =
                stageRect.top +
                aboutBaseTop;

            aboutPinY =
                Math.max(
                    0,
                    aboutStopTop -
                    naturalAboutTop
                );

        }

        else {

            aboutPinY =
                Math.max(
                    0,
                    aboutStopTop -
                    aboutBaseTop
                );

        }

        if (mobileLayout.matches) {

            about.style.transform =
                "translate3d(0,0,0)";
        }

        else {

            about.style.transform =
                "translate3d(0," +
                aboutPinY.toFixed(2) +
                "px,0)";
        }




        /* =================================================
           SELECTED / PARTNERS LINE BUILD
        ================================================= */

        const lineStart =
            headingTitleWidth +
            headingLineTitleGap;


        const initialLineWidth =
            Math.max(
                0,
                cssNumber(
                    "--final-heading-line-initial-width"
                )
            );


        const finalSquareLeft =
            wideScreenLayout.matches
                ? Math.max(
                    0,
                    document.documentElement.clientWidth -
                    heading.getBoundingClientRect().left -
                    20 -
                    headingSquareSize
                )
                : Math.max(
                    0,
                    headingWidth -
                    headingSquareSize
                );


        const finalViewAllX =
            finalSquareLeft -
            headingSideGap -
            headingViewAllWidth;


        const finalLineEnd =
            finalViewAllX -
            headingLineViewGap;


        const maxLineWidth =
            Math.max(
                initialLineWidth,
                finalLineEnd -
                lineStart
            );


        const viewAllStartX =
            lineStart +
            initialLineWidth +
            headingLineViewGap;


        const headingBuildProgress =
            smooth(
                clamp(
                    stickyProgress / 0.5,
                    0,
                    1
                )
            );


        const currentLineWidth =
            initialLineWidth +
            (
                maxLineWidth -
                initialLineWidth
            ) *
            headingBuildProgress;


        const currentLineEnd =
            lineStart +
            currentLineWidth;


        const pushedViewAllX =
            currentLineEnd +
            headingLineViewGap;


        const viewAllX =
            Math.min(
                finalViewAllX,
                Math.max(
                    viewAllStartX,
                    pushedViewAllX
                )
            );


        headingLine.style.left =
            lineStart +
            "px";


        headingLine.style.width =
            currentLineWidth +
            "px";


        headingViewAll.style.transform =
            "translate3d(" +
            viewAllX.toFixed(2) +
            "px,0,0)";


        const headingSquareX =
            viewAllX +
            headingViewAllWidth +
            headingSideGap;


        headingSquare.style.left =
            Math.min(
                finalSquareLeft,
                headingSquareX
            ).toFixed(2) +
            "px";



        /* =================================================
           CONTACT LINE BUILD — SECOND HALF OF STICKY

           MOBILE SEQUENCE:
           0.00 → 0.50  SELECTED / PARTNERS OPENS
           0.50 → 1.00  CONTACT OPENS
           1.00         BOTH ARE COMPLETE, THEN THE
                        COMPLETE 100VH STAGE RELEASES
        ================================================= */

        const contactProgress =
            smooth(
                clamp(
                    (stickyProgress - 0.5) / 0.5,
                    0,
                    1
                )
            );

        const contactLineStart =
            contactTitleWidth +
            headingLineTitleGap;

        const contactInitialLineWidth =
            initialLineWidth;

        const contactFinalSquareLeft =
            wideScreenLayout.matches
                ? Math.max(
                    0,
                    document.documentElement.clientWidth -
                    contactHeading.getBoundingClientRect().left -
                    20 -
                    headingSquareSize
                )
                : Math.max(
                    0,
                    contactHeadingWidth -
                    headingSquareSize
                );

        const contactFinalViewAllX =
            contactFinalSquareLeft -
            headingSideGap -
            contactViewAllWidth;

        const contactFinalLineEnd =
            contactFinalViewAllX -
            headingLineViewGap;

        const contactMaxLineWidth =
            Math.max(
                contactInitialLineWidth,
                contactFinalLineEnd -
                contactLineStart
            );

        const contactViewAllStartX =
            contactLineStart +
            contactInitialLineWidth +
            headingLineViewGap;

        const contactCurrentLineWidth =
            contactInitialLineWidth +
            (
                contactMaxLineWidth -
                contactInitialLineWidth
            ) *
            contactProgress;

        const contactCurrentLineEnd =
            contactLineStart +
            contactCurrentLineWidth;

        const contactPushedViewAllX =
            contactCurrentLineEnd +
            headingLineViewGap;

        const contactViewAllX =
            Math.min(
                contactFinalViewAllX,
                Math.max(
                    contactViewAllStartX,
                    contactPushedViewAllX
                )
            );

        contactHeadingLine.style.left =
            contactLineStart + "px";

        contactHeadingLine.style.width =
            contactCurrentLineWidth + "px";

        contactHeadingViewAll.style.transform =
            "translate3d(" +
            contactViewAllX.toFixed(2) +
            "px,0,0)";

        const contactSquareX =
            contactViewAllX +
            contactViewAllWidth +
            headingSideGap;

        contactHeadingSquare.style.left =
            Math.min(
                contactFinalSquareLeft,
                contactSquareX
            ).toFixed(2) +
            "px";


        positionMobilePreview();

    }



    /* =====================================================
       RAF
    ===================================================== */

    let ticking = false;


    function requestUpdate() {

        if (ticking) return;

        ticking = true;


        requestAnimationFrame(
            function () {

                updateScroll();

                /* WIDE SCREEN ONLY:
                   after scroll moves the roster under a stationary pointer,
                   immediately re-check which row is physically underneath it. */
                syncWideScreenPartnerFromPointer();

                ticking = false;

            }
        );

    }



    /* =====================================================
       WIDE SCREEN ONLY — ROSTER / STATIONARY POINTER SYNC

       On some wide-screen desktop/browser combinations,
       mouseenter / mouseleave do not update when the page scrolls
       underneath a completely stationary pointer.

       Store the real pointer position, then use elementFromPoint()
       after each scroll update to determine which PARTNERS row is
       physically underneath the mouse right now.

       Leaving the roster returns to partner 01.
       Laptop / normal desktop / tablet / mobile are untouched.
    ===================================================== */

    let widePointerX = 0;
    let widePointerY = 0;
    let wideHasPointer = false;
    let widePartnerIndex = 0;


    function syncWideScreenPartnerFromPointer() {

        if (
            mobileLayout.matches ||
            !wideScreenLayout.matches ||
            !wideHasPointer
        ) {
            return;
        }


        const elementUnderPointer =
            document.elementFromPoint(
                widePointerX,
                widePointerY
            );


        const rowUnderPointer =
            elementUnderPointer
                ? elementUnderPointer.closest(
                    ".offform-final-roster-row"
                )
                : null;


        const validRow =
            rowUnderPointer &&
            roster &&
            roster.contains(rowUnderPointer);


        rosterRows.forEach(
            function (row) {
                row.classList.remove(
                    "is-wide-hover"
                );
            }
        );


        if (!validRow) {

            widePartnerIndex = 0;
            updatePartner(0);

            return;
        }


        rowUnderPointer.classList.add(
            "is-wide-hover"
        );


        const index =
            rosterRows.indexOf(rowUnderPointer);


        if (index >= 0) {

            widePartnerIndex = index;

            updatePartner(index);
        }
    }


    