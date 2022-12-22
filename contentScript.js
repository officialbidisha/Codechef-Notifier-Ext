let btn;

function attachEventListener(){

  btn.addEventListener("click", () => {
    /**
     * Notifications
     */
    chrome.runtime.sendMessage("", {
      type: "notification",
      options: {
        title: "hey",
        message: "How great it is!",
        iconUrl: "./images/codechef_thumbnail.jpg",
        type: "basic",
      },
    });
  });
}

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
    attachEventListener();
  },
  false
);




