// access browser apis similarly in chrome and firefox
// used instead of 'webextension-polyfill' to make bundles more readable.
const browserObj = typeof browser !== "undefined" ? browser : chrome;
export default browserObj;