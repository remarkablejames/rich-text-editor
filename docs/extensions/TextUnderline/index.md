---
description: UnderLine

next:
  text: Video
  link: /extensions/Video/index.md
---

# UnderLine

 The UnderLine extension allows you to underline text in your editor.

 - Based on TipTap's underline extension. [@tiptap/extension-underline](https://tiptap.dev/docs/editor/extensions/marks/underline)

## Usage

```tsx
import { TextUnderline } from '@remarkablejames/rich-text-editor/textunderline'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  TextUnderline // [!code ++]
];
```
