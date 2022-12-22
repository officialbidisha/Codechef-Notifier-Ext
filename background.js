(function () {
  try {
    chrome.webRequest.onCompleted.addListener(
      function (details) {
        // console.log("Details res obj", details);
      },
      { urls: ["<all_urls>"] },
      []
    );
  } catch (err) {
    console.log("Error", err);
  }
})();

var currentTab;
var version = "1.0";
let result;
let isTypeNotification = true;


chrome.tabs.onActivated.addListener(async () => {

    chrome.tabs.query(
      //get current Tab
      {
        currentWindow: true,
        active: true,
      },
      function (tabArray) {
        currentTab = tabArray[0];
        console.log("Current tab", currentTab);
        if (!currentTab.url.startsWith("chrome:")) {
          chrome.debugger.attach(
            {
              //debug at current tab
              tabId: currentTab.id,
            },
            version,
            onAttach.bind(null, currentTab.id)
          );
        }
      }
    );
  }
);

function onAttach(tabId) {
  chrome.debugger
    .sendCommand(
      {
        //first enable the Network
        tabId: tabId,
      },
      "Network.enable"
    )
    .then((res) => {
      console.log(res);
    })
    .catch((e) => console.error("ERROR", e));

  chrome.debugger.onEvent.addListener(allEventHandler);
}

function allEventHandler(debuggeeId, message, params) {
  debugger;
  if (currentTab.id != debuggeeId.tabId) {
    return;
  }

  if (message == "Network.responseReceived") {
    debugger;
    chrome.debugger.sendCommand(
      {
        tabId: debuggeeId.tabId,
      },
      "Network.getResponseBody",
      {
        requestId: params.requestId,
      },
      function (response) {
        debugger;
        let res = JSON.parse(response.body);
        console.log("Parsed Response", res);
          isTypeNotification=false;
        
        chrome.debugger.detach(debuggeeId);
      }
    );
  }
}

chrome.runtime.onMessage.addListener(function (message, sender) {
  if (!message || typeof message !== "object" || !sender.tab) {
    return;
  }

  switch (message.action) {
    case "receiveBodyText": {
      result = sender.tab.url.substring(sender.tab.url.lastIndexOf("/") + 1);
      break;
    }
  }

  if (message && message.type === "notification") {
    isTypeNotification = true;
    let datum = { ...message.options, message: `Problem ${result} is solved` };
    chrome.notifications.create("", datum);
  }
});
