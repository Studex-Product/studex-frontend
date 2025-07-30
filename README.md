# Studex – Frontend App

## 📁 Project Overview

This repository contains a modern React frontend application built with **JavaScript** and managed using **pnpm**. We're building a student marketplace platform that requires secure user verification and scalable frontend architecture.

## 🚀 Live Demo

[Studex Frontend]()

## 📂 Project Structure

```
frontend/                    # React application
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Shared components
│   │   ├── listings/       # Listing-related components
│   │   └── auth/           # Authentication components
│   ├── pages/              # Route components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service functions
│   ├── utils/              # Utility functions
│   ├── types/              # Type definitions
│   └── assets/             # Images, icons, fonts
├── public/
└── tests/

```

## 🛠️ Installation Guide

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher
- **Git**: Latest version

### Step-by-Step Setup

1. **Clone the repository:**
    
    ```bash
    git clone https://github.com/Studex-Product/studex-frontend.git
    cd studex-frontend
    
    ```
    
2. **Install dependencies:**
    
    ```bash
    pnpm install
    
    ```
    
3. **Start the development server:**
    
    ```bash
    pnpm dev
    
    ```
    

The application will be available at ` http://localhost:5174/`.

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build the application for production
- `pnpm preview` - Preview the production build locally
- `pnpm test` - Run the test suite
- `pnpm lint` - Run ESLint to check code quality
- `pnpm type-check` - Run type checking

## 🧾 Contribution Guidelines

### Git Workflow Process

1. **Create or checkout to your feature branch:**
    
    ```bash
    git checkout feature/branch-name
    # or
    git checkout -b feature/branch-name
    
    ```
    
    📋 Follow branch name conventions established in our [whitepaper]()
    
2. **Make your changes, stage and commit:**
    
    ```bash
    git add .
    git commit -m "feat: add descriptive commit message"
    
    ```
    
    📋 Follow proper commit conventions in the [whitepaper]()
    
3. **Before pushing, sync your branch with main to stay up to date:**
    
    ```bash
    git fetch origin
    git pull origin main
    
    ```
    
4. **Push to your remote branch and create a Pull Request:**
    
    ```bash
    git push origin feature/branch-name
    
    ```
    
    📋 Make sure you meet all PR requirements in the [whitepaper]() before raising a PR
    

### Handling PR Conflicts

Make sure all merge conflicts are resolved on your branch before making pull requests.

## 🧹 Code Style Rules

- **Framework**: React 18+ with functional components and hooks
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: TanStack Query for server state, useState/useReducer for local state
- **File Naming**: PascalCase for components (`UserProfile.jsx`), camelCase for utilities (`useLocalStorage.js`)
- **ESLint**: All code must pass linting checks

📋 For detailed frontend standards and React ecosystem guidelines, see our [whitepaper]()

## 🔧 Development

### Tech Stack

- **React 18+** with functional components
- **React Router v6** for client-side routing
- **Tailwind CSS** for styling
- **TanStack Query** for server state management
- **Vite** as build tool

### Component Guidelines

- Use PropTypes for runtime validation (optional)
- Follow mobile-first responsive design
- Implement proper error boundaries
- Write meaningful tests for components

📋 See complete [development standards]() in our whitepaper

## 📋 Additional Documentation

For comprehensive project information:

📄 [**Project Whitepaper**]() - Complete development standards and guidelines

📄 [**File and Asset Standards**]() - File naming and organization

📄 [**API Documentation**]() - Backend integration guidelines

📄 [**Deployment Guide**]() - Production deployment instructions

## 🤝 Getting Help

- **Documentation**: See our [whitepaper]()
- **Issues**: Create GitHub issues for bugs or feature requests
- **Team Communication**: Slack #frontend-dev channel

---

**Built with React ⚛️ + JavaScript 📘 + pnpm ⚡**