export default defineContentScript({
  matches: ['<all_urls>'],
  excludeMatches: ["*://extensions/*"],
  main() {
    console.log('Hello content.');
  },
});
