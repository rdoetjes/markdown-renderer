function updateOutput() {
    const input = document.getElementById("input").value;
    if (typeof renderMarkdown === "function") {
        document.getElementById("output").innerHTML = renderMarkdown(input);
        Prism.highlightAll();
    }
}

function insertList(prefix) {
    const textarea = document.getElementById('input');
    const start = textarea.selectionStart;
    const text = textarea.value;
    
    // Find the beginning of the current line
    let lineStart = text.lastIndexOf('\n', start - 1) + 1;
    
    textarea.value = text.substring(0, lineStart) + prefix + text.substring(lineStart);
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    updateOutput();
}

document.getElementById('input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const textarea = this;
        const start = textarea.selectionStart;
        const text = textarea.value;
        
        // Find start of the current line
        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        const currentLine = text.substring(lineStart, start);
        
        // Check for list markers
        const bulletMatch = currentLine.match(/^- \s*/);
        const numberMatch = currentLine.match(/^(\d+)\.\s*/);
        
        if (bulletMatch && currentLine.trim() !== '-') {
            e.preventDefault();
            textarea.value = text.substring(0, start) + '\n- ' + text.substring(start);
            textarea.setSelectionRange(start + 3, start + 3);
            updateOutput();
        } else if (numberMatch && currentLine.trim() !== numberMatch[0].trim()) {
            e.preventDefault();
            // Markdown list renumbering: always use '1.' to allow the renderer to handle sequencing
            textarea.value = text.substring(0, start) + '\n1. ' + text.substring(start);
            textarea.setSelectionRange(start + 4, start + 4);
            updateOutput();
        } else if ((bulletMatch && currentLine.trim() === '-') || (numberMatch && currentLine.trim() === numberMatch[0].trim())) {
            // If empty list marker, press enter to remove it and jump to new line
            e.preventDefault();
            textarea.value = text.substring(0, lineStart) + text.substring(start);
            textarea.setSelectionRange(lineStart, lineStart);
            updateOutput();
        }
    }
});

function insertStyle(prefix, suffix) {
    const textarea = document.getElementById('input');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    
    textarea.value = text.substring(0, start) + prefix + selection + suffix + text.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    updateOutput();
    
    // Close all dropdowns
    document.querySelectorAll('.dropdown-content').forEach(el => el.style.display = 'none');
    setTimeout(() => {
        document.querySelectorAll('.dropdown-content').forEach(el => el.style.display = '');
    }, 100);
}

function applyAlignment(align) {
    const textarea = document.getElementById('input');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    
    const replacement = `<div style="text-align: ${align};">${selection}</div>`;
    textarea.value = text.substring(0, start) + replacement + text.substring(end);
    
    // Set cursor position after the opening tag: <div ...>|
    const cursorOffset = start + `<div style="text-align: ${align};">`.length;
    textarea.focus();
    textarea.setSelectionRange(cursorOffset, cursorOffset);
    updateOutput();
}

function generateIndex() {
    const textarea = document.getElementById('input');
    const text = textarea.value;
    const lines = text.split('\n');
    let indexMd = '\n';

    // Regex to match headers (e.g., # Header, ## Subheader)
    const headerRegex = /^(#{1,6})\s+(.+)$/;

    lines.forEach(line => {
        const match = line.match(headerRegex);
        if (match) {
            const level = match[1].length;
            const title = match[2].trim();
            // Create a slug for the anchor link
            const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            
            // Indent based on header level
            // For markdown nesting (e.g. 1st level = 0 indent, 2nd = 1, etc.)
            const indent = '  '.repeat(level - 1);
            indexMd += `${indent}* [${title}](#${slug})\n`;
        }
    });

    textarea.value = textarea.value.substring(0, textarea.selectionStart) + indexMd + textarea.value.substring(textarea.selectionStart);
    updateOutput();
}

function openTableModal() {
    document.getElementById('table-modal').style.display = 'block';
}

function closeTableModal() {
    document.getElementById('table-modal').style.display = 'none';
}

function openColorModal() {
    document.getElementById('color-modal').style.display = 'block';
}

function closeColorModal() {
    document.getElementById('color-modal').style.display = 'none';
}

function openLinkModal() {
    document.getElementById('link-modal').style.display = 'block';
}

function closeLinkModal() {
    document.getElementById('link-modal').style.display = 'none';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function insertMedia(type) {
    currentType = type;
    document.getElementById('modal-title').innerText = 'Insert ' + (type === 'image' ? 'Image' : 'Video');
    document.getElementById('image-options').style.display = (type === 'image' ? 'block' : 'none');
    document.getElementById('video-options').style.display = (type === 'video' ? 'block' : 'none');
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

function applyColor() {
    const color = document.getElementById('text-color').value;
    const text = document.getElementById('color-text').value;
    const textarea = document.getElementById('input');
    
    if (text) {
        textarea.value += `\n<span style="color: ${color};">${text}</span>\n`;
    } else {
        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        if (selectedText) {
            const replacement = `<span style="color: ${color};">${selectedText}</span>`;
            textarea.value = textarea.value.substring(0, textarea.selectionStart) + replacement + textarea.value.substring(textarea.selectionEnd);
        } else {
            textarea.value += `\n<span style="color: ${color};">Your text here</span>\n`;
        }
    }
    document.getElementById('color-text').value = '';
    updateOutput();
    closeColorModal();
}

function applyLink() {
    const text = document.getElementById('link-text').value;
    const url = document.getElementById('link-url').value;
    const textarea = document.getElementById('input');
    
    if (text && url) {
        textarea.value += `\n[${text}](${url})\n`;
    }
    document.getElementById('link-text').value = '';
    document.getElementById('link-url').value = '';
    updateOutput();
    closeLinkModal();
}

function applyMedia() {
    const url = document.getElementById('media-url').value;
    const desc = document.getElementById('media-desc').value;
    const textarea = document.getElementById('input');
    
    if (currentType === 'image') {
        textarea.value += `\n![${desc}](${url})\n`;
    } else {
        const height = document.getElementById('vid-height').value;
        let embedUrl = url;
        if (url.includes('youtube.com/watch?v=')) embedUrl = url.replace('watch?v=', 'embed/');
        else if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
        else if (url.includes('youtube.com/shorts/')) embedUrl = url.replace('youtube.com/shorts/', 'youtube.com/embed/');
        
        textarea.value += `\n<iframe width="100%" height="${height}" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>\n`;
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
