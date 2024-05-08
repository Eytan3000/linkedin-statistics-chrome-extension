const jobTitleHtmlElement = document.querySelector(
  '.job-details-jobs-unified-top-card__job-title'
);
const entireJobPostHtmlEl = document.querySelector(
  '.jobs-details__main-content'
);

console.log(entireJobPostHtmlEl.outerHTML);

// let actualJobTitle: string;
// if (entireJobPostHtmlEl) {
// //   actualJobTitle = entireJobPostHtmlEl.textContent.trim();
//   console.log(entireJobPostHtmlEl);
// } else {
//   console.log('Element not found.');
// }

// Send a message from content script to background script
chrome.runtime.sendMessage({ message: entireJobPostHtmlEl.outerHTML }, function (response) {
  console.log('Response from background script:', response);
});
