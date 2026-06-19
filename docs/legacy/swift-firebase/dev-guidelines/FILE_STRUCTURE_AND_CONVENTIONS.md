# Pluckr File Structure & Naming Conventions

## 📁 Recommended File Structure

### Current Structure (Needs Reorganization)
```
Pluckr/
├── PluckrApp.swift
├── AppDelegate.swift
├── ContentView.swift
├── Models/
│   ├── Client.swift
│   ├── ChartEntry.swift
│   └── Tag.swift
├── Views/
│   ├── ProviderHomeView.swift
│   ├── Auth/
│   │   └── LoginView.swift
│   ├── Clients/
│   │   ├── ClientListView.swift
│   │   └── ClientJournalView.swift
│   └── Charts/
│       └── ChartEntryFormView.swift
├── ViewModels/
│   ├── ProviderHomeViewModel.swift
│   ├── ClientsListViewModel.swift
│   └── ChartEntryFormViewModel.swift
├── Services/
│   ├── AuthService.swift
│   ├── ChartService.swift
│   └── TagLibraryManager.swift
├── Repositories/
│   ├── ClientRepository.swift
│   └── ChartRepository.swift
├── Components/
│   ├── ClientCardView.swift
│   └── ChartRowView.swift
├── Utils/
│   ├── OrgEncryptionKeyManager.swift
│   └── PluckrLogger.swift
└── Resources/
    └── Theme.swift
```

### Target Structure (After Refactoring)
```
Pluckr/
├── App/
│   ├── PluckrApp.swift
│   ├── AppDelegate.swift
│   └── ContentView.swift
├── Core/
│   ├── Models/
│   │   ├── Organization.swift
│   │   ├── UserRole.swift
│   │   ├── UserOrganization.swift
│   │   ├── Client.swift
│   │   ├── ChartEntry.swift
│   │   ├── Tag.swift
│   │   └── PluckrError.swift
│   ├── Services/
│   │   ├── AuthService.swift
│   │   ├── OrganizationService.swift
│   │   ├── ChartService.swift
│   │   ├── ImageService.swift
│   │   └── TagLibraryManager.swift
│   ├── Repositories/
│   │   ├── ClientRepository.swift
│   │   ├── ChartRepository.swift
│   │   ├── OrganizationRepository.swift
│   │   └── ImageRepository.swift
│   └── Context/
│       ├── OrganizationContext.swift
│       ├── ErrorHandler.swift
│       └── NavigationCoordinator.swift
├── Features/
│   ├── Auth/
│   │   ├── Views/
│   │   │   ├── LoginView.swift
│   │   │   ├── SignUpView.swift
│   │   │   └── ForgotPasswordView.swift
│   │   ├── ViewModels/
│   │   │   ├── LoginViewModel.swift
│   │   │   └── SignUpViewModel.swift
│   │   └── Components/
│   │       └── AuthFormField.swift
│   ├── Provider/
│   │   ├── Views/
│   │   │   ├── ProviderHomeView.swift
│   │   │   └── ProviderHomeIPadView.swift
│   │   ├── ViewModels/
│   │   │   └── ProviderHomeViewModel.swift
│   │   └── Components/
│   │       └── ProviderStatsCard.swift
│   ├── Clients/
│   │   ├── Views/
│   │   │   ├── ClientListView.swift
│   │   │   ├── ClientDetailView.swift
│   │   │   ├── ClientJournalView.swift
│   │   │   └── AddClientView.swift
│   │   ├── ViewModels/
│   │   │   ├── ClientsListViewModel.swift
│   │   │   ├── ClientDetailViewModel.swift
│   │   │   └── ClientJournalViewModel.swift
│   │   └── Components/
│   │       ├── ClientCardView.swift
│   │       ├── ClientSearchBar.swift
│   │       └── ClientEmptyState.swift
│   ├── Charts/
│   │   ├── Views/
│   │   │   ├── ChartEntryFormView.swift
│   │   │   ├── ChartEntryDetailView.swift
│   │   │   └── ChartEntryListView.swift
│   │   ├── ViewModels/
│   │   │   ├── ChartEntryFormViewModel.swift
│   │   │   └── ChartEntryListViewModel.swift
│   │   └── Components/
│   │       ├── ChartEntryCard.swift
│   │       ├── TreatmentAreaPicker.swift
│   │       ├── ModalityPicker.swift
│   │       └── ImageUploadSection.swift
│   ├── Organization/
│   │   ├── Views/
│   │   │   ├── OrganizationSelectionView.swift
│   │   │   ├── OrganizationSettingsView.swift
│   │   │   └── InviteMembersView.swift
│   │   ├── ViewModels/
│   │   │   ├── OrganizationSelectionViewModel.swift
│   │   │   └── OrganizationSettingsViewModel.swift
│   │   └── Components/
│   │       ├── OrganizationCard.swift
│   │       └── MemberListRow.swift
│   └── Settings/
│       ├── Views/
│       │   ├── SettingsView.swift
│       │   ├── ProfileView.swift
│       │   └── DataExportView.swift
│       ├── ViewModels/
│       │   ├── SettingsViewModel.swift
│       │   └── ProfileViewModel.swift
│       └── Components/
│           └── SettingsRow.swift
├── Shared/
│   ├── Components/
│   │   ├── PluckrButton.swift
│   │   ├── PluckrTextField.swift
│   │   ├── PluckrCard.swift
│   │   ├── LoadingView.swift
│   │   ├── EmptyStateView.swift
│   │   └── ErrorView.swift
│   ├── DesignSystem/
│   │   ├── PluckrTheme.swift
│   │   ├── PluckrColors.swift
│   │   ├── PluckrTypography.swift
│   │   ├── PluckrSpacing.swift
│   │   └── PluckrShadows.swift
│   ├── Utilities/
│   │   ├── PluckrLogger.swift
│   │   ├── HapticManager.swift
│   │   ├── ImageCompressor.swift
│   │   ├── DateFormatter.swift
│   │   └── ValidationUtils.swift
│   └── Extensions/
│       ├── View+Extensions.swift
│       ├── Color+Extensions.swift
│       ├── Date+Extensions.swift
│       └── String+Extensions.swift
├── Security/
│   ├── OrgEncryptionKeyManager.swift
│   ├── firestore.rules
│   └── storage.rules
└── Resources/
    ├── Assets.xcassets/
    ├── Localizable.strings
    └── Info.plist
```

## 📝 Naming Conventions

### Files & Folders

#### General Rules
- **PascalCase** for all Swift files and folders
- **Descriptive names** that clearly indicate purpose
- **Feature-based organization** over type-based
- **Consistent suffixes** for similar file types

#### File Naming Patterns
```
[Feature][Type][Specificity].swift

Examples:
- ClientListView.swift          # View for client list
- ClientListViewModel.swift     # ViewModel for client list
- ClientCardView.swift          # Component for client card
- ClientRepository.swift        # Repository for client data
- ClientService.swift           # Service for client operations
```

#### Folder Naming
```
Features/
├── [FeatureName]/              # PascalCase, descriptive
│   ├── Views/                  # Always "Views"
│   ├── ViewModels/             # Always "ViewModels"
│   └── Components/             # Always "Components"
```

### Code Naming

#### Classes & Structs
```swift
// ✅ Good
class ClientRepository { }
struct ClientCardView { }
enum UserRole { }

// ❌ Bad
class clientRepo { }
struct clientCard { }
enum user_role { }
```

#### Variables & Properties
```swift
// ✅ Good
@Published var clients: [Client] = []
@State private var isShowingPicker = false
let clientRepository: ClientRepositoryProtocol

// ❌ Bad
@Published var clientList: [Client] = []
@State private var showPicker = false
let repo: ClientRepositoryProtocol
```

#### Functions
```swift
// ✅ Good
func loadClients() async throws { }
func createClient(_ input: ClientInput) async throws -> Client { }
func handleClientSelection(_ client: Client) { }

// ❌ Bad
func getClients() async throws { }
func addClient(_ client: ClientInput) async throws -> Client { }
func selectClient(_ client: Client) { }
```

#### Constants
```swift
// ✅ Good
enum Constants {
    static let maxImageSize: Int = 10 * 1024 * 1024  // 10MB
    static let defaultPageSize: Int = 20
    static let animationDuration: Double = 0.3
}

// ❌ Bad
let MAX_SIZE = 10 * 1024 * 1024
let pageSize = 20
let duration = 0.3
```

### Protocol Naming

```swift
// ✅ Good
protocol ClientRepositoryProtocol { }
protocol ImageServiceProtocol { }
protocol ValidationProtocol { }

// ❌ Bad
protocol ClientRepo { }
protocol ImageService { }
protocol Validator { }
```

### Extension Naming

```swift
// ✅ Good
extension View {
    func pluckrCard() -> some View { }
}

extension Color {
    static let pluckrPrimary = Color("Primary")
}

extension Date {
    func timeAgo() -> String { }
}

// ❌ Bad
extension View {
    func card() -> some View { }
}
```

## 🏗️ Architecture Patterns

### MVVM Structure
```swift
// View
struct ClientListView: View {
    @StateObject private var viewModel: ClientListViewModel
    
    var body: some View {
        // UI implementation
    }
}

// ViewModel
@MainActor
class ClientListViewModel: ObservableObject {
    @Published var clients: [Client] = []
    @Published var isLoading = false
    @Published var error: PluckrError?
    
    private let repository: ClientRepositoryProtocol
    
    init(repository: ClientRepositoryProtocol) {
        self.repository = repository
    }
}

// Repository
protocol ClientRepositoryProtocol {
    func observeClients(orgId: String) -> AnyPublisher<[Client], PluckrError>
    func createClient(_ input: ClientInput) async throws -> Client
}

final class ClientRepository: ClientRepositoryProtocol {
    // Implementation
}
```

### Dependency Injection
```swift
// Service Protocol
protocol AuthServiceProtocol {
    func signIn(email: String, password: String) async throws -> User
}

// Service Implementation
final class AuthService: AuthServiceProtocol {
    // Implementation
}

// ViewModel with DI
class LoginViewModel: ObservableObject {
    private let authService: AuthServiceProtocol
    
    init(authService: AuthServiceProtocol) {
        self.authService = authService
    }
}
```

## 📦 Module Organization

### Feature Modules
Each feature should be self-contained with:
- **Views** - UI components
- **ViewModels** - Business logic
- **Components** - Reusable UI pieces
- **Models** - Feature-specific data structures

### Shared Modules
- **DesignSystem** - Colors, typography, spacing
- **Components** - App-wide reusable components
- **Utilities** - Helper functions and extensions
- **Extensions** - Swift standard library extensions

## 🔄 Migration Strategy

### Phase 1: Create New Structure
1. Create new folder structure
2. Move existing files to new locations
3. Update import statements
4. Fix build errors

### Phase 2: Refactor Files
1. Rename files to follow conventions
2. Update class/struct names
3. Implement proper MVVM
4. Add dependency injection

### Phase 3: Add New Features
1. Create new feature modules
2. Implement organization context
3. Add security features
4. Create design system

## 📋 File Creation Checklist

When creating new files, ensure:

- [ ] **Correct location** in feature-based structure
- [ ] **Proper naming** following conventions
- [ ] **Appropriate imports** only what's needed
- [ ] **Documentation** with purpose and usage
- [ ] **Protocol conformance** for testability
- [ ] **Error handling** with PluckrError
- [ ] **Logging** with PluckrLogger
- [ ] **Accessibility** labels and hints

## 🎯 Agent Guidelines

### When Creating New Files:
1. **Check existing structure** first
2. **Follow naming conventions** strictly
3. **Place in correct feature folder**
4. **Add proper documentation**
5. **Update this guide** if needed

### When Refactoring:
1. **Maintain backward compatibility**
2. **Update all references**
3. **Test thoroughly**
4. **Document changes**

This structure ensures scalability, maintainability, and clear separation of concerns! 🚀 