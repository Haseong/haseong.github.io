# Language Detection and Translation Suggestion

This feature automatically detects the user's browser language and suggests translating the page if needed.

## How it works

1. When a user visits the site for the first time, the system detects their browser language
2. If the browser language is not Korean:
   - If the language is supported (currently only English), it suggests translating to that language
   - If the language is not supported, it suggests translating to English as a fallback
3. A popup appears asking if they want to translate the page
4. The user's choice is remembered using localStorage

## User Options

- **Accept Translation**: Automatically translates the page to the suggested language
- **Stay in Korean**: Dismisses the popup and keeps the page in Korean
- **Close (X button)**: Same as "Stay in Korean"
- **Click outside popup**: Same as "Stay in Korean"
- **Press Escape**: Same as "Stay in Korean"

## Resetting Language Preference

Users can reset their language preference in two ways:

1. **Keyboard Shortcut**: Press `Ctrl+Shift+L` (or `Cmd+Shift+L` on Mac)
2. **JavaScript Console**: Run `resetLanguagePreference()`

## Technical Implementation

### Files Created/Modified

1. `_includes/extensions/language-detection.html` - Main implementation
2. `_includes/extensions/language-preference-reset.html` - Reset utility
3. `_layouts/default.html` - Integration points

### Supported Languages

Currently supported languages for translation:
- English (en)
- Korean (ko) - site default

### Adding More Languages

To add more supported languages:

1. Update the `SUPPORTED_LANGUAGES` array in `language-detection.html`
2. Ensure the language is configured in `_data/translate_langs.yml`
3. Add the language name to the `LANGUAGE_NAMES` object

### Styling

The popup uses CSS variables for theming and includes:
- Light/dark mode support
- Responsive mobile design
- Smooth animations
- Accessibility features (focus management, keyboard navigation)

## Testing

Visit `/test-language-detection.html` to test the feature with debug tools.