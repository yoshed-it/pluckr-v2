# AI Agent Rules & Guidelines for Pluckr

## 🚨 CRITICAL RULES (MUST FOLLOW)

### 1. Security First
- **NEVER** commit code with hardcoded organization IDs
- **ALWAYS** use organization context for data access
- **NEVER** expose sensitive data in logs or error messages
- **ALWAYS** validate user permissions before data access
- **NEVER** store encryption keys in plain text

### 2. HIPAA Compliance
- **ALWAYS** encrypt sensitive data (client info, images, notes)
- **NEVER** log PII (Personally Identifiable Information)
- **ALWAYS** use organization-scoped queries
- **NEVER** allow cross-organization data access
- **ALWAYS** implement proper audit logging

### 3. Code Quality
- **ALWAYS** follow MVVM pattern - Views should NOT access Firestore directly
- **NEVER** use @State for business logic - only for UI state
- **ALWAYS** use @StateObject for ViewModels owned by the view
- **NEVER** create circular dependencies
- **ALWAYS** handle errors gracefully with user-friendly messages

## 📋 MANDATORY GUIDELINES

### File Creation Rules
```
✅ CORRECT:
- Use PascalCase for all files: ClientListView.swift
- Place in correct feature folder: Features/Clients/Views/
- Include proper documentation header
- Follow naming conventions exactly

❌ WRONG:
- client_list_view.swift (snake_case)
- Views/ClientListView.swift (wrong location)
- Missing documentation
- Inconsistent naming
```

### Code Style Rules
```swift
// ✅ CORRECT - MVVM Pattern
struct ClientListView: View {
    @StateObject private var viewModel: ClientListViewModel
    
    var body: some View {
        // Only UI code here
    }
}

@MainActor
class ClientListViewModel: ObservableObject {
    @Published var clients: [Client] = []
    private let repository: ClientRepositoryProtocol
    
    func loadClients() async {
        // Business logic here
    }
}

// ❌ WRONG - Direct Firestore Access
struct ClientListView: View {
    @State private var clients: [Client] = []
    private let db = Firestore.firestore() // NO!
    
    func loadClients() {
        // Direct DB access in View - NO!
    }
}
```

### Error Handling Rules
```swift
// ✅ CORRECT - Proper Error Handling
do {
    let client = try await repository.createClient(input)
    await MainActor.run {
        self.clients.append(client)
    }
} catch {
    await MainActor.run {
        self.error = PluckrError.clientCreationFailed(error)
    }
    PluckrLogger.error("Failed to create client", error: error)
}

// ❌ WRONG - Raw Error Display
do {
    let client = try await repository.createClient(input)
} catch {
    // Don't show raw Firebase errors to users
    errorMessage = error.localizedDescription // NO!
}
```

### Organization Context Rules
```swift
// ✅ CORRECT - Always Use Organization Context
class ClientRepository {
    func observeClients(organizationId: String) {
        db.collection("organizations")
            .document(organizationId)
            .collection("clients")
            .addSnapshotListener { ... }
    }
}

// ❌ WRONG - No Organization Scoping
class ClientRepository {
    func observeClients() {
        db.collection("clients") // NO! No org scope
            .addSnapshotListener { ... }
    }
}
```

## 🎯 IMPLEMENTATION RULES

### 1. Always Use Dependency Injection
```swift
// ✅ CORRECT
class ClientListViewModel: ObservableObject {
    private let repository: ClientRepositoryProtocol
    private let orgContext: OrganizationContext
    
    init(
        repository: ClientRepositoryProtocol = DependencyContainer.shared.clientRepository,
        orgContext: OrganizationContext
    ) {
        self.repository = repository
        self.orgContext = orgContext
    }
}

// ❌ WRONG
class ClientListViewModel: ObservableObject {
    private let repository = ClientRepository() // Hard dependency
}
```

### 2. Always Handle Loading States
```swift
// ✅ CORRECT
@MainActor
class ClientListViewModel: ObservableObject {
    @Published var clients: [Client] = []
    @Published var isLoading = false
    @Published var error: PluckrError?
    
    func loadClients() async {
        isLoading = true
        error = nil
        
        do {
            clients = try await repository.getClients(orgId: orgContext.currentOrganization?.id)
        } catch {
            self.error = PluckrError.clientLoadFailed(error)
        }
        
        isLoading = false
    }
}
```

### 3. Always Use Proper State Management
```swift
// ✅ CORRECT
struct SomeView: View {
    @StateObject private var viewModel: SomeViewModel // Owned by view
    @ObservedObject var sharedViewModel: SharedViewModel // Injected
    @State private var isShowingPicker = false // Local UI state only
}

// ❌ WRONG
struct SomeView: View {
    @State private var clients: [Client] = [] // Business logic in @State
    @StateObject private var isShowingPicker = false // UI state in @StateObject
}
```

## 🔒 SECURITY ENFORCEMENT

### Data Access Rules
1. **ALL** database queries must include organization ID
2. **ALL** image uploads must be organization-scoped
3. **ALL** user actions must be validated against user role
4. **ALL** sensitive data must be encrypted
5. **ALL** API calls must include proper authentication

### Validation Rules
```swift
// ✅ CORRECT - Always Validate
func createClient(_ input: ClientInput) async throws -> Client {
    // Validate organization access
    guard let orgId = orgContext.currentOrganization?.id else {
        throw PluckrError.organizationNotFound
    }
    
    // Validate user permissions
    guard orgContext.userRole.canCreateClients else {
        throw PluckrError.insufficientPermissions
    }
    
    // Validate input data
    guard !input.firstName.trimmingCharacters(in: .whitespaces).isEmpty else {
        throw PluckrError.validationFailed(field: "firstName", reason: "Required")
    }
    
    return try await repository.createClient(input, organizationId: orgId)
}
```

## 🎨 DESIGN SYSTEM RULES

### Always Use Design System
```swift
// ✅ CORRECT
Text("Client Name")
    .font(PluckrTypography.headline)
    .foregroundColor(PluckrColors.textPrimary)

Button("Save") {
    // Action
}
.buttonStyle(PluckrButtonStyle())

// ❌ WRONG
Text("Client Name")
    .font(.system(size: 17, weight: .semibold)) // Hardcoded values
    .foregroundColor(.black) // Hardcoded colors
```

### Component Usage Rules
1. **ALWAYS** use shared components from `Shared/Components/`
2. **NEVER** create duplicate components
3. **ALWAYS** follow the design system spacing and colors
4. **NEVER** use hardcoded values for styling

## 📱 PLATFORM RULES

### iPad Optimization
1. **ALWAYS** check for iPad layout opportunities
2. **ALWAYS** use NavigationSplitView for iPad
3. **ALWAYS** implement adaptive layouts
4. **NEVER** assume single column layout

### Accessibility
1. **ALWAYS** add accessibility labels
2. **ALWAYS** support Dynamic Type
3. **ALWAYS** provide VoiceOver support
4. **NEVER** rely solely on color for information

## 🧪 TESTING RULES

### Code Testability
1. **ALWAYS** use protocols for dependencies
2. **ALWAYS** make ViewModels testable
3. **ALWAYS** separate business logic from UI
4. **NEVER** create untestable code

### Error Testing
1. **ALWAYS** test error scenarios
2. **ALWAYS** test network failures
3. **ALWAYS** test permission denied cases
4. **NEVER** assume everything will work

## 📝 DOCUMENTATION RULES

### Code Documentation
```swift
// ✅ CORRECT
/// Manages the list of clients for the current organization
/// 
/// This ViewModel handles loading, searching, and filtering clients
/// while respecting organization boundaries and user permissions.
@MainActor
class ClientListViewModel: ObservableObject {
    // Implementation
}

// ❌ WRONG
class ClientListViewModel: ObservableObject {
    // No documentation
}
```

### File Headers
```swift
//
//  ClientListViewModel.swift
//  Pluckr
//
//  Manages client list state and operations for the current organization.
//  Handles loading, searching, and filtering with proper error handling.
//
//  Created by: [Agent Name]
//  Date: [Date]
//

import Foundation
import SwiftUI
import Combine
```

## 🚫 FORBIDDEN PATTERNS

### Never Do These:
1. **Direct Firestore access in Views**
2. **Hardcoded organization IDs**
3. **Raw error messages to users**
4. **Circular dependencies**
5. **Business logic in Views**
6. **Hardcoded styling values**
7. **No error handling**
8. **No loading states**
9. **No validation**
10. **No accessibility support**

## ✅ MANDATORY CHECKLIST

Before committing any code, ensure:

### Security Checklist
- [ ] No hardcoded organization IDs
- [ ] All queries use organization scope
- [ ] User permissions validated
- [ ] Sensitive data encrypted
- [ ] No PII in logs

### Code Quality Checklist
- [ ] Follows MVVM pattern
- [ ] Uses dependency injection
- [ ] Proper error handling
- [ ] Loading states implemented
- [ ] No circular dependencies

### Design Checklist
- [ ] Uses design system
- [ ] Follows naming conventions
- [ ] Proper file location
- [ ] Documentation included
- [ ] Accessibility supported

### Testing Checklist
- [ ] Code is testable
- [ ] Error scenarios covered
- [ ] Edge cases handled
- [ ] Performance considered

## 🎯 AGENT WORKFLOW

### Before Starting:
1. Read `PROJECT_OVERVIEW.md`
2. Check `FILES_TO_ADD_OR_MODIFY.md`
3. Follow `FILE_STRUCTURE_AND_CONVENTIONS.md`
4. Use `TODO_WITH_PROMPTS.md` for guidance

### During Development:
1. Follow these rules strictly
2. Test each change thoroughly
3. Update documentation as needed
4. Check the mandatory checklist

### After Completion:
1. Verify all rules followed
2. Test on both iPhone and iPad
3. Check accessibility
4. Update progress in relevant docs

## 🚨 EMERGENCY STOP CONDITIONS

Stop immediately if:
- Security vulnerabilities are introduced
- Organization data isolation is compromised
- HIPAA compliance is violated
- Critical errors are not handled
- Performance is significantly degraded

## 📞 ESCALATION RULES

If you encounter:
- **Security issues** - Stop and document the problem
- **Architecture violations** - Refactor before proceeding
- **Design system conflicts** - Use the design system
- **Performance problems** - Optimize before continuing
- **Accessibility issues** - Fix before proceeding

Remember: **Quality over speed. Security over convenience. User experience over shortcuts.** 🎯 