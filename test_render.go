package main

import (
    "fmt"
    "github.com/gomarkdown/markdown"
    "github.com/gomarkdown/markdown/ast"
    "github.com/gomarkdown/markdown/html"
    "github.com/gomarkdown/markdown/parser"
    "io"
)

func main() {
    input := "```go\nfunc main() {}\n```"
    extensions := parser.CommonExtensions | parser.FencedCode
    p := parser.NewWithExtensions(extensions)
    doc := p.Parse([]byte(input))
    
    opts := html.RendererOptions{
        RenderNodeHook: func(w io.Writer, node ast.Node, entering bool) (ast.WalkStatus, bool) {
            if code, ok := node.(*ast.CodeBlock); ok && entering {
                lang := string(code.Info)
                if lang == "" { lang = "text" }
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
    fmt.Println(string(output))
}
