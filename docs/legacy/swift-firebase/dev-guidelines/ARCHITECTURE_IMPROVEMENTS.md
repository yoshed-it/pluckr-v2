# Pluckr Architecture Improvements Guide

## 🏛️ Current Architecture Issues & Solutions

### 1. Organization Context Management

**Current Problem**: No organization context throughout the app. Hardcoded org IDs and no user-org relationship tracking.

**Proposed Solution**: Implement Organization Context Provider

```swift
// Create OrganizationContext.swift
import SwiftUI
import Combine

@MainActor
class OrganizationContext: ObservableObject {
    @Published var currentOrganization: Organization?
    @Published var userRole: UserRole = .viewer
    @Published var isLoading = true
    
    private let authService: AuthService
    private let organizationService: OrganizationService
    
    init(authService: AuthService, organizationService: OrganizationService) {
        self.authService = authService
        self.organizationService = organizationService
        setupBindings()
    }
    
    private func setupBindings() {
        authService.$currentUser
            .compactMap { $0 }
            .sink { [weak self] user in
                Task {
                    await self?.loadUserOrganization(userId: user.uid)
                }
            }
            .store(in: &cancellables)
    }
    
    private func loadUserOrganization(userId: String) async {
        do {
            let (org, role) = try await organizationService.getUserOrganization(userId: userId)
            self.currentOrganization = org
            self.userRole = role
            self.isLoading = false
        } catch {
            PluckrLogger.error("Failed to load organization: \(error)")
            self.isLoading = false
        }
    }
}

// Update PluckrApp.swift
@main
struct PluckrApp: App {
    @StateObject private var authService = AuthService()
    @StateObject private var orgContext: OrganizationContext
    
    init() {
        let auth = AuthService()
        let orgService = OrganizationService()
        _orgContext = StateObject(wrappedValue: OrganizationContext(
            authService: auth,
            organizationService: orgService
        ))
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authService)
                .environmentObject(orgContext)
        }
    }
}
```

### 2. Repository Pattern Implementation

**Current Problem**: Direct Firestore access from ViewModels, no proper data layer abstraction.

**Proposed Solution**: Implement proper repository pattern with organization scoping

```swift
// Update ClientRepository.swift
protocol ClientRepositoryProtocol {
    func observeClients(orgId: String, onUpdate: @escaping ([Client]) -> Void)
    func createClient(orgId: String, input: ClientInput) async throws -> Client
    func updateClient(orgId: String, client: Client) async throws
    func deleteClient(orgId: String, clientId: String) async throws
}

final class ClientRepository: ClientRepositoryProtocol {
    private let db = Firestore.firestore()
    private var listeners: [String: ListenerRegistration] = [:]
    
    func observeClients(orgId: String, onUpdate: @escaping ([Client]) -> Void) {
        // Remove existing listener
        listeners[orgId]?.remove()
        
        // Create organization-scoped query
        let query = db.collection("organizations")
            .document(orgId)
            .collection("clients")
            .whereField("deletedAt", isEqualTo: NSNull())
            .order(by: "lastSeenAt", descending: true)
        
        listeners[orgId] = query.addSnapshotListener { snapshot, error in
            guard let docs = snapshot?.documents else {
                PluckrLogger.error("Failed to observe clients: \(error?.localizedDescription ?? "Unknown")")
                onUpdate([])
                return
            }
            
            let clients = docs.compactMap { doc in
                Client(data: doc.data(), id: doc.documentID)
            }
            
            onUpdate(clients)
        }
    }
    
    func createClient(orgId: String, input: ClientInput) async throws -> Client {
        var data = input.toFirestoreData()
        data["organizationId"] = orgId
        data["createdAt"] = FieldValue.serverTimestamp()
        data["lastSeenAt"] = FieldValue.serverTimestamp()
        
        let docRef = try await db.collection("organizations")
            .document(orgId)
            .collection("clients")
            .addDocument(data: data)
        
        let snapshot = try await docRef.getDocument()
        guard let client = Client(data: snapshot.data() ?? [:], id: docRef.documentID) else {
            throw PluckrError.dataCorruption
        }
        
        return client
    }
}
```

### 3. Dependency Injection

**Current Problem**: ViewModels create their own dependencies, making testing difficult.

**Proposed Solution**: Implement dependency container

```swift
// Create DependencyContainer.swift
protocol DependencyContainerProtocol {
    var authService: AuthService { get }
    var clientRepository: ClientRepositoryProtocol { get }
    var chartService: ChartServiceProtocol { get }
    var organizationService: OrganizationServiceProtocol { get }
    var imageService: ImageServiceProtocol { get }
}

class DependencyContainer: DependencyContainerProtocol {
    lazy var authService = AuthService()
    lazy var clientRepository: ClientRepositoryProtocol = ClientRepository()
    lazy var chartService: ChartServiceProtocol = ChartService()
    lazy var organizationService: OrganizationServiceProtocol = OrganizationService()
    lazy var imageService: ImageServiceProtocol = ImageService()
    
    static let shared = DependencyContainer()
    
    // For testing
    init(
        authService: AuthService? = nil,
        clientRepository: ClientRepositoryProtocol? = nil,
        chartService: ChartServiceProtocol? = nil
    ) {
        if let auth = authService { self.authService = auth }
        if let repo = clientRepository { self.clientRepository = repo }
        if let chart = chartService { self.chartService = chart }
    }
}

// Update ViewModels to accept dependencies
@MainActor
class ClientsListViewModel: ObservableObject {
    @Published var clients: [Client] = []
    @Published var isLoading = false
    @Published var error: PluckrError?
    
    private let repository: ClientRepositoryProtocol
    private let orgContext: OrganizationContext
    
    init(
        repository: ClientRepositoryProtocol = DependencyContainer.shared.clientRepository,
        orgContext: OrganizationContext
    ) {
        self.repository = repository
        self.orgContext = orgContext
        setupObservers()
    }
    
    private func setupObservers() {
        guard let orgId = orgContext.currentOrganization?.id else { return }
        
        repository.observeClients(orgId: orgId) { [weak self] clients in
            Task { @MainActor in
                self?.clients = clients
                self?.isLoading = false
            }
        }
    }
}
```

### 4. Navigation Coordinator

**Current Problem**: Navigation logic scattered across views, no centralized routing.

**Proposed Solution**: Implement coordinator pattern

```swift
// Create NavigationCoordinator.swift
enum Route: Hashable {
    case clientList
    case clientDetail(Client)
    case chartEntry(clientId: String, chartId: String?)
    case settings
    case organizationManagement
}

@MainActor
class NavigationCoordinator: ObservableObject {
    @Published var path = NavigationPath()
    @Published var sheet: Route?
    @Published var fullScreenCover: Route?
    
    func navigate(to route: Route) {
        path.append(route)
    }
    
    func presentSheet(_ route: Route) {
        sheet = route
    }
    
    func presentFullScreen(_ route: Route) {
        fullScreenCover = route
    }
    
    func pop() {
        if !path.isEmpty {
            path.removeLast()
        }
    }
    
    func popToRoot() {
        path = NavigationPath()
    }
    
    @ViewBuilder
    func view(for route: Route) -> some View {
        switch route {
        case .clientList:
            ClientsListView()
        case .clientDetail(let client):
            ClientJournalView(client: client)
        case .chartEntry(let clientId, let chartId):
            ChartEntryFormView(clientId: clientId, chartId: chartId)
        case .settings:
            SettingsView()
        case .organizationManagement:
            OrganizationManagementView()
        }
    }
}

// Update main navigation view
struct MainNavigationView: View {
    @StateObject private var coordinator = NavigationCoordinator()
    
    var body: some View {
        NavigationStack(path: $coordinator.path) {
            ProviderHomeView()
                .navigationDestination(for: Route.self) { route in
                    coordinator.view(for: route)
                }
        }
        .environmentObject(coordinator)
        .sheet(item: $coordinator.sheet) { route in
            NavigationStack {
                coordinator.view(for: route)
            }
        }
        .fullScreenCover(item: $coordinator.fullScreenCover) { route in
            NavigationStack {
                coordinator.view(for: route)
            }
        }
    }
}
```

### 5. Error Handling System

**Current Problem**: Inconsistent error handling, no user-friendly error messages.

**Proposed Solution**: Unified error handling with recovery options

```swift
// Create PluckrError.swift
enum PluckrError: LocalizedError, Identifiable {
    case network(underlying: Error)
    case authentication(message: String)
    case authorization(requiredRole: UserRole)
    case dataNotFound(entity: String)
    case dataCorruption
    case organizationNotFound
    case imageUploadFailed(Error)
    case encryptionFailed
    case validationFailed(field: String, reason: String)
    
    var id: String {
        switch self {
        case .network: return "network"
        case .authentication: return "auth"
        case .authorization: return "authz"
        case .dataNotFound: return "notfound"
        case .dataCorruption: return "corruption"
        case .organizationNotFound: return "noorg"
        case .imageUploadFailed: return "imageupload"
        case .encryptionFailed: return "encryption"
        case .validationFailed(let field, _): return "validation-\(field)"
        }
    }
    
    var errorDescription: String? {
        switch self {
        case .network:
            return "Network connection error"
        case .authentication(let message):
            return message
        case .authorization(let role):
            return "You need \(role.displayName) access to perform this action"
        case .dataNotFound(let entity):
            return "\(entity) not found"
        case .dataCorruption:
            return "Data integrity error"
        case .organizationNotFound:
            return "Organization not found"
        case .imageUploadFailed:
            return "Failed to upload image"
        case .encryptionFailed:
            return "Encryption error"
        case .validationFailed(let field, let reason):
            return "\(field): \(reason)"
        }
    }
    
    var recoverySuggestion: String? {
        switch self {
        case .network:
            return "Please check your internet connection and try again"
        case .authentication:
            return "Please sign in again"
        case .authorization:
            return "Contact your administrator for access"
        case .dataNotFound:
            return "The requested data may have been deleted"
        case .dataCorruption, .encryptionFailed:
            return "Please contact support"
        case .organizationNotFound:
            return "Please select or create an organization"
        case .imageUploadFailed:
            return "Try uploading a smaller image or check your connection"
        case .validationFailed:
            return "Please correct the error and try again"
        }
    }
}

// Create ErrorHandler.swift
@MainActor
class ErrorHandler: ObservableObject {
    @Published var currentError: PluckrError?
    @Published var isShowingError = false
    
    func handle(_ error: Error) {
        if let pluckrError = error as? PluckrError {
            currentError = pluckrError
        } else {
            currentError = .network(underlying: error)
        }
        isShowingError = true
        
        // Log error
        PluckrLogger.error("Error occurred: \(error)")
    }
    
    func clearError() {
        currentError = nil
        isShowingError = false
    }
}

// Error View Modifier
struct ErrorAlertModifier: ViewModifier {
    @EnvironmentObject var errorHandler: ErrorHandler
    
    func body(content: Content) -> some View {
        content
            .alert(
                "Error",
                isPresented: $errorHandler.isShowingError,
                presenting: errorHandler.currentError
            ) { error in
                Button("OK") {
                    errorHandler.clearError()
                }
                
                if error.id == "auth" {
                    Button("Sign In") {
                        // Navigate to login
                    }
                }
            } message: { error in
                VStack {
                    Text(error.localizedDescription)
                    if let suggestion = error.recoverySuggestion {
                        Text(suggestion)
                            .font(.caption)
                    }
                }
            }
    }
}
```

### 6. State Management Best Practices

**Current Problem**: Inconsistent use of @State, @StateObject, @ObservedObject.

**Guidelines**:

```swift
// CORRECT: Use @StateObject for ViewModels owned by the view
struct ClientsListView: View {
    @StateObject private var viewModel: ClientsListViewModel
    
    init(orgContext: OrganizationContext) {
        _viewModel = StateObject(wrappedValue: ClientsListViewModel(orgContext: orgContext))
    }
}

// CORRECT: Use @ObservedObject for injected ViewModels
struct ClientDetailView: View {
    @ObservedObject var viewModel: ClientDetailViewModel
}

// CORRECT: Use @EnvironmentObject for app-wide state
struct SomeView: View {
    @EnvironmentObject var orgContext: OrganizationContext
    @EnvironmentObject var errorHandler: ErrorHandler
}

// CORRECT: Use @State for local UI state only
struct FormView: View {
    @State private var isShowingPicker = false
    @State private var selectedDate = Date()
}

// WRONG: Don't use @State for business logic
struct BadExample: View {
    @State private var clients: [Client] = [] // ❌ Should be in ViewModel
}
```

### 7. Performance Optimizations

**List Performance**:

```swift
// Implement pagination in ClientRepository
func loadClients(
    orgId: String,
    limit: Int = 20,
    after cursor: DocumentSnapshot? = nil
) async throws -> (clients: [Client], lastDocument: DocumentSnapshot?) {
    var query = db.collection("organizations")
        .document(orgId)
        .collection("clients")
        .order(by: "lastSeenAt", descending: true)
        .limit(to: limit)
    
    if let cursor = cursor {
        query = query.start(afterDocument: cursor)
    }
    
    let snapshot = try await query.getDocuments()
    let clients = snapshot.documents.compactMap { doc in
        Client(data: doc.data(), id: doc.documentID)
    }
    
    return (clients, snapshot.documents.last)
}

// Update ViewModel for pagination
class ClientsListViewModel: ObservableObject {
    @Published var clients: [Client] = []
    @Published var isLoadingMore = false
    @Published var hasMoreData = true
    
    private var lastDocument: DocumentSnapshot?
    
    func loadMore() async {
        guard !isLoadingMore, hasMoreData else { return }
        
        isLoadingMore = true
        do {
            let (newClients, lastDoc) = try await repository.loadClients(
                orgId: orgId,
                after: lastDocument
            )
            
            await MainActor.run {
                self.clients.append(contentsOf: newClients)
                self.lastDocument = lastDoc
                self.hasMoreData = newClients.count == 20
                self.isLoadingMore = false
            }
        } catch {
            await MainActor.run {
                self.isLoadingMore = false
                errorHandler.handle(error)
            }
        }
    }
}
```

## 🏗️ Migration Strategy

1. **Phase 1**: Add organization context without breaking existing functionality
2. **Phase 2**: Migrate data to organization-scoped collections
3. **Phase 3**: Update all queries to use organization scope
4. **Phase 4**: Remove legacy code and hardcoded values

## 📚 Additional Resources

- [Swift Composable Architecture](https://github.com/pointfreeco/swift-composable-architecture) - Consider for complex state management
- [Factory](https://github.com/hmlongco/Factory) - Lightweight dependency injection
- [SwiftUI Navigation](https://developer.apple.com/documentation/swiftui/navigationstack) - Official navigation documentation 