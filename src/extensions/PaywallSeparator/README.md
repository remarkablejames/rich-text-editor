# PaywallSeparator Extension

A TipTap/ProseMirror extension that creates a paywall separator, similar to Patreon's paywall line. This extension allows content creators to visually separate free content from premium content in their documents.

## Features

- **Block-level node**: Behaves like a horizontal rule but with distinct paywall styling
- **Single paywall per document**: Prevents inserting more than one paywall separator
- **Draggable and insertable**: Can be placed anywhere in the document
- **Custom NodeView**: Displays a visual overlay for content creators
- **HTML serialization**: Serializes to/from `<hr data-paywall="true" />`
- **JSON serialization**: Works with TipTap's document schema
- **Keyboard shortcut**: `Mod+Alt+P` to insert paywall
- **Command support**: `insertPaywall` command available

## Installation

```bash
npm install @remarkablejames/rich-text-editor
```

## Usage

### Basic Usage

```typescript
import { Editor } from '@tiptap/react'
import { PaywallSeparator } from '@remarkablejames/rich-text-editor/paywallseparator'

const editor = useEditor({
  extensions: [
    // ... other extensions
    PaywallSeparator,
  ],
  content: '<p>Free content here</p><hr data-paywall="true" /><p>Premium content here</p>',
})
```

### With Configuration

```typescript
import { PaywallSeparator } from '@remarkablejames/rich-text-editor/paywallseparator'

const editor = useEditor({
  extensions: [
    PaywallSeparator.configure({
      HTMLAttributes: {
        class: 'my-paywall-separator',
      },
      // Show in toolbar
      toolbar: true,
      // Add spacing around button
      spacer: true,
    }),
  ],
})
```

### Programmatic Usage

```typescript
// Insert a paywall separator
editor.commands.insertPaywall()

// Check if paywall can be inserted (returns false if one already exists)
const canInsert = editor.can().insertPaywall()

// Check if paywall is active at current selection
const isActive = editor.isActive('paywallSeparator')
```

### Custom Button Integration

```typescript
import { PaywallSeparator } from '@remarkablejames/rich-text-editor/paywallseparator'

const editor = useEditor({
  extensions: [
    PaywallSeparator.configure({
      button: ({ editor, t }) => ({
        component: CustomButton,
        componentProps: {
          action: () => editor.commands.insertPaywall(),
          disabled: !editor.can().insertPaywall(),
          icon: 'PaywallIcon',
          tooltip: 'Insert paywall separator',
        },
      }),
    }),
  ],
})
```

## HTML Structure

The paywall separator renders as:

```html
<hr data-paywall="true" />
```

In the editor, it displays with a visual overlay:

```html
<div class="richtext-relative richtext-my-4 richtext-select-none">
  <hr class="richtext-h-[2px] richtext-border-0 richtext-bg-gradient-to-r richtext-from-orange-400 richtext-via-red-500 richtext-to-pink-500" />
  <div class="richtext-absolute richtext-inset-0 richtext-flex richtext-items-center richtext-justify-center">
    <div class="richtext-border richtext-border-orange-200 richtext-bg-white richtext-px-3 richtext-py-1 richtext-text-xs richtext-font-medium richtext-text-orange-700 richtext-rounded-lg richtext-shadow-sm">
      🔒 Paywall — Content below is premium
    </div>
  </div>
</div>
```

## JSON Schema

In TipTap's JSON format:

```json
{
  "type": "paywallSeparator"
}
```

## Commands

### `insertPaywall()`

Inserts a paywall separator at the current selection. Returns `false` if a paywall already exists in the document.

```typescript
editor.commands.insertPaywall()
```

## Keyboard Shortcuts

- `Mod+Alt+P`: Insert paywall separator

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `HTMLAttributes` | `Record<string, unknown>` | `{}` | HTML attributes to apply to the separator |
| `toolbar` | `boolean` | `true` | Show button in toolbar |
| `divider` | `boolean` | `false` | Show divider in toolbar |
| `spacer` | `boolean` | `false` | Add spacing around button |
| `button` | `ButtonView` | Default button config | Custom button configuration |

## Styling

The paywall separator uses a gradient background and includes a visual overlay. You can customize the appearance by targeting the generated classes or by providing custom `HTMLAttributes`.

### Custom CSS

```css
/* Target the paywall separator */
hr[data-paywall="true"] {
  background: linear-gradient(90deg, #your-colors);
  height: 3px;
  border: none;
}

/* Custom overlay styling */
.my-paywall-separator .richtext-absolute div {
  background: rgba(255, 255, 255, 0.9);
  color: #your-color;
}
```

## TypeScript

The extension exports TypeScript types:

```typescript
import type { PaywallSeparatorOptions } from '@remarkablejames/rich-text-editor/paywallseparator'
```

## Browser Support

This extension works in all modern browsers that support TipTap and ProseMirror.

## License

This extension is part of the Rich Text Editor package and follows the same license terms.
