---
title: "Local Markdown lexer"
area: docs
type: reference
tags: [dependency, security]
updated: 2026-10-23
---

# Local Markdown lexer

Marked 17.0.5 is bundled from the official package in the workspace dependency runtime. Its MIT licence is retained alongside the unchanged UMD distribution. SHA-256: `0db7abc826b5ac76f6ed11951ae34074ba50438ce6ea8d52889203779e5cbbad`.

The reader calls the lexer only. Tokens become allowed DOM nodes and source strings become text. Imported HTML is inert, unsafe URL schemes are refused, and images are explicit links. No HTML parser, source-string HTML sink, CDN or remote rendering service is used. Reader source files must be listed in the bundled public directory.
