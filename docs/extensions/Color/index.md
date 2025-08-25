---
description: Color

next:
  text: Document
  link: /extensions/Document/index.md
---

# Color

The Color extension allows you to add color to your editor.

- Based on TipTap's Color extension. [@tiptap/extension-color](https://tiptap.dev/docs/editor/extensions/functionality/color)

## Usage

```tsx
import { Color } from '@remarkablejames/rich-text-editor/color'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  Color // [!code ++]
];
```

## Options

### colors

Type: `string[]`\
Default: `undefined`

An array of color options to display in the color picker. If not provided, a default set of colors will be used.

```js
import { COLORS_LIST } from '@remarkablejames/rich-text-editor'
```

### defaultColor

Type: `string`\
Default: `undefined`

```js
import { DEFAULT_COLOR } from '@remarkablejames/rich-text-editor'
```

### initialDisplayedColor

Type: `string`\
Default: `undefined`

The initial color to be displayed in the action button. If not provided, a default color will be used.
