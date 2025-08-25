---
description: Code

next:
  text: CodeBlock
  link: /extensions/CodeBlock/index.md
---

# Code

The Code extension allows you to add code to your editor.

- Based on TipTap's Code extension. [@tiptap/extension-code](https://tiptap.dev/docs/editor/extensions/marks/code)

## Usage

```tsx
import { Code } from '@remarkablejames/rich-text-editor/code'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Code // [!code ++]
];
```
