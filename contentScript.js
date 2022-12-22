let btn;

window.addEventListener(
  "load",
  function () {
    let bodyText = document.body.innerText;
    btn = document.getElementById("submit_btn");
    this.setTimeout(() => {
      chrome.runtime.sendMessage({
        action: "receiveBodyText",
        bodyText: bodyText,
      });
    }, 1000);
  },
  false
);

chrome.runtime.onMessage.addListener((message) => {
  chrome.runtime.sendMessage("", {
    type: "notification",
    options: {
      title: "Hello CodeChefer",
      message: `Submission of problem ${message?.problemId} is ${message?.resultCode}`,
      iconUrl: "./images/codechef_thumbnail.jpg",
      type: "basic",
    },
  });
});
