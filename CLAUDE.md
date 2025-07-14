# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Guidelines

- **Language**: Use Chinese (中文) when communicating with users
- **Code Comments**: Write all code comments in Chinese (中文)

## Project Overview

Go-Blite is a monorepo static site generation platform built with React and TypeScript. It supports importing static assets from Figma, rendering, building, and one-click deployment with page management capabilities.

## Development Commands

### Building and Development
- `npm run dev:web-site` - Start web-site development server
- `npm run dev:design` - Start design package development server  
- `npm run build:web-site` - Build web-site for production
- `npm run build:design` - Build design package for production
- `npm run build:web-site:demo` - Build web-site in demo mode
- `npm run build:design:demo` - Build design package in demo mode

### Code Quality
- `npm run lint:fix` - Fix linting issues across all files
- `npm run prettier` - Format code with Prettier
- `npm run commit` - Use Commitizen for conventional commits (required)

### Package Management
- Use `pnpm` for dependency management (Node.js 18+ required)
- Use `pnpm install` to install dependencies

## Architecture

This is an Nx monorepo with the following structure:

### Main Applications
- **web-site/**: Main web application built with React + Vite
- **builder/**: Node.js build service with Express API for static site generation

### Packages
- **packages/design/**: Core design editor built on Craft.js framework with drag-and-drop components
- **packages/shadcn/**: Shared UI component library using TailwindCSS
- **packages/figma/**: Figma plugin for importing designs into the platform
- **packages/events/**: Business event handling library for static site operations
- **packages/selectors/**: Business-specific components (NonFarm, SymbolCard)

### Key Technologies
- **Framework**: React 18 with TypeScript
- **Build Tools**: Vite for bundling, Nx for monorepo orchestration
- **Styling**: TailwindCSS throughout
- **Design System**: Craft.js for the visual editor core
- **State Management**: use-immer for immutable state updates

## Important Development Guidelines

### Commit Workflow
- Always use `npm run commit` for commits (uses Commitizen with cz-git)
- Follow conventional commit format enforced by commitlint
- Pre-commit hooks run lint-staged (Prettier + ESLint) automatically
- Commits should not exceed 5 files except for initial project setup

### Code Style
- ESLint configuration is strict - do not modify rules arbitrarily
- All code must pass linting before commit
- Prettier handles formatting automatically

### Architecture Patterns
- **Design Package**: Built around Craft.js with custom selectors (App, Button, Container, Image, Text)
- **Business Components**: Located in packages/selectors for domain-specific functionality
- **Cross-package Dependencies**: Uses workspace protocol (workspace:^) for internal packages

### Internationalization
- Built-in i18n support using Crowdin integration
- I18n components available in packages/design/src/I18n/

### Docker Deployment
- Dockerfile supports demo builds: `docker build --build-arg BUILD_ENV=demo -t go-blite-app:demo .`
- Use start.sh for production deployment