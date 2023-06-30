const { JSDOM } = require('jsdom');

async function crawlPage (currentURL) {
  console.log(`Actively crawling ${currentURL}`);
  try {
    const resp = await fetch(currentURL);
    // check for status code
    if (resp.status > 399) {
      console.log(`Error with status code: ${resp.status} fetching ${currentURL}`);
      return;
    }
    // check for content type
    const contentType = resp.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log(`Can not crawl non-html websites, content-type ${contentType}`);
      return;
    }
    console.log(await resp.text());
  } catch (err) {
    console.log(`Error in fetch ${err} on page ${currentURL}`);
  }
}

function getURLsFromHTML (htmlbody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlbody);
  const linkElements = dom.window.document.querySelectorAll('a');
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === '/') {
      // relative path
      try {
        const URLobj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(`${URLobj.href}`);
      } catch (err) {
        console.log(`Invalid relative path ${err.message}`);
      }
    } else {
      // absolute path
      try {
        const URLobj = new URL(`${linkElement.href}`);
        urls.push(`${URLobj.href}`);
      } catch (err) {
        console.log(`Invalid relative path ${err.message}`);
      }
    }
  }
  return urls;
}

function normalizeURL (URLstring) {
  const urlObj = new URL(URLstring);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  normalizeURL, getURLsFromHTML, crawlPage
};
