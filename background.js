var currentTab;
var version = "1.0";
let problemId;
let response;



chrome.tabs.onUpdated.addListener(async () => {
  chrome.tabs.query(
    //get current Tab
    {
      currentWindow: true,
      active: true,
    },
    function (tabArray) {
      currentTab = tabArray[0];
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
});

function onAttach(tabId) {
  chrome.debugger
    .sendCommand(
      {
        //first enable the Network
        tabId: tabId,
      },
      "Network.enable"
    )
}
chrome.debugger.onEvent.addListener(allEventHandler);

function allEventHandler(debuggeeId, message, params) {
  if (currentTab.id != debuggeeId.tabId) {
    return;
  }

  if (message == "Network.responseReceived") {
    chrome.debugger.sendCommand(
      {
        tabId: debuggeeId.tabId,
      },
      "Network.getResponseBody",
      {
        requestId: params.requestId,
      },
      function (response) {
        if (response?.body) {
          try {
            let res = JSON.parse(response.body);
            // console.log(
            //   "Parsed Response",
            //   res?.upid + " " + res?.result_code + " " + res?.time
            // );
            response = res;

            if (
              res?.upid &&
              (res?.result_code == "accepted" ||
                res?.result_code == "compile" || res?.result_code === "wrong") &&
              res?.time
            ) {
              chrome.tabs.sendMessage(currentTab.id, {
                problemId: problemId,
                resultCode:
                  res?.result_code === "compile"
                    ? "having compilation error"
                    : res?.result_code,
              });
            }
          } catch (e) {}
        }
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
      problemId = sender.tab.url.substring(sender.tab.url.lastIndexOf("/") + 1);
      break;
    }
  }

  if (message && message.type === "notification") {
    isTypeNotification = true;

    let datum = {
      ...message.options,
    };

    chrome.notifications.create("", datum);
  }
});
