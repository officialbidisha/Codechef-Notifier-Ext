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
button.addEventListener('click', () => {
    /**
     * Notifications
     */
    chrome.runtime.sendMessage('', {
        type: 'notification',
        options: {
          title: 'Just wanted to notify you',
          message: 'How great it is!',
          type: 'basic',
          iconUrl:'./images/codechef_thumbnail.jpg'
        }
      });
});