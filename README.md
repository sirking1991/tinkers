# Tinkers

A cross-platform desktop application for running code snippets, inspired by Tinkerwell.

## Features

- Execute PHP and JavaScript code snippets
- Monaco Editor integration with syntax highlighting
- Save and manage your code snippets
- Cross-platform support (Windows, macOS, Linux)
- Keyboard shortcuts for improved workflow

## Tech Stack

- **Electron**: Cross-platform desktop app framework
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Monaco Editor**: Code editor used in VS Code
- **TailwindCSS**: Utility-first CSS framework
- **Zustand**: State management with persistence

## Development

### Prerequisites

- Node.js 16+ and npm
- PHP (for PHP code execution)
- Node.js (for JavaScript code execution)

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/tinkers.git
cd tinkers

# Install dependencies
npm install

# Start the development server
npm start
```

### Build

```bash
# Package the app
npm run package

# Create installers for your platform
npm run make
```

## Keyboard Shortcuts

- **Cmd/Ctrl + Enter**: Execute code
- **Cmd/Ctrl + S**: Open snippet manager

## Adding New Languages

To add support for a new programming language:

1. Add the language to the `LANGUAGES` array in `src/renderer/App.tsx`
2. Implement the execution logic in `src/main/index.ts` by adding a new case to the switch statement in the `execute-code` handler

## License

MIT
