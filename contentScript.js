// chrome.runtime.onMessage.addListener((message) => {
//     /*
//     * query DOM to get problem name and code
//     * user sendResponse method to send info back to the sender
//     * as a JSON object.
//     */
//    document.body.innerHTML = 'HELLO WORLD';
//    console.log(message);
// });



const button = document.createElement('button');
button.textContent = 'Greet me!'
document.body.insertAdjacentElement('afterbegin', button);
var tags = [ "h1" ];
var all_headings = [];


var h1s = document.querySelectorAll("h1");
all_headings.push(document.body.innerHTML);
var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?codechef\.com/;

// A function to use as callback
function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
}

// When the browser-action button is clicked...w
window.addEventListener('load',function (tab) {
    // ...check the URL of the active tab against our pattern and...
    if (urlRegex.test(tab.url)) {
        // ...if it matches, send a message specifying a callback too
        chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
    }
});
// window.addEventListener('load', function(){
//     let bodyText = document.body;
//     this.setTimeout(()=>{
//         chrome.runtime.sendMessage({
//             action: 'receiveBodyText',
//             bodyText: bodyText
//         });
//     }, 2000)

// });

button.addEventListener('click', () => {
    /**
     * Notifications
     */
    console.log('cons',all_headings);
    chrome.runtime.sendMessage('', {
        type: 'notification',
        options: {
          title: 'hey',
          message: 'How great it is!',
          type: 'basic',
          iconUrl:'./images/codechef_thumbnail.jpg',
          contextMessage:all_headings
        }
      });
});
