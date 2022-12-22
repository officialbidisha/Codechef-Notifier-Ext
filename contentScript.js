// chrome.runtime.onMessage.addListener((message) => {
//     /*
//     * query DOM to get problem name and code
//     * user sendResponse method to send info back to the sender
//     * as a JSON object.
//     */
//    document.body.innerHTML = 'HELLO WORLD';
//    console.log(message);
// });

const button = document.createElement("button");
button.textContent = "Greet me!";
document.body.insertAdjacentElement("afterbegin", button);

window.addEventListener(
  "load",
  function () {
    let bodyText = document.body.innerText;
    this.setTimeout(() => {
      chrome.runtime.sendMessage({
        action: "receiveBodyText",
        bodyText: bodyText,
      });
    }, 1000);
  },
  false
);

button.addEventListener("click", () => {
  /**
   * Notifications
   */
  console.log("cons", all_headings);
  chrome.runtime.sendMessage("", {
    type: "notification",
    options: {
      title: "hey",
      message: "How great it is!",
      type: "basic",
      iconUrl: "./images/codechef_thumbnail.jpg",
      contextMessage: all_headings,
    },
  });
});
