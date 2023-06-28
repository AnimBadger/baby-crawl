const { JSDOM } = require('jsdom');

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
  normalizeURL, getURLsFromHTML
};
