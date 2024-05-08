console.log('eytan2');

// --------------------------------------------------------------------------
let lastChangeTime = Date.now(); // Initialize last change time
let finishLogged = false; // Flag to track if "finish" has been logged

// Mutation observer callback function
const callback = function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      console.log('changed');
      lastChangeTime = Date.now(); // Update last change time
      finishLogged = false; // Reset finishLogged flag
    }
  }
};

// Target node and observer configuration
const targetNode = document.getElementById('job-details');
const config = { attributes: false, childList: true, subtree: true };
const observer = new MutationObserver(callback);

// Start observing
observer.observe(targetNode, config);

// Function to check for inactivity and log "finish"
const checkActivity = function () {
  const currentTime = Date.now();
  const elapsedTime = currentTime - lastChangeTime;
  if (!finishLogged && elapsedTime >= 1000) {
    // Check if more than 1 second has elapsed and "finish" hasn't been logged yet
    console.log('finish');
    finishLogged = true; // Set finishLogged flag to true to indicate that "finish" has been logged
  }
  setTimeout(checkActivity, 1000); // Check again after 1 second
};

// Start checking for inactivity
checkActivity();

// --------------------------------------------------------------------------
// // Add event listener to detect navigation events
// chrome.webNavigation.onCompleted.addListener(function(details) {
//   // Log the URL of the newly loaded page
//   console.log("Navigation completed. URL:", details.url);

//   // You can perform additional actions here based on the new URL
// }, {
//   // Specify the URL patterns to match
//   url: [{schemes: ['http', 'https']}] // Example: Match HTTP and HTTPS URLs
// });

// --------------------------------------------------------------------------
/**
// job post html element catch: ----------------------------------------

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
chrome.runtime.sendMessage(
  { message: entireJobPostHtmlEl.outerHTML },
  function (response) {
    console.log('Response from background script:', response);
  }
);
 */
