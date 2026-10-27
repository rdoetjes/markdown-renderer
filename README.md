# Markdown Renderer

## Table contents


* [Markdown Renderer](#markdown-renderer)
  * [Table contents](#table-contents)
* [Introduction](#introduction)
  * [Architecture](#architecture)
    * [Building the solution](#building-the-solution)

---
# Introduction
Markdown rendered is a web application that real time renders you mark down to HTML, so you can see what it will look like once rendered in HTML. 

Markdown Renderer also has some basic features to help your markdown editing, this way you do not have to remember that bold is ** or that a numbered lists is 1. etc

You can ofcourse type the markdown yourself too in the markdown window, what ever you fancy. You can safe the markdown as the HTML as it is rendered but you can also safe the markdown it self.

**This document is created with this tool.**

## Architecture
The architecture is based around an html+javascript front end that handles the ui.

The actual rendering of the HTML is done using a wasm application that is compiled in Go.

### Building the solution

There's a make file that you call using

```
make install DEST=<target_directory>
```

This will call make all and then copy the artefacts to your target directory.
