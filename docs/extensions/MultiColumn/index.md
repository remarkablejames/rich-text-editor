---
description: MultiColumn

next:
  text: OrderedList
  link: /extensions/OrderedList/index.md
---

# Multi Column

The MultiColumn extension allows you to create multi-column layouts in your editor.

## Usage

```tsx
import { ColumnActionButton } from '@remarkablejames/rich-text-editor/multicolumn'; // [!code ++]

const extensions = [
  ...,
  // Import Extensions Here
  ColumnActionButton,  // [!code ++]
];

```
