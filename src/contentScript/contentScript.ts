// * copy the classnames as is

const JobPostClass = 'jobs-search__job-details--wrapper';
const jobTitleClass = '.job-details-jobs-unified-top-card__job-title';
// --------------------------------------------------------------------------

// job post html element catch: ----------------------------------------

const jobTitleHtmlElement = document.querySelector(jobTitleClass);
const entireJobPostHtmlEl = document.querySelector(JobPostClass);

const divsToRemove = [
  'jobs-premium-applicant-insights__applicant-location-map',
  'jobs-premium-company-insights artdeco-card premium-accent-bar',
  'jobs-company jobs-box--fadein mb4 jobs-company--two-pane',
  'coach-shared-hscroll-bar__multi-container',
  'jobs-s-apply jobs-s-apply--fadein inline-flex mr2',
  'jobs-save-button artdeco-button artdeco-button--3 artdeco-button--secondary',
  'jobs-premium-applicant-insights__reset-map-button p2',
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

// entireJobPostHtmlEl.removeChild()
// console.log(entireJobPostHtmlEl.outerHTML);

// let actualJobTitle: string;
// if (entireJobPostHtmlEl) {
// //   actualJobTitle = entireJobPostHtmlEl.textContent.trim();
//   console.log(entireJobPostHtmlEl);
// } else {
//   console.log('Element not found.');
// }

// // Send a message from content script to background script
// chrome.runtime.sendMessage(
//   { message: entireJobPostHtmlEl.outerHTML },
//   function (response) {
//     console.log('Response from background script:', response);
//   }
// );

// -- Listen to background ---
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.message === 'myMessage') {
//     console.log('received message');
//     const x = document.querySelector(
//       '.jobs-premium-company-insights.artdeco-card.premium-accent-bar'
//     );
//     console.log('x: ', x); //removeEytan
//   }
// });

// -----------------------------
// Listen for messages from the background script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  // Check if the message action is "pageLoaded"
  if (message.action === 'pageLoaded') {
    // Perform actions here after the page has finished loading
    console.log('Content script received message: Page finished loading.');

    // const x = document.querySelector(
    //   '.jobs-premium-company-insights.artdeco-card.premium-accent-bar'
    // );
    // console.log('pageLoadedX: ', x); //removeEytan
  }

  // User clicks on a job on left column:
  if (message.message === 'msg_tabs.onUpdated') {
    try {
      const jobPostEl = (await retryUntilNotNull(
        JobPostClass
      )) as HTMLElement | null;
      console.log(jobPostEl);

      const clonedJobPostEl = jobPostEl.cloneNode(true) as HTMLElement | null; // if you dont clone the element, all changes will affect the actual DOM.

      divsToRemove.forEach((className) => {
        const elementToRemove = clonedJobPostEl.querySelector(
          formatClassNameForQuerySelector(className)
        );
        if (elementToRemove) {
          elementToRemove.remove();
        }
      });

      console.log('124: ', clonedJobPostEl);

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
