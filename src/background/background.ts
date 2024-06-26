import { Message } from '../contentScript/contentScript';

// VARIABLES -----------------------------
// check if user is on a job post
const job_url_part_str1 = 'linkedin.com/jobs/';
const job_url_part_str2 = 'currentJobId';

// keystroke names
const save_job_keystroke = 'save_job_post';

// urlParams:
const currentJobIdParam = 'currentJobId';

// Global states - Chrome Storage ---------------------
type GlobalStateKey = 'currentUrl' | 'isJobPost' | 'jobPostId';

function setState(key: GlobalStateKey, value: any) {
  chrome.storage.sync.set({ [key]: value }, () => {
    console.log('Data saved');
  });
}

function getState(key: GlobalStateKey) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
}

// ---------------------
// helepers:
function isJobPostFn(url: string) {
  return url.includes(job_url_part_str1) && url.includes(job_url_part_str2);
}

function getParamFromUrl(currentUrl: string, paramName: string) {
  if (!currentUrl) return null;
  if (!currentUrl.includes(paramName)) return null;
  return currentUrl.split(paramName + '=')[1].split('&')[0];
}

// function sendToCloudFunction(message:any){

// }

// ------on Installed -------------------
// chrome.runtime.onInstalled.addListener(() => {
//   // TODO: on installed function
// })

// --- Listen to content script ------------------------
chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    console.log('message.type: ', message.type); //removeEytan
    if ((message.type = 'jobPostHtml'))
      console.log('Message from content script:', message.message);
    const jobPostId = getState('jobPostId');

    LICE_Main(message, jobPostId);

    // Send a response back to the content script
    // sendResponse({ reply: 'Message received by background script!' });
  }
);

// ------ Listen for tab updates Checks if on job - User clicks and changes job description

// ---- on Update -----------------------
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const isJobPost = await getState('isJobPost');
  if (!isJobPost) return;

  if (changeInfo.status === 'loading') {
    const url = changeInfo.url;
    const jobPostId = getParamFromUrl(url, currentJobIdParam);
    console.log('jobPostId: ', jobPostId); //removeEytan
    setState('jobPostId', jobPostId);
  }
  if (changeInfo.status === 'complete') {
    setState('isJobPost', isJobPostFn(tab.url));

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Send a message to the content script in the active tab
      chrome.tabs.sendMessage(tabs[0].id, { message: 'msg_tabs.onUpdated' });
    });
  }
});

// ------ Listen for keyboard shortcuts -----------------
chrome.commands.onCommand.addListener(async (command) => {
  const isJobPost = await getState('isJobPost');
  if (command === save_job_keystroke && isJobPost) {
    console.log('save_job_post');

    // trying to send message to content script to catch html element:

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Send a message to the content script in the active tab
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'msg_commands.onCommand',
      });
    });

    // if job post is saved already >> message "already saved"
    // if job post is not saved, use the already hashed key and html element and send them to the
  }
});

// ---Listen to tab changes, update isJobPost ---------
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('eta');

  const currentTab = await getCurrentTab();
  setState('isJobPost', isJobPostFn(currentTab.url));
});

// -- wait for content to load (onCompleted) ------
chrome.webNavigation.onCompleted.addListener(function (details) {
  // Check if the navigation occurred in the main frame
  if (details.frameId === 0) {
    console.log('Page finished loading:', details.url);

    chrome.tabs.sendMessage(details.tabId, { action: 'pageLoaded' });
  }
});

// tab updates
// wait to load
// sends message to content script

chrome.webNavigation.onDOMContentLoaded.addListener(() =>
  console.log('content loaded!')
);
