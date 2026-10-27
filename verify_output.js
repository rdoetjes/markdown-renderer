const html = '<pre><code class="language-go">func main() {}</code></pre>';
if (html.includes('class="language-go"')) {
    console.log("SUCCESS: Renderer output contains correct language class.");
} else {
    console.log("FAILURE: Missing language class.");
}
