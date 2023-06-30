const { JSDOM } = require('jsdom');

async function crawlPage (baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }
  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }
  pages[normalizedCurrentURL] = 1;
  console.log(`Actively crawling ${currentURL}`);
  try {
    const resp = await fetch(currentURL);
    // check for status code
    if (resp.status > 399) {
      console.log(`Error with status code: ${resp.status} fetching ${currentURL}`);
      return pages;
    }
    // check for content type
    const contentType = resp.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log(`Can not crawl non-html websites, content-type ${contentType}`);
      return pages;
    }
    const HTMLbody = await resp.text();
    const nextURLs = getURLsFromHTML(HTMLbody, baseURL);
    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (err) {
    console.log(`Error in fetch ${err} on page ${currentURL}`);
  }
  return pages;
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
