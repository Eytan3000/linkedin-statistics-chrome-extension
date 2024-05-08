console.log('Background');

// VARIABLES

// check if user is on a job post
const job_url_part_str1 = 'linkedin.com/jobs/';
const job_url_part_str2 = 'currentJobId';

const save_job_keystroke = 'save_job_post';
// ---------------------

let isJobPost: boolean;

// ---------------------

// // TODO: background script
// chrome.runtime.onInstalled.addListener(() => {
//   // TODO: on installed function
// })

// // Listen for messages from content scripts
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   console.log("Message from content script:", message);

//   // Send a response back to the content script
//   sendResponse({ reply: "Message received by background script!" });
// });

// ------Checks if on job - User clicks and changes job description

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    const currentUrl = tab.url;

    isJobPost =
      currentUrl.includes(job_url_part_str1) &&
      currentUrl.includes(job_url_part_str2);
  }
});

// ------ Listen for keyboard shortcuts -----------------

// chrome.commands
chrome.commands.onCommand.addListener(function (command) {
  if (command === save_job_keystroke && isJobPost) {
    console.log('save_job_post');

    // if job post is saved already >> message "already saved"
    // if job post is not saved, use the already hashed key and html element and send them to the
  }
});
