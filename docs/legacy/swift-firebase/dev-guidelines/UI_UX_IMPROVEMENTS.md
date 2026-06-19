# Pluckr UI/UX Improvements Guide

## 🎨 Design System Enhancements

### 1. Comprehensive Design Tokens

**Current Issue**: Basic theme with limited tokens, inconsistent spacing.

**Improved Design System**:

```swift
// Create DesignSystem.swift
enum PluckrDesignSystem {
    
    // MARK: - Spacing
    enum Spacing {
        static let xxs: CGFloat = 2
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 24
        static let xxl: CGFloat = 32
        static let xxxl: CGFloat = 48
        
        // Semantic spacing
        static let cardPadding: CGFloat = lg
        static let sectionSpacing: CGFloat = xl
        static let screenPadding: CGFloat = lg
    }
    
    // MARK: - Typography
    enum Typography {
        static let largeTitle = Font.system(size: 34, weight: .bold, design: .rounded)
        static let title1 = Font.system(size: 28, weight: .semibold, design: .rounded)
        static let title2 = Font.system(size: 22, weight: .semibold, design: .rounded)
        static let title3 = Font.system(size: 20, weight: .medium, design: .rounded)
        static let headline = Font.system(size: 17, weight: .semibold, design: .default)
        static let body = Font.system(size: 17, weight: .regular, design: .default)
        static let callout = Font.system(size: 16, weight: .regular, design: .default)
        static let subheadline = Font.system(size: 15, weight: .regular, design: .default)
        static let footnote = Font.system(size: 13, weight: .regular, design: .default)
        static let caption = Font.system(size: 12, weight: .regular, design: .default)
        static let caption2 = Font.system(size: 11, weight: .regular, design: .default)
        
        // Clinical-specific
        static let chartTitle = Font.system(size: 20, weight: .semibold, design: .monospaced)
        static let dataLabel = Font.system(size: 14, weight: .medium, design: .monospaced)
    }
    
    // MARK: - Colors
    enum Colors {
        // Primary palette
        static let primary = Color("PluckrAccent")
        static let secondary = Color("PluckrCard")
        static let tertiary = Color("PluckrButton")
        
        // Semantic colors
        static let background = Color("PluckrBackground")
        static let surface = Color.white
        static let surfaceSecondary = Color(UIColor.secondarySystemBackground)
        
        // Text colors
        static let textPrimary = Color(UIColor.label)
        static let textSecondary = Color(UIColor.secondaryLabel)
        static let textTertiary = Color(UIColor.tertiaryLabel)
        static let textPlaceholder = Color(UIColor.placeholderText)
        
        // Status colors
        static let success = Color.green
        static let warning = Color.orange
        static let error = Color.red
        static let info = Color.blue
        
        // Clinical status
        static let urgent = Color(red: 0.8, green: 0.2, blue: 0.2)
        static let routine = Color(red: 0.2, green: 0.6, blue: 0.2)
        static let followUp = Color(red: 0.8, green: 0.6, blue: 0.2)
    }
    
    // MARK: - Shadows
    enum Shadows {
        static let small = Shadow(
            color: .black.opacity(0.05),
            radius: 2,
            x: 0,
            y: 1
        )
        
        static let medium = Shadow(
            color: .black.opacity(0.1),
            radius: 4,
            x: 0,
            y: 2
        )
        
        static let large = Shadow(
            color: .black.opacity(0.15),
            radius: 8,
            x: 0,
            y: 4
        )
        
        static let card = Shadow(
            color: .black.opacity(0.08),
            radius: 6,
            x: 0,
            y: 2
        )
    }
    
    // MARK: - Corner Radius
    enum CornerRadius {
        static let small: CGFloat = 8
        static let medium: CGFloat = 12
        static let large: CGFloat = 16
        static let xl: CGFloat = 20
        static let xxl: CGFloat = 24
        static let pill: CGFloat = 100
    }
    
    // MARK: - Animation
    enum Animation {
        static let quick = SwiftUI.Animation.easeInOut(duration: 0.2)
        static let standard = SwiftUI.Animation.easeInOut(duration: 0.3)
        static let slow = SwiftUI.Animation.easeInOut(duration: 0.5)
        static let spring = SwiftUI.Animation.spring(response: 0.5, dampingFraction: 0.8)
    }
}
```

### 2. Enhanced Component Library

**Clinical Card Component**:

```swift
// Create ClinicalCard.swift
struct ClinicalCard<Content: View>: View {
    let content: Content
    var padding: CGFloat = PluckrDesignSystem.Spacing.cardPadding
    var cornerRadius: CGFloat = PluckrDesignSystem.CornerRadius.large
    
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        content
            .padding(padding)
            .background(PluckrDesignSystem.Colors.surface)
            .cornerRadius(cornerRadius)
            .shadow(
                color: PluckrDesignSystem.Shadows.card.color,
                radius: PluckrDesignSystem.Shadows.card.radius,
                x: PluckrDesignSystem.Shadows.card.x,
                y: PluckrDesignSystem.Shadows.card.y
            )
    }
}

// Usage
ClinicalCard {
    VStack(alignment: .leading, spacing: PluckrDesignSystem.Spacing.sm) {
        Text("Patient Name")
            .font(PluckrDesignSystem.Typography.headline)
        Text("Last visit: 2 days ago")
            .font(PluckrDesignSystem.Typography.footnote)
            .foregroundColor(PluckrDesignSystem.Colors.textSecondary)
    }
}
```

**Form Field Component**:

```swift
// Create FormField.swift
struct FormField: View {
    let label: String
    @Binding var text: String
    var placeholder: String = ""
    var keyboardType: UIKeyboardType = .default
    var isRequired: Bool = false
    var errorMessage: String? = nil
    
    @FocusState private var isFocused: Bool
    
    var body: some View {
        VStack(alignment: .leading, spacing: PluckrDesignSystem.Spacing.xs) {
            // Label
            HStack(spacing: PluckrDesignSystem.Spacing.xs) {
                Text(label)
                    .font(PluckrDesignSystem.Typography.subheadline)
                    .foregroundColor(PluckrDesignSystem.Colors.textPrimary)
                
                if isRequired {
                    Text("*")
                        .foregroundColor(PluckrDesignSystem.Colors.error)
                }
            }
            
            // Text Field
            TextField(placeholder, text: $text)
                .textFieldStyle(ClinicalTextFieldStyle(
                    isFocused: isFocused,
                    hasError: errorMessage != nil
                ))
                .keyboardType(keyboardType)
                .focused($isFocused)
            
            // Error Message
            if let error = errorMessage {
                HStack(spacing: PluckrDesignSystem.Spacing.xs) {
                    Image(systemName: "exclamationmark.circle.fill")
                        .font(.caption)
                    Text(error)
                        .font(PluckrDesignSystem.Typography.caption)
                }
                .foregroundColor(PluckrDesignSystem.Colors.error)
                .transition(.opacity.combined(with: .scale))
            }
        }
        .animation(PluckrDesignSystem.Animation.quick, value: errorMessage)
    }
}

struct ClinicalTextFieldStyle: TextFieldStyle {
    let isFocused: Bool
    let hasError: Bool
    
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding(PluckrDesignSystem.Spacing.md)
            .background(PluckrDesignSystem.Colors.surface)
            .cornerRadius(PluckrDesignSystem.CornerRadius.medium)
            .overlay(
                RoundedRectangle(cornerRadius: PluckrDesignSystem.CornerRadius.medium)
                    .stroke(
                        hasError ? PluckrDesignSystem.Colors.error :
                        isFocused ? PluckrDesignSystem.Colors.primary :
                        PluckrDesignSystem.Colors.textPlaceholder.opacity(0.3),
                        lineWidth: isFocused || hasError ? 2 : 1
                    )
            )
            .animation(PluckrDesignSystem.Animation.quick, value: isFocused)
            .animation(PluckrDesignSystem.Animation.quick, value: hasError)
    }
}
```

### 3. iPad-Optimized Layouts

**Adaptive Layout System**:

```swift
// Create AdaptiveLayout.swift
struct AdaptiveLayout: ViewModifier {
    @Environment(\.horizontalSizeClass) var horizontalSizeClass
    @Environment(\.verticalSizeClass) var verticalSizeClass
    
    var isIPad: Bool {
        horizontalSizeClass == .regular && verticalSizeClass == .regular
    }
    
    func body(content: Content) -> some View {
        if isIPad {
            content
                .frame(maxWidth: 800)
                .padding(.horizontal, PluckrDesignSystem.Spacing.xxxl)
        } else {
            content
                .padding(.horizontal, PluckrDesignSystem.Spacing.screenPadding)
        }
    }
}

extension View {
    func adaptiveLayout() -> some View {
        modifier(AdaptiveLayout())
    }
}

// Split View for iPad
struct ProviderHomeIPadView: View {
    @State private var selectedClient: Client?
    @StateObject private var viewModel = ProviderHomeViewModel()
    
    var body: some View {
        NavigationSplitView {
            ClientsListSidebar(
                clients: viewModel.clients,
                selectedClient: $selectedClient
            )
            .navigationTitle("Clients")
        } detail: {
            if let client = selectedClient {
                ClientJournalView(client: client)
            } else {
                ContentUnavailableView(
                    "Select a Client",
                    systemImage: "person.crop.circle",
                    description: Text("Choose a client from the sidebar to view their journal")
                )
            }
        }
        .navigationSplitViewStyle(.balanced)
    }
}
```

### 4. Enhanced Form UX

**Smart Form with Validation**:

```swift
// Create SmartForm.swift
struct SmartForm<Content: View>: View {
    @FocusState private var focusedField: AnyHashable?
    let content: Content
    
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: PluckrDesignSystem.Spacing.lg) {
                content
            }
            .padding()
        }
        .scrollDismissesKeyboard(.interactively)
        .toolbar {
            ToolbarItemGroup(placement: .keyboard) {
                Spacer()
                Button("Done") {
                    focusedField = nil
                }
            }
        }
    }
}

// Field validation
protocol FieldValidator {
    func validate(_ value: String) -> String?
}

struct EmailValidator: FieldValidator {
    func validate(_ value: String) -> String? {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let predicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return predicate.evaluate(with: value) ? nil : "Invalid email address"
    }
}

struct RequiredFieldValidator: FieldValidator {
    func validate(_ value: String) -> String? {
        value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? "This field is required" : nil
    }
}
```

### 5. Loading & Empty States

**Skeleton Loading**:

```swift
// Create SkeletonView.swift
struct SkeletonView: View {
    @State private var isAnimating = false
    
    var body: some View {
        Rectangle()
            .fill(
                LinearGradient(
                    colors: [
                        PluckrDesignSystem.Colors.surfaceSecondary,
                        PluckrDesignSystem.Colors.surface,
                        PluckrDesignSystem.Colors.surfaceSecondary
                    ],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .opacity(0.6)
            .offset(x: isAnimating ? 200 : -200)
            .animation(
                Animation.linear(duration: 1.5)
                    .repeatForever(autoreverses: false),
                value: isAnimating
            )
            .onAppear {
                isAnimating = true
            }
    }
}

// Client List Skeleton
struct ClientListSkeleton: View {
    var body: some View {
        VStack(spacing: PluckrDesignSystem.Spacing.md) {
            ForEach(0..<5) { _ in
                ClinicalCard {
                    VStack(alignment: .leading, spacing: PluckrDesignSystem.Spacing.sm) {
                        SkeletonView()
                            .frame(width: 150, height: 20)
                            .cornerRadius(4)
                        
                        SkeletonView()
                            .frame(width: 100, height: 16)
                            .cornerRadius(4)
                    }
                }
            }
        }
    }
}
```

**Empty States**:

```swift
// Create EmptyStateView.swift
struct EmptyStateView: View {
    let icon: String
    let title: String
    let description: String
    var actionTitle: String? = nil
    var action: (() -> Void)? = nil
    
    var body: some View {
        VStack(spacing: PluckrDesignSystem.Spacing.xl) {
            Image(systemName: icon)
                .font(.system(size: 64))
                .foregroundColor(PluckrDesignSystem.Colors.textTertiary)
            
            VStack(spacing: PluckrDesignSystem.Spacing.sm) {
                Text(title)
                    .font(PluckrDesignSystem.Typography.title2)
                    .foregroundColor(PluckrDesignSystem.Colors.textPrimary)
                
                Text(description)
                    .font(PluckrDesignSystem.Typography.body)
                    .foregroundColor(PluckrDesignSystem.Colors.textSecondary)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
            }
            
            if let actionTitle = actionTitle, let action = action {
                Button(action: action) {
                    Label(actionTitle, systemImage: "plus.circle.fill")
                        .font(PluckrDesignSystem.Typography.headline)
                }
                .buttonStyle(ClinicalButtonStyle())
            }
        }
        .padding(PluckrDesignSystem.Spacing.xxxl)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
```

### 6. Haptic Feedback System

```swift
// Create HapticManager.swift
class HapticManager {
    static let shared = HapticManager()
    
    func impact(_ style: UIImpactFeedbackGenerator.FeedbackStyle) {
        let generator = UIImpactFeedbackGenerator(style: style)
        generator.prepare()
        generator.impactOccurred()
    }
    
    func notification(_ type: UINotificationFeedbackGenerator.FeedbackType) {
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(type)
    }
    
    func selection() {
        let generator = UISelectionFeedbackGenerator()
        generator.prepare()
        generator.selectionChanged()
    }
}

// Usage in buttons
Button(action: {
    HapticManager.shared.impact(.light)
    saveChart()
}) {
    Text("Save")
}
```

### 7. Chart Entry UX Improvements

```swift
// Enhanced Chart Entry Form
struct EnhancedChartEntryForm: View {
    @StateObject private var viewModel: ChartEntryFormViewModel
    @FocusState private var focusedField: Field?
    @State private var showingImagePicker = false
    
    enum Field: Hashable {
        case treatmentArea, notes
    }
    
    var body: some View {
        SmartForm {
            // Progress Indicator
            ChartFormProgress(
                currentStep: viewModel.currentStep,
                totalSteps: 5
            )
            .padding(.bottom, PluckrDesignSystem.Spacing.lg)
            
            // Treatment Area Section
            ClinicalSection(title: "Treatment Area") {
                FormField(
                    label: "Area",
                    text: $viewModel.treatmentArea,
                    placeholder: "e.g., Upper lip, chin",
                    isRequired: true,
                    errorMessage: viewModel.treatmentAreaError
                )
                .focused($focusedField, equals: .treatmentArea)
                .submitLabel(.next)
                .onSubmit {
                    focusedField = .notes
                }
            }
            
            // Modality Selection with Visual Icons
            ClinicalSection(title: "Modality") {
                ModalityPicker(
                    selection: $viewModel.selectedModality,
                    options: viewModel.modalityOptions
                )
            }
            
            // Image Upload with Preview
            ClinicalSection(title: "Images") {
                ImageUploadSection(
                    images: $viewModel.images,
                    onAddImage: {
                        showingImagePicker = true
                    }
                )
            }
            
            // Notes with Character Counter
            ClinicalSection(title: "Clinical Notes") {
                NotesField(
                    text: $viewModel.notes,
                    placeholder: "Add clinical observations...",
                    maxCharacters: 500
                )
                .focused($focusedField, equals: .notes)
            }
            
            // Save Button with Loading State
            SaveButton(
                title: viewModel.isEditing ? "Update Entry" : "Save Entry",
                isLoading: viewModel.isSaving,
                isEnabled: viewModel.canSave
            ) {
                Task {
                    await viewModel.save()
                }
            }
            .padding(.top, PluckrDesignSystem.Spacing.xl)
        }
        .navigationTitle(viewModel.isEditing ? "Edit Entry" : "New Entry")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showingImagePicker) {
            ImagePicker(images: $viewModel.images)
        }
    }
}
```

## 🎯 Clinical UX Best Practices

### 1. Quick Actions
- Swipe to edit/archive
- Long press for context menu
- Keyboard shortcuts for iPad
- Voice dictation support

### 2. Data Entry Efficiency
- Smart defaults based on previous entries
- Auto-complete for common terms
- Templates for routine procedures
- Batch operations

### 3. Visual Hierarchy
- Clear section headers
- Consistent spacing
- Proper contrast ratios (WCAG AA)
- Focus indicators

### 4. Error Prevention
- Confirmation dialogs for destructive actions
- Undo functionality
- Auto-save drafts
- Field validation on blur

### 5. Accessibility
- VoiceOver support
- Dynamic Type support
- High contrast mode
- Reduced motion options

## 📱 Platform-Specific Optimizations

### iPad
- Multi-column layouts
- Drag and drop support
- Keyboard navigation
- Picture-in-picture for reference

### iPhone
- Thumb-friendly tap targets
- Bottom sheet presentations
- Swipe gestures
- Compact layouts

## 🚀 Implementation Priority

1. **Week 1**: Design system and base components
2. **Week 2**: Form improvements and validation
3. **Week 3**: iPad optimizations
4. **Week 4**: Polish and animations 