import inspector from './inspector';
import './content.scss';
import dom from './dom';

chrome.runtime.onMessage.addListener(msg => {
  console.log('content message: ');
  console.dir(msg);

  if (msg.type === 'startScanning') {
    inspector.start();
  }

  if (msg.type === 'startAdding') {
    inspector.start(msg.data.model || null);
  }

  if (msg.type === 'stopInspecting') {
    inspector.stop();
  }

  if (msg.type === 'showMatches') {
    const { locator } = msg.data;

    let matches;

    switch (locator.name) {
      case 'xpath':
        matches = dom.findElementsByXPath(document, locator.locator);
        break;
      case 'css':
        matches = dom.findElementsByCssSelector(document, locator.locator);
        break;
      case 'name':
        matches = dom.findElementsByName(document, locator.locator);
        break;
      case 'tagName':
        matches = dom.findElementsByTagName(document, locator.locator);
        break;
      case 'tagIndex':
        matches = dom.findElementsByTagIndex(document, locator.locator);
        break;
      case 'className':
        matches = dom.findElementsByClassName(document, locator.locator);
        break;
      case 'id':
        matches = dom.findElementsById(document, locator.locator);
        break;
      case 'linkText':
        matches = dom.findElementsByLinkText(document, locator.locator);
        break;
      case 'partialLinkText':
        matches = dom.findElementsByPartialLinkText(document, locator.locator);
        break;
      default:
        console.error(`Unexpected locator ${locator}`);
    }

    matches = [...matches];

    if (matches.length === 0) {
      chrome.runtime.sendMessage({ type: 'contentPopupError', data: { message: `0 elements match that locator` } });
      return;
    }
    if (matches.length === 1) {
      chrome.runtime.sendMessage({ type: 'contentPopupSuccess', data: { message: `1 element matches that locator` } });
    }
    if (matches.length > 1) {
      chrome.runtime.sendMessage({ type: 'contentPopupWarning', data: { message: `${matches.length} elements match that locator` } });
    }

    matches[0].scrollIntoViewIfNeeded();

    matches.forEach(el => {
      el.classList.add('page-modeller-highlight');
      setTimeout(() => {
        el.classList.remove('page-modeller-highlight');
      }, 3000);
    });
  }
});
