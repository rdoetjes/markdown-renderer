// Move all logic here, keep it simple
function updateOutput() {
    const input = document.getElementById("input").value;
    console.log("updateOutput called, renderMarkdown exists:", typeof renderMarkdown === "function");
    if (typeof renderMarkdown === "function") {
        document.getElementById("output").innerHTML = renderMarkdown(input);
        Prism.highlightAll();
    }
}
// ... rest of the functions

let currentType = '';

function openTableModal() {
    document.getElementById('table-modal').style.display = 'block';
}

function closeTableModal() {
    document.getElementById('table-modal').style.display = 'none';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function insertMedia(type) {
    currentType = type;
    document.getElementById('modal-title').innerText = 'Insert ' + (type === 'image' ? 'Image' : 'Video');
    document.getElementById('image-options').style.display = (type === 'image' ? 'block' : 'none');
    document.getElementById('modal').style.display = 'block';
}

function generateTable() {
    const rows = parseInt(document.getElementById('table-rows').value);
    const cols = parseInt(document.getElementById('table-cols').value);
    const textarea = document.getElementById('input');
    
    let tableMd = '\n|' + ' Header |'.repeat(cols) + '\n|' + ' --- |'.repeat(cols) + '\n';
    for (let i = 0; i < rows; i++) {
        tableMd += '|' + ' Cell |'.repeat(cols) + '\n';
    }
    
    textarea.value += tableMd + '\n';
    updateOutput();
    closeTableModal();
}

function applyMedia() {
    const url = document.getElementById('media-url').value;
    const desc = document.getElementById('media-desc').value;
    const textarea = document.getElementById('input');
    
    if (currentType === 'image') {
        textarea.value += `\n![${desc}](${url})\n`;
    } else {
        textarea.value += `\n<video controls width="500"><source src="${url}"></video>\n`;
    }
    updateOutput();
    closeModal();
}

async function downloadFile(type) {
    let content = '';
    let filename = '';
    let mime = '';

    if (type === 'md') {
        content = document.getElementById('input').value;
        filename = 'document.md';
        mime = 'text/markdown';
    } else {
        let css = await fetch('style.css').then(r => r.text());
        let prismCss = await fetch('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css').then(r => r.text());
        
        content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>${prismCss}</style>
    <style>${css}</style>
</head>
<body>
    <div id="output">${document.getElementById('output').innerHTML}</div>
</body>
</html>`;
        filename = 'document.html';
        mime = 'text/html';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
