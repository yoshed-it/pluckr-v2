# Files to Add or Modify - Complete List

## 🆕 NEW FILES TO CREATE

### Core Models (NEW)
```
Core/Models/
├── Organization.swift              # Multi-org support
├── UserRole.swift                  # Role-based permissions
├── UserOrganization.swift          # User-org relationships
└── PluckrError.swift              # Unified error handling
```

### Core Services (NEW)
```
Core/Services/
├── OrganizationService.swift       # Org management
└── ImageService.swift             # Image handling & optimization
```

### Core Context (NEW)
```
Core/Context/
├── OrganizationContext.swift       # App-wide org state
├── ErrorHandler.swift             # Centralized error handling
└── NavigationCoordinator.swift    # Navigation management
```

### Security (NEW)
```
Security/
├── firestore.rules                # Database security rules
└── storage.rules                  # Storage security rules
```

### Design System (NEW)
```
Shared/DesignSystem/
├── PluckrTheme.swift              # Comprehensive design system
├── PluckrColors.swift             # Color palette
├── PluckrTypography.swift         # Typography scale
├── PluckrSpacing.swift            # Spacing system
└── PluckrShadows.swift            # Shadow definitions
```

### Shared Components (NEW)
```
Shared/Components/
├── PluckrButton.swift             # Reusable button component
├── PluckrTextField.swift          # Enhanced text field
├── PluckrCard.swift               # Card component
├── LoadingView.swift              # Loading states
├── EmptyStateView.swift           # Empty state component
└── ErrorView.swift                # Error display component
```

### Shared Utilities (NEW)
```
Shared/Utilities/
├── HapticManager.swift            # Haptic feedback
├── ImageCompressor.swift          # Image optimization
├── DateFormatter.swift            # Date formatting utilities
└── ValidationUtils.swift          # Form validation helpers
```

### Shared Extensions (NEW)
```
Shared/Extensions/
├── View+Extensions.swift          # View modifiers
├── Color+Extensions.swift         # Color utilities
├── Date+Extensions.swift          # Date utilities
└── String+Extensions.swift        # String utilities
```

### Feature Views (NEW)
```
Features/Auth/Views/
├── SignUpView.swift               # User registration
└── ForgotPasswordView.swift       # Password reset

Features/Provider/Views/
└── ProviderHomeIPadView.swift     # iPad-optimized home

Features/Clients/Views/
├── ClientDetailView.swift         # Client details screen
└── AddClientView.swift            # Add new client

Features/Clients/Components/
├── ClientSearchBar.swift          # Search functionality
└── ClientEmptyState.swift         # Empty state for clients

Features/Charts/Views/
├── ChartEntryDetailView.swift     # Chart entry details
└── ChartEntryListView.swift       # Chart entries list

Features/Charts/Components/
├── ChartEntryCard.swift           # Chart entry display
├── TreatmentAreaPicker.swift      # Treatment area selection
├── ModalityPicker.swift           # Modality selection
└── ImageUploadSection.swift       # Image upload component

Features/Organization/Views/
├── OrganizationSelectionView.swift # Org selection
├── OrganizationSettingsView.swift  # Org settings
└── InviteMembersView.swift        # Member invitations

Features/Organization/Components/
├── OrganizationCard.swift         # Org display card
└── MemberListRow.swift            # Member list item

Features/Settings/Views/
├── SettingsView.swift             # Main settings
├── ProfileView.swift              # User profile
└── DataExportView.swift           # Data export

Features/Settings/Components/
└── SettingsRow.swift              # Settings list item
```

### Feature ViewModels (NEW)
```
Features/Auth/ViewModels/
├── LoginViewModel.swift           # Login logic
└── SignUpViewModel.swift          # Registration logic

Features/Provider/ViewModels/
└── ProviderHomeViewModel.swift    # Updated home logic

Features/Clients/ViewModels/
├── ClientDetailViewModel.swift    # Client details logic
└── ClientJournalViewModel.swift   # Journal logic

Features/Charts/ViewModels/
└── ChartEntryListViewModel.swift  # Chart list logic

Features/Organization/ViewModels/
├── OrganizationSelectionViewModel.swift # Org selection logic
└── OrganizationSettingsViewModel.swift  # Org settings logic

Features/Settings/ViewModels/
├── SettingsViewModel.swift        # Settings logic
└── ProfileViewModel.swift         # Profile logic
```

## 🔄 EXISTING FILES TO MODIFY

### App Entry Points
```
PluckrApp.swift                    # Add OrganizationContext
ContentView.swift                  # Update navigation structure
```

### Models (MODIFY)
```
Models/Client.swift                # Add organizationId field
Models/ChartEntry.swift            # Add organization context
Models/Tag.swift                   # Add organization scoping
```

### Views (MODIFY)
```
Views/ProviderHomeView.swift       # Add organization context, iPad support
Views/Auth/LoginView.swift         # Add organization selection
Views/Clients/ClientListView.swift # Add organization filtering, pagination
Views/Clients/ClientJournalView.swift # Fix MVVM, add organization context
Views/Charts/ChartEntryFormView.swift # Add validation, organization context
```

### ViewModels (MODIFY)
```
ViewModels/ProviderHomeViewModel.swift # Remove hardcoded org, add DI
ViewModels/ClientsListViewModel.swift  # Remove hardcoded org, add pagination
ViewModels/ChartEntryFormViewModel.swift # Add validation, organization context
```

### Services (MODIFY)
```
Services/AuthService.swift         # Add organization management
Services/ChartService.swift        # Add organization scoping
Services/TagLibraryManager.swift   # Add organization scoping
```

### Repositories (MODIFY)
```
Repositories/ClientRepository.swift # Add organization scoping, pagination
Repositories/ChartRepository.swift  # Add organization scoping
```

### Components (MODIFY)
```
Components/ClientCardView.swift    # Update design, add animations
Components/ChartRowView.swift      # Update design, add image optimization
```

### Utilities (MODIFY)
```
Utils/OrgEncryptionKeyManager.swift # Remove hardcoded org ID
Utils/PluckrLogger.swift           # Already good, no changes needed
```

### Resources (MODIFY)
```
Resources/Theme.swift              # Replace with comprehensive design system
```

## 📋 MIGRATION CHECKLIST

### Phase 1: Security Foundation
- [x] Create `Core/Models/Organization.swift` - Already existed in Models/
- [x] Create `Core/Models/UserRole.swift` - Part of UserOrganization.swift
- [x] Create `Core/Models/UserOrganization.swift` - Already existed in Models/
- [x] Create `Core/Models/PluckrError.swift` - COMPLETED
- [x] Create `Core/Services/OrganizationService.swift` - Already existed in Services/
- [x] Create `Core/Context/OrganizationContext.swift` - COMPLETED
- [x] Create `Security/firestore.rules` - COMPLETED
- [x] Create `Security/storage.rules` - COMPLETED
- [x] Modify `Models/Client.swift` - add organizationId - COMPLETED
- [x] Modify `Utils/OrgEncryptionKeyManager.swift` - remove hardcoded org - Already done
- [x] Modify `ViewModels/ClientsListViewModel.swift` - remove hardcoded org - Already done
- [x] Modify `PluckrApp.swift` - add OrganizationContext - COMPLETED

### Phase 2: Architecture Cleanup
- [ ] Create `Core/Context/ErrorHandler.swift`
- [ ] Create `Core/Context/NavigationCoordinator.swift`
- [ ] Create `Core/Services/ImageService.swift`
- [ ] Modify `Repositories/ClientRepository.swift` - add org scoping
- [ ] Modify `Repositories/ChartRepository.swift` - add org scoping
- [ ] Modify `Services/AuthService.swift` - add org management
- [ ] Modify `Services/ChartService.swift` - add org scoping
- [ ] Modify `Services/TagLibraryManager.swift` - add org scoping
- [ ] Modify all ViewModels - add dependency injection
- [ ] Modify all Views - fix MVVM violations

### Phase 3: Design System
- [ ] Create `Shared/DesignSystem/PluckrTheme.swift`
- [ ] Create `Shared/DesignSystem/PluckrColors.swift`
- [ ] Create `Shared/DesignSystem/PluckrTypography.swift`
- [ ] Create `Shared/DesignSystem/PluckrSpacing.swift`
- [ ] Create `Shared/DesignSystem/PluckrShadows.swift`
- [ ] Create `Shared/Components/PluckrButton.swift`
- [ ] Create `Shared/Components/PluckrTextField.swift`
- [ ] Create `Shared/Components/PluckrCard.swift`
- [ ] Create `Shared/Components/LoadingView.swift`
- [ ] Create `Shared/Components/EmptyStateView.swift`
- [ ] Create `Shared/Components/ErrorView.swift`
- [ ] Replace `Resources/Theme.swift` with new design system

### Phase 4: Feature Enhancement
- [ ] Create all new feature Views
- [ ] Create all new feature ViewModels
- [ ] Create all new feature Components
- [ ] Create `Shared/Utilities/HapticManager.swift`
- [ ] Create `Shared/Utilities/ImageCompressor.swift`
- [ ] Create `Shared/Utilities/DateFormatter.swift`
- [ ] Create `Shared/Utilities/ValidationUtils.swift`
- [ ] Create `Shared/Extensions/View+Extensions.swift`
- [ ] Create `Shared/Extensions/Color+Extensions.swift`
- [ ] Create `Shared/Extensions/Date+Extensions.swift`
- [ ] Create `Shared/Extensions/String+Extensions.swift`

## 🎯 PRIORITY ORDER

### CRITICAL (Week 1)
1. Organization models and context
2. Security rules
3. Remove hardcoded organization IDs
4. Basic organization scoping

### HIGH (Week 2)
1. Design system implementation
2. Error handling system
3. Navigation coordinator
4. Dependency injection

### MEDIUM (Week 3)
1. Feature-specific Views and ViewModels
2. Shared components
3. Utilities and extensions
4. iPad optimizations

### LOW (Week 4)
1. Advanced features
2. Performance optimizations
3. Testing implementation
4. Final polish

## 📊 File Count Summary

- **NEW FILES**: ~45 files
- **MODIFIED FILES**: ~15 files
- **TOTAL CHANGES**: ~60 files

## 🚀 Agent Instructions

1. **Start with CRITICAL files** - Security and organization context first
2. **Follow the migration checklist** - Phase by phase
3. **Update this document** - Mark completed items
4. **Test each phase** - Ensure builds and works
5. **Document changes** - Update project overview

This comprehensive list ensures no file is missed during the refactoring process! 🎉 