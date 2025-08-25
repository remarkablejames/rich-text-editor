---
description: Attachment

next:
  text: ImageGif
  link: /extensions/ImageGif/index.md
---

# Attachment

Attachment is a node extension that allows you to add an Attachment to your editor.

## Usage

```tsx
import { Attachment } from '@remarkablejames/rich-text-editor/attachment'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Attachment.configure({// [!code ++]
    upload: (file: any) => {// [!code ++]
      // upload file to server return url
    },// [!code ++]
  }),// [!code ++]
];
```
