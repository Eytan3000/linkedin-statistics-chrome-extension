// * copy the classnames as is

const JobPostClass = 'jobs-search__job-details--wrapper';

// -- divs to remove: --
const mapImage = 'jobs-premium-applicant-insights__applicant-location-map';
const lastPremiumCard =
  'jobs-premium-company-insights artdeco-card premium-accent-bar';
const aboutTheCompany =
  'jobs-company jobs-box--fadein mb4 jobs-company--two-pane';
const premiumFeatures = 'coach-shared-hscroll-bar__multi-container';
const easyApply = 'jobs-s-apply jobs-s-apply--fadein inline-flex mr2';
const saveButton =
  'jobs-save-button artdeco-button artdeco-button--3 artdeco-button--secondary';
const resetMapButton = 'jobs-premium-applicant-insights__reset-map-button p2';

// div to hash:
const jobTitleClass = 'job-details-jobs-unified-top-card__job-title';
const comanyContainer = 'job-details-jobs-unified-top-card__company-name';
// --------------------------------------------------------------------------

// job post html element catch: ----------------------------------------

const divsToRemove = [
  mapImage,
  lastPremiumCard,
  aboutTheCompany,
  premiumFeatures,
  easyApply,
  saveButton,
  resetMapButton,
];

// -- Helpers --------------------
function wait(sec: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, sec * 1000);
  });
}
function formatClassNameForQuerySelector(className: string) {
  return '.' + className.replaceAll(' ', '.'); // 'main-div flex'>>'.main-div.flex'
}
async function retryUntilNotNull(divClass: string) {
  // divClass is what you copy from the classname of the div, with spaces
  const divToGet = formatClassNameForQuerySelector(divClass);
  console.log('divToGet: ', divToGet); //removeEytan
  return new Promise(async (resolve, reject) => {
    let divToRemove = null;
    let count = 0;
    while (divToRemove === null) {
      count++;
      if (count > 10) reject(`className: ${divClass} not found!`);
      await wait(0.5);
      divToRemove = document.querySelector(divToGet);
    }
    console.log(`Waited 0.5 sec ${count} times.`);
    resolve(divToRemove);
  });
}

type MessageType = 'jobPostHtml';
export interface Message {
  message: string;
  type: MessageType;
}
// Send a message from content script to background script
function sendToBg(message: string, type: MessageType) {
  chrome.runtime.sendMessage({ message, type }, function (response) {
    console.log('Response from background script:', response);
  });
}

// -- Listen to background ---
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  // Check if the message action is "pageLoaded"
  // if (message.action === 'pageLoaded') {
  //   // Perform actions here after the page has finished loading
  //   console.log('Content script received message: Page finished loading.');
  // }

  // User clicks on a job on left column:
  if (
    message.message === 'msg_tabs.onUpdated' ||
    message.action === 'pageLoaded'
  ) {
    try {
      const jobPostEl = (await retryUntilNotNull(
        JobPostClass
      )) as HTMLElement | null;

      const clonedJobPostEl = jobPostEl.cloneNode(true) as HTMLElement | null; // if you dont clone the element, all changes will affect the actual DOM.

      divsToRemove.forEach((className) => {
        const elementToRemove = clonedJobPostEl.querySelector(
          formatClassNameForQuerySelector(className)
        );
        if (elementToRemove) {
          elementToRemove.remove();
        }
      });

      sendToBg(clonedJobPostEl.outerHTML, 'jobPostHtml');

      // ------------------------------------------------------
    } catch (err) {
      console.error(err);
    }
  }
  if (message.message === 'msg_commands.onCommand') {
    console.log('received message: msg_commands.onCommand');

    const divToRemove2 = document.querySelector(
      '.jobs-premium-company-insights.artdeco-card.premium-accent-bar'
    );

    console.log('onCommand - divToRemove2: ', divToRemove2); //removeEytan
  }
});
