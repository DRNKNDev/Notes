# DRNKN Notes

A clean, familiar interface for fast markdown writing. Your notes stay local and always accessible. Just write, no forced structures or distractions

## Features

- **Markdown-based Notes**: Create and edit notes with Markdown support
- **Rich Text Editing**: User-friendly editor with formatting tools
- **Instant Search**: Quickly find notes with full-text search
- **Multiple Themes**: Choose from a variety of themes with both dark and light mode support
- **Cross-Platform**: Available for macOS (Intel & Apple Silicon) and Windows
- **Auto-Updates**: Seamless updates to the latest version
- **Offline-First**: All notes stored locally on your device

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/)
- [Tauri CLI](https://tauri.app/)

### Setup

```bash
# Clone the repository
git clone https://github.com/DRNKNDev/Notes.git
cd Notes

# Install dependencies
pnpm install

# Start development server
pnpm tauri dev
```

### Build

```bash
# Build for production
pnpm tauri build
```

## Project Structure

- `/src` - Frontend React code
  - `/components` - UI components including the note editor
  - `/routes` - Application routes and page components
  - `/hooks` - React hooks for state management
  - `/lib` - Utilities and helper functions
- `/src-tauri` - Rust backend code

## Technology Stack

- **Frontend**: React, TypeScript, TanStack Router, MDXEditor, Tailwind CSS v4, Shadcn UI
- **Backend**: Rust, Tauri v2
- **Storage**: Local file system with Lunr.js for search indexing

## Release Process

See [RELEASE.md](./RELEASE.md) for detailed information about the release process.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of changes in each version.

## Contributing

Contributions are welcome! Here are some ways you can contribute to the project:

- Report bugs and request features by creating issues
- Submit pull requests to fix issues or add new features
- Improve documentation
- Share the project with others

## License

FSL-1.1-MIT

See [LICENSE.md](./LICENSE.md) for details.
