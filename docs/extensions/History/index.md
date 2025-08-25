---
description: History

next:
  text: HorizontalRule
  link: /extensions/HorizontalRule/index.md
---

# History

The History extension allows you to undo and redo changes in your editor.

- Based on TipTap's highlight extension. [@tiptap/extension-history](https://www.npmjs.com/package/@tiptap/extension-history)

## Usage

```tsx
import { History } from '@remarkablejames/rich-text-editor/history'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  History // [!code ++]
];
```
