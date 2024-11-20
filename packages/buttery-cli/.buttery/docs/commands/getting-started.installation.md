---
name: Installation | Getting Started # this will display in the tab of the browser
meta:
  - type: name
    name: description
    content: Guide on how to install, configure and get started with Buttery Commands
config:
  navBarDisplay: Installation
---

# Installation

## System Requirements

- NodeJS 22 or later
- maxOS, Windows, and Linux are supported

## Automatic Installation

> Work in Progress

## Manual Installation

There are a few albeit minor steps that you'll need to follow to manually install and get started with `@buttery/commands`

### 1. Install required packages

To manually install and get started with Buttery Commands, install the required packages.

```bash
yarn add @buttery/cli --dev
yarn add @buttery/commands
```

The `@buttery/cli` is not a runtime or a production dependency and is only used to iteratively develop and then build your CLI for production. You can safely install it as a development dependency.

### 2. Start the development server

```bash
yarn buttery commands dev
```
