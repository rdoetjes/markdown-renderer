const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="output"><pre><code class="language-go">func main() {}</code></pre></div></body></html>`);
global.window = dom.window;
global.document = dom.window.document;
global.Prism = require('prismjs');
require('prismjs/components/prism-go');

Prism.highlightAllUnder(document.getElementById("output"));
console.log(document.getElementById("output").innerHTML);
