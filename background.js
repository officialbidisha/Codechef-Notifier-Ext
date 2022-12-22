(function () {
  try {
    chrome.webRequest.onCompleted.addListener(
      function (details) {
        console.log("Details res obj", details);
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

async function onTab()  {
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
};

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
    .catch((e) => console.error("ERROR",e));

  chrome.debugger.onEvent.addListener(allEventHandler);
}

function allEventHandler(debuggeeId, message, params) {
  console.log("M", message, "params", params);
  if (currentTab.id != debuggeeId.tabId) {
    return;
  }

  if (message == "Network.responseReceived") {
    //response return
    chrome.debugger.sendCommand(
      {
        tabId: debuggeeId.tabId,
      },
      "Network.getResponseBody",
      {
        requestId: params.requestId,
      },
      function (response) {
        console.log("Respo", response);
        // you get the response body here!
        // you can close the debugger tips by:
        let res = JSON.parse(response.body);
        console.log("Parsed Response", res);
        chrome.debugger.detach(debuggeeId);
      }
    );
  }
}

chrome.runtime.onMessage.addListener(data => {
  if (data.type === 'notification') {
    chrome.notifications.create('', data.options);
  }
});