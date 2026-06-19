# Pluckr Project Overview

## 🏥 What is Pluckr?

**Pluckr** is a HIPAA-compliant clinical app for licensed electrologists and medspa providers to chart sensitive client data. The app handles image uploads, tags, timestamps, provider IDs, and service-specific fields with end-to-end encryption.

## 🏗️ Current Architecture

### App Structure
```
Pluckr/
├── PluckrApp.swift              # App entry point, auth routing
├── AppDelegate.swift            # Firebase configuration
├── ContentView.swift            # Main navigation container
├── Models/                      # Data models
├── Views/                       # SwiftUI views
├── ViewModels/                  # Business logic
├── Services/                    # External integrations
├── Repositories/                # Data access layer
├── Components/                  # Reusable UI components
├── Utils/                       # Utilities and helpers
└── Resources/                   # Assets and configuration
```

## 📁 File-by-File Breakdown

### 🚀 App Entry & Configuration

#### `PluckrApp.swift`
- **Purpose**: Main app entry point
- **Key Functions**: 
  - Initializes Firebase
  - Sets up authentication state listener
  - Routes to `ProviderHomeView` or `LoginView` based on auth state
- **Current Issues**: No organization context management
- **Dependencies**: `AppDelegate`, `AuthService`

#### `AppDelegate.swift`
- **Purpose**: iOS app lifecycle and Firebase setup
- **Key Functions**:
  - Configures Firebase on app launch
  - Handles push notifications (if implemented)
- **Dependencies**: Firebase SDK

#### `ContentView.swift`
- **Purpose**: Main navigation container
- **Key Functions**: 
  - Wraps main app content
  - Handles initial routing logic
- **Current Issues**: Basic implementation, needs organization context

### 📊 Data Models

#### `Models/Client.swift`
- **Purpose**: Represents a client in the system
- **Key Properties**:
  - `id`, `firstName`, `lastName`, `email`, `phone`
  - `createdAt`, `lastSeenAt`, `notes`
  - `organizationId` (NEW - for multi-org support)
- **Current Issues**: Missing organization scoping
- **Dependencies**: None

#### `Models/ChartEntry.swift`
- **Purpose**: Represents a treatment session/chart entry
- **Key Properties**:
  - `id`, `clientId`, `providerId`
  - `treatmentArea`, `modality`, `notes`
  - `images`, `tags`, `timestamp`
- **Current Issues**: No organization context
- **Dependencies**: `Client`, `Tag`

#### `Models/Tag.swift`
- **Purpose**: Categorization system for chart entries
- **Key Properties**:
  - `id`, `name`, `color`, `category`
- **Current Issues**: No organization scoping
- **Dependencies**: None

### 🖥️ Views (SwiftUI)

#### `Views/ProviderHomeView.swift`
- **Purpose**: Main dashboard for providers
- **Key Functions**:
  - Displays client list
  - Search functionality
  - Add new client button
  - Navigation to client details
- **Current Issues**: 
  - Not iPad optimized
  - Basic UI design
  - No organization filtering
- **Dependencies**: `ProviderHomeViewModel`, `ClientCardView`

#### `Views/Auth/LoginView.swift`
- **Purpose**: User authentication interface
- **Key Functions**:
  - Email/password login
  - Sign up flow
  - Password reset
- **Current Issues**: Basic design, no organization selection
- **Dependencies**: `AuthService`

#### `Views/Clients/ClientListView.swift`
- **Purpose**: Displays list of clients
- **Key Functions**:
  - Searchable client list
  - Tap to view details
  - Add new client
- **Current Issues**: 
  - No pagination
  - Basic card design
  - No organization filtering
- **Dependencies**: `ClientsListViewModel`, `ClientCardView`

#### `Views/Clients/ClientJournalView.swift`
- **Purpose**: Shows client's treatment history
- **Key Functions**:
  - Displays chart entries
  - Add new entry
  - Filter by date/tags
- **Current Issues**: 
  - MVVM violations (direct Firestore access)
  - Basic layout
  - No image optimization
- **Dependencies**: `Client`, `ChartEntry`

#### `Views/Charts/ChartEntryFormView.swift`
- **Purpose**: Form for creating/editing chart entries
- **Key Functions**:
  - Treatment area selection
  - Modality picker
  - Image upload
  - Tag selection
  - Notes field
- **Current Issues**:
  - Basic form UX
  - No validation
  - No progress indicators
- **Dependencies**: `ChartEntryFormViewModel`, `TagLibraryManager`

### 🧠 ViewModels (Business Logic)

#### `ViewModels/ProviderHomeViewModel.swift`
- **Purpose**: Manages provider home screen state
- **Key Functions**:
  - Loads client list
  - Handles search
  - Manages loading states
- **Current Issues**:
  - Hardcoded organization ID
  - Direct Firestore access
  - No error handling
- **Dependencies**: `ClientRepository`

#### `ViewModels/ClientsListViewModel.swift`
- **Purpose**: Manages client list state
- **Key Functions**:
  - Observes client changes
  - Handles search
  - Manages loading states
- **Current Issues**:
  - Hardcoded "defaultOrg"
  - No pagination
  - Basic error handling
- **Dependencies**: `ClientRepository`

#### `ViewModels/ChartEntryFormViewModel.swift`
- **Purpose**: Manages chart entry form state
- **Key Functions**:
  - Form validation
  - Image handling
  - Save/update operations
- **Current Issues**:
  - No real-time validation
  - Basic image handling
  - No autosave
- **Dependencies**: `ChartService`, `TagLibraryManager`

### 🔧 Services (External Integrations)

#### `Services/AuthService.swift`
- **Purpose**: Handles Firebase Authentication
- **Key Functions**:
  - Sign in/up/out
  - Password reset
  - Auth state listener
- **Current Issues**:
  - No organization context
  - No role management
  - Basic error handling
- **Dependencies**: Firebase Auth

#### `Services/ChartService.swift`
- **Purpose**: Handles chart entry operations
- **Key Functions**:
  - Save chart entries
  - Upload images
  - Fetch chart history
- **Current Issues**:
  - No organization scoping
  - Basic image handling
  - No encryption for images
- **Dependencies**: Firebase Firestore, Storage

#### `Services/TagLibraryManager.swift`
- **Purpose**: Manages tag system
- **Key Functions**:
  - CRUD operations for tags
  - Tag suggestions
  - Category management
- **Current Issues**:
  - No organization scoping
  - Basic implementation
- **Dependencies**: Firebase Firestore

### 📚 Repositories (Data Access)

#### `Repositories/ClientRepository.swift`
- **Purpose**: Data access layer for clients
- **Key Functions**:
  - CRUD operations
  - Real-time listeners
  - Search functionality
- **Current Issues**:
  - No organization scoping
  - Direct Firestore access
  - No pagination
- **Dependencies**: Firebase Firestore

#### `Repositories/ChartRepository.swift`
- **Purpose**: Data access layer for chart entries
- **Key Functions**:
  - CRUD operations
  - Image handling
  - Query by client/date
- **Current Issues**:
  - No organization scoping
  - Basic image handling
- **Dependencies**: Firebase Firestore, Storage

### 🧩 Components (Reusable UI)

#### `Components/ClientCardView.swift`
- **Purpose**: Reusable client card component
- **Key Functions**:
  - Displays client info
  - Tap handling
  - Status indicators
- **Current Issues**:
  - Basic design
  - No animations
  - Limited customization
- **Dependencies**: `Client` model

#### `Components/ChartRowView.swift`
- **Purpose**: Displays chart entry in list
- **Key Functions**:
  - Shows treatment info
  - Image thumbnails
  - Tag display
- **Current Issues**:
  - Basic layout
  - No image optimization
- **Dependencies**: `ChartEntry`

### 🛠️ Utilities

#### `Utils/OrgEncryptionKeyManager.swift`
- **Purpose**: Manages encryption keys for HIPAA compliance
- **Key Functions**:
  - Key generation
  - Encryption/decryption
  - Key rotation
- **Current Issues**:
  - **CRITICAL**: Hardcoded organization ID ("demo-clinic")
  - No proper key management
  - Dev fallback key in production
- **Dependencies**: CryptoKit

#### `Utils/PluckrLogger.swift`
- **Purpose**: Centralized logging system
- **Key Functions**:
  - Structured logging
  - Performance tracking
  - Error logging
- **Current Issues**: None (well implemented)
- **Dependencies**: os.log

### 🎨 Resources

#### `Resources/Theme.swift`
- **Purpose**: App-wide design system
- **Key Functions**:
  - Color definitions
  - Typography
  - Spacing constants
- **Current Issues**:
  - Basic implementation
  - Inconsistent usage
  - No comprehensive design tokens
- **Dependencies**: SwiftUI

## 🔴 Critical Issues Summary

### Security (MUST FIX)
1. **No Organization Data Isolation** - All data accessible to all users
2. **Hardcoded Organization IDs** - `OrgEncryptionKeyManager`, `ClientsListViewModel`
3. **No Firestore Security Rules** - Database completely open
4. **No User-Organization Relationship** - Cannot track user permissions

### Architecture (SHOULD FIX)
1. **MVVM Violations** - Views directly accessing Firestore
2. **No Dependency Injection** - Tight coupling between layers
3. **Inconsistent State Management** - Mixed @State/@StateObject usage
4. **No Error Handling Strategy** - Raw Firebase errors shown to users

### UX (COULD FIX)
1. **Not iPad Optimized** - Single column layouts
2. **Basic Form UX** - No validation, poor focus management
3. **Poor Loading States** - Basic ProgressView everywhere
4. **Inconsistent Design** - No comprehensive design system

## 🎯 Migration Strategy

### Phase 1: Security Foundation (Week 1)
- Add organization context throughout app
- Implement Firestore security rules
- Remove all hardcoded organization IDs
- Create user-organization relationships

### Phase 2: Architecture Cleanup (Week 2)
- Implement proper MVVM pattern
- Add dependency injection
- Create unified error handling
- Add navigation coordinator

### Phase 3: UX Enhancement (Week 3)
- Implement comprehensive design system
- Add iPad optimizations
- Improve form UX
- Add loading states and animations

### Phase 4: Polish & Testing (Week 4)
- Add pagination and performance optimizations
- Implement comprehensive testing
- Add analytics and monitoring
- Final UI polish

## 📊 File Dependencies Map

```
PluckrApp.swift
├── AppDelegate.swift
├── AuthService.swift
├── OrganizationContext.swift (NEW)
└── ContentView.swift
    ├── ProviderHomeView.swift
    │   ├── ProviderHomeViewModel.swift
    │   ├── ClientRepository.swift
    │   └── ClientCardView.swift
    └── ClientJournalView.swift
        ├── ChartEntryFormView.swift
        ├── ChartEntryFormViewModel.swift
        ├── ChartService.swift
        └── TagLibraryManager.swift
```

## 🚀 Next Steps for Agent

1. **Start with Security** - Fix organization isolation first
2. **Follow Architecture Guide** - Implement proper MVVM and DI
3. **Use Design System** - Apply consistent UI patterns
4. **Test Thoroughly** - Ensure HIPAA compliance
5. **Document Changes** - Update this overview as you progress

This overview should give any AI agent a complete understanding of the current state and what needs to be done to make Pluckr production-ready! 🎉 