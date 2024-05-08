// // TODO: background script
// chrome.runtime.onInstalled.addListener(() => {
//   // TODO: on installed function
// })


// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("Message from content script:", message);
  
  // Send a response back to the content script
  sendResponse({ reply: "Message received by background script!" });
});
