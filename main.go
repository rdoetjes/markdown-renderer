package main

import (
	"fmt"
	"io"
	"syscall/js"

	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/ast"
	"github.com/gomarkdown/markdown/html"
	"github.com/gomarkdown/markdown/parser"
)

func renderMarkdown(this js.Value, args []js.Value) interface{} {
	input := args[0].String()

	extensions := parser.CommonExtensions | parser.AutoHeadingIDs | parser.Tables | parser.FencedCode | parser.Strikethrough
	p := parser.NewWithExtensions(extensions)
	doc := p.Parse([]byte(input))

	htmlFlags := html.CommonFlags | html.HrefTargetBlank
	opts := html.RendererOptions{
		Flags: htmlFlags,
		RenderNodeHook: func(w io.Writer, node ast.Node, entering bool) (ast.WalkStatus, bool) {
			if code, ok := node.(*ast.CodeBlock); ok && entering {
				lang := string(code.Info)
				if lang == "" {
					lang = "text"
				}
				w.Write([]byte("<pre><code class=\"language-" + lang + "\">"))
				w.Write(code.Literal)
				w.Write([]byte("</code></pre>"))
				return ast.SkipChildren, true
			}
			return ast.GoToNext, false
		},
	}
	renderer := html.NewRenderer(opts)

	output := markdown.Render(doc, renderer)

	return js.ValueOf(string(output))
}

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("renderMarkdown", js.FuncOf(renderMarkdown))
	fmt.Println("WASM Initialized")
	<-c
}
