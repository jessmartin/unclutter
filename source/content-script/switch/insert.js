import { reportEvent } from "../../common/metrics";
import browser from "../../common/polyfill";
import {
    getUserSettingForDomain,
    setUserSettingsForDomain,
} from "../../common/storage";
import { getDomainFrom } from "../../common/util";
import { togglePageView } from "../enhance";
import {
    createStylesheetLink,
    overrideClassname,
} from "../style-changes/common";

export default function insert() {
    insertPageSettings();
}

// Insert a small UI for the user to control the automatic pageview enablement on the current domain.
// Creating an iframe for this doesn't work from injected scripts
function insertPageSettings() {
    const domain = getDomainFrom(new URL(window.location.href));

    const githubLink = `https://github.com/lindylearn/unclutter/issues/new?labels=broken-website&title=${encodeURIComponent(
        `Article doesn't show correctly on ${domain}`
    )}&body=${encodeURIComponent(
        `The following article doesn't appear correctly in Unclutter. Please take a look!\n\n${window.location.href}`
    )}`;

    _insertHtml(
        "lindy-page-settings-topright",
        `<div class="lindy-tooltip lindy-fade" data-title="Unclutter settings">
            <svg class="lindy-ui-icon" id="lindy-settings-icon" viewBox="0 0 512 512">
                <path fill="currentColor" d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"/>
            </svg>
        </div>
        <a href="${githubLink}" target="_blank" rel="noopener noreferrer" class="lindy-tooltip lindy-fade" data-title="Report bug">
            <svg class="lindy-ui-icon" id="lindy-bug-icon" viewBox="0 0 512 512">
                <path fill="currentColor" d="M352 96V99.56C352 115.3 339.3 128 323.6 128H188.4C172.7 128 159.1 115.3 159.1 99.56V96C159.1 42.98 202.1 0 255.1 0C309 0 352 42.98 352 96zM41.37 105.4C53.87 92.88 74.13 92.88 86.63 105.4L150.6 169.4C151.3 170 151.9 170.7 152.5 171.4C166.8 164.1 182.9 160 199.1 160H312C329.1 160 345.2 164.1 359.5 171.4C360.1 170.7 360.7 170 361.4 169.4L425.4 105.4C437.9 92.88 458.1 92.88 470.6 105.4C483.1 117.9 483.1 138.1 470.6 150.6L406.6 214.6C405.1 215.3 405.3 215.9 404.6 216.5C410.7 228.5 414.6 241.9 415.7 256H480C497.7 256 512 270.3 512 288C512 305.7 497.7 320 480 320H416C416 344.6 410.5 367.8 400.6 388.6C402.7 389.9 404.8 391.5 406.6 393.4L470.6 457.4C483.1 469.9 483.1 490.1 470.6 502.6C458.1 515.1 437.9 515.1 425.4 502.6L362.3 439.6C337.8 461.4 306.5 475.8 272 479.2V240C272 231.2 264.8 224 255.1 224C247.2 224 239.1 231.2 239.1 240V479.2C205.5 475.8 174.2 461.4 149.7 439.6L86.63 502.6C74.13 515.1 53.87 515.1 41.37 502.6C28.88 490.1 28.88 469.9 41.37 457.4L105.4 393.4C107.2 391.5 109.3 389.9 111.4 388.6C101.5 367.8 96 344.6 96 320H32C14.33 320 0 305.7 0 288C0 270.3 14.33 256 32 256H96.3C97.38 241.9 101.3 228.5 107.4 216.5C106.7 215.9 106 215.3 105.4 214.6L41.37 150.6C28.88 138.1 28.88 117.9 41.37 105.4H41.37z"/>
            </svg>
        </a>
        <div class="lindy-theme-popup-container" data-title="Article theme">
            <svg class="lindy-ui-icon" id="lindy-theme-icon" viewBox="0 0 640 512">
                <path fill="currentColor" d="M205.1 52.76C201.3 40.3 189.3 32.01 176 32.01S150.7 40.3 146 52.76l-144 384c-6.203 16.56 2.188 35 18.73 41.22c16.55 6.125 34.98-2.156 41.2-18.72l28.21-75.25h171.6l28.21 75.25C294.9 472.1 307 480 320 480c3.734 0 7.531-.6562 11.23-2.031c16.55-6.219 24.94-24.66 18.73-41.22L205.1 52.76zM114.2 320L176 155.1l61.82 164.9H114.2zM608 160c-13.14 0-24.37 7.943-29.3 19.27C559.2 167.3 536.5 160 512 160c-70.58 0-128 57.41-128 128l.0007 63.93c0 70.59 57.42 128.1 127.1 128.1c24.51 0 47.21-7.266 66.7-19.26C583.6 472.1 594.9 480 608 480c17.67 0 32-14.31 32-32V192C640 174.3 625.7 160 608 160zM576 352c0 35.28-28.7 64-64 64s-64-28.72-64-64v-64c0-35.28 28.7-63.1 64-63.1s64 28.72 64 63.1V352z"/>
            </svg>
            <div class="lindy-theme-popup" id="lindy-theme-popup">
                <div class="lindy-plusminus">
                    <div id="lindy-fontsize-decrease">
                        <svg class="lindy-ui-icon" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M400 288h-352c-17.69 0-32-14.32-32-32.01s14.31-31.99 32-31.99h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z"/>
                        </svg>
                    </div>
                    <div id="lindy-fontsize-increase">
                        <svg class="lindy-ui-icon" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"/>
                        </svg>
                    </div>
                </div>
                <div class="lindy-theme-popup-row-spacer"></div>
                <div class="lindy-plusminus">
                    <div id="lindy-pagewidth-decrease">
                        <svg class="lindy-ui-icon" viewBox="0 0 512 512" style="transform: rotate(45deg);">
                            <path fill="currentColor" d="M54.63 502.6L176 381.3V432c0 17.69 14.31 32 32 32s32-14.31 32-32v-128c0-4.164-.8477-8.312-2.465-12.22C234.3 283.9 228.1 277.7 220.2 274.5C216.3 272.8 212.2 272 208 272h-128c-17.69 0-32 14.31-32 32s14.31 32 32 32h50.75l-121.4 121.4c-12.5 12.5-12.5 32.75 0 45.25S42.13 515.1 54.63 502.6zM274.5 220.2c3.242 7.84 9.479 14.08 17.32 17.32C295.7 239.2 299.8 240 304 240h128c17.69 0 32-14.31 32-32s-14.31-32-32-32h-50.75l121.4-121.4c12.5-12.5 12.5-32.75 0-45.25c-12.49-12.49-32.74-12.51-45.25 0L336 130.8V80c0-17.69-14.31-32-32-32s-32 14.31-32 32v127.1C272 212.2 272.8 216.3 274.5 220.2z"/>
                        </svg>
                    </div>
                    <div id="lindy-pagewidth-increase">
                        <svg class="lindy-ui-icon" viewBox="0 0 512 512" style="transform: rotate(45deg);">
                            <path fill="currentColor" d="M177.4 289.4L64 402.8V352c0-17.69-14.31-32-32-32s-32 14.31-32 32v128c0 4.164 .8477 8.312 2.465 12.22c3.24 7.832 9.479 14.07 17.31 17.31C23.69 511.2 27.84 512 32 512h128c17.69 0 32-14.31 32-32s-14.31-32-32-32H109.3l113.4-113.4c12.5-12.5 12.5-32.75 0-45.25S189.9 276.9 177.4 289.4zM509.5 19.78c-3.242-7.84-9.479-14.08-17.32-17.32C488.3 .8477 484.2 0 480 0h-128c-17.69 0-32 14.31-32 32s14.31 32 32 32h50.75l-113.4 113.4c-12.5 12.5-12.5 32.75 0 45.25c12.49 12.49 32.74 12.51 45.25 0L448 109.3V160c0 17.69 14.31 32 32 32s32-14.31 32-32V32C512 27.84 511.2 23.69 509.5 19.78z"/>
                        </svg>
                    </div>
                </div>
                <div class="lindy-theme-popup-row-spacer"></div>
                <div class="lindy-theme-row">
                    <div>
                        <div class="lindy-theme-button" id="lindy-white-theme-button"></div>
                    </div>
                    <div>
                        <div class="lindy-theme-button" id="lindy-dark-theme-button"></div>
                    </div>
                    <div>
                        <div class="lindy-theme-button" id="lindy-sepia-theme-button"></div>
                    </div>
                </div>
            </div>
        </div>`
    );

    _insertHtml(
        "lindy-page-settings-pageadjacent",
        `<div id="lindy-domain-switch-icon-container" class="lindy-tooltip lindy-tooltip-reverse lindy-fade">
            <!-- <svg> inserted in _setupDomainToggleState() below  -->
        </div>`
    );

    createStylesheetLink(
        browser.runtime.getURL("content-script/switch/index.css")
    );

    _setupDomainToggleState(domain);
    _setupLinkHandlers();
    _setupThemePopupHandlers();
}

function _insertHtml(className, html) {
    const container = document.createElement("div");
    container.className = `${overrideClassname} ${className}`;
    container.innerHTML = html;
    document.documentElement.appendChild(container);
}

async function _setupDomainToggleState(currentDomain) {
    const svg = document.getElementById("lindy-domain-switch-icon-container");
    let userSetting = await getUserSettingForDomain(currentDomain);
    svg.innerHTML = _getDomainToggleIcon(userSetting);
    svg.setAttribute(
        "data-title",
        _getDomainToggleTooltip(userSetting, currentDomain)
    );

    svg.onclick = (e) => {
        userSetting = _nextUserSetting(userSetting);
        svg.innerHTML = _getDomainToggleIcon(userSetting);
        svg.setAttribute(
            "data-title",
            _getDomainToggleTooltip(userSetting, currentDomain)
        );

        setUserSettingsForDomain(currentDomain, userSetting);

        // convenience: also disable pageview if automatic status disabled
        if (userSetting === "deny") {
            // ideally send a message here -- but can't access current tab id in this context
            // leave some time for the user to see the new state icon
            setTimeout(togglePageView, 300);

            reportEvent("disablePageview", { trigger: "blocklistDomain" });
        }

        reportEvent("changeDomainSetting", { newState: userSetting });
    };
}
function _nextUserSetting(userSetting) {
    if (userSetting === "allow") {
        return "deny";
    } else if (userSetting === "deny") {
        return "allow";
    } else {
        return "deny";
    }
}
function _getDomainToggleTooltip(userSetting, domain) {
    if (userSetting === "allow") {
        return `Enabled on ${domain}`;
    } else if (userSetting === "deny") {
        return `Disabled on ${domain}`;
    } else {
        return `Automatically enabled on ${domain}`;
    }
}
function _getDomainToggleIcon(userSetting) {
    if (userSetting === "allow") {
        return `
        <svg class="lindy-ui-icon" id="lindy-domain-switch-icon" viewBox="0 0 512 512">
            <path fill="currentColor" d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"/>
        </svg>`;
    } else if (userSetting === "deny") {
        return `
        <svg class="lindy-ui-icon" id="lindy-domain-switch-icon" viewBox="0 0 512 512" style="overflow: visible; margin-left: -5px; margin-right: 5px;">
            <path fill="currentColor" d="M228.4 153.7L394.9 7.918C406.2-1.92 422.7-2.669 434.8 6.114C446.9 14.9 451.3 30.87 445.4 44.61L368.5 224H480C493.3 224 505.3 232.3 509.1 244.7C514.6 257.2 511.1 271.3 501.1 280.1L448.4 326.2L630.8 469.1C641.2 477.3 643.1 492.4 634.9 502.8C626.7 513.2 611.6 515.1 601.2 506.9L9.196 42.89C-1.236 34.71-3.065 19.63 5.112 9.196C13.29-1.236 28.37-3.065 38.81 5.112L228.4 153.7zM138.9 231.9L154.8 217.1L243.7 288H160C146.7 288 134.7 279.7 130 267.3C125.4 254.8 128.9 240.7 138.9 231.9L138.9 231.9zM194.6 467.4L264.5 304.4L374.4 390.1L245.1 504.1C233.8 513.9 217.3 514.7 205.2 505.9C193.1 497.1 188.7 481.1 194.6 467.4V467.4z"/>
        </svg>`;
    } else {
        return `
        <svg class="lindy-ui-icon" id="lindy-domain-switch-icon" viewBox="0 0 512 512" style="overflow: visible;">
            <path fill="currentColor" d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H32C18.67 288 6.735 279.7 2.046 267.3C-2.643 254.8 .8963 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224zM464 288C476.1 288 487.2 294.8 492.6 305.7L572.6 465.7C580.5 481.5 574.1 500.7 558.3 508.6C542.5 516.5 523.3 510.1 515.4 494.3L508.2 480H419.8L412.6 494.3C404.7 510.1 385.5 516.5 369.7 508.6C353.9 500.7 347.5 481.5 355.4 465.7L435.4 305.7C440.8 294.8 451.9 288 464 288H464zM447.8 424H480.2L464 391.6L447.8 424z"/>
        </svg>`;
    }
}

function _setupLinkHandlers() {
    document.getElementById("lindy-settings-icon").onclick = () =>
        chrome.runtime.sendMessage({ event: "openOptionsPage" });
}

function _setupThemePopupHandlers() {
    function _changeCssVariable(varName, delta) {
        const currentSize = window
            .getComputedStyle(document.documentElement)
            .getPropertyValue(varName)
            .replace("px", "");

        document.documentElement.style.setProperty(
            varName,
            `${parseFloat(currentSize) + delta}px`
        );
    }

    document.getElementById("lindy-fontsize-decrease").onclick = () =>
        _changeCssVariable("--lindy-active-font-size", -1);
    document.getElementById("lindy-fontsize-increase").onclick = () =>
        _changeCssVariable("--lindy-active-font-size", 1);

    document.getElementById("lindy-pagewidth-decrease").onclick = () =>
        _changeCssVariable("--lindy-pagewidth", -50);
    document.getElementById("lindy-pagewidth-increase").onclick = () =>
        _changeCssVariable("--lindy-pagewidth", 50);
}
