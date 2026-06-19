# Pluckr Development TODO with AI Prompts

## 🎉 **PHASE 1 SECURITY FOUNDATION: COMPLETED!** 

✅ **All critical security items completed:**
- Organization-based data isolation ✓
- Security rules implemented ✓  
- No hardcoded organization IDs ✓
- Unified error handling ✓
- Organization context throughout app ✓
- HIPAA-compliant architecture ✓

**Ready for Phase 2: Architecture Cleanup!**

---

## 🚨 WEEK 1: CRITICAL SECURITY (Must Complete First)

### Day 1-2: Organization Data Isolation

- [x] **Create Organization Model** ✅ ALREADY EXISTED
  ```
  PROMPT: "Create a Swift Organization model for a clinical app with these fields: id, name, createdAt, ownerId, memberIds array, settings dictionary, subscriptionStatus, and encryptionKeyId. Include Firestore initialization and include proper documentation."
  ```

- [x] **Create UserOrganization Model** ✅ ALREADY EXISTED
  ```
  PROMPT: "Create a UserOrganization model that links users to organizations with fields: userId, organizationId, role (enum: owner, admin, provider, viewer), joinedAt, invitedBy. Include role-based permission checks."
  ```

- [x] **Update Client Model** ✅ COMPLETED
  ```
  PROMPT: "Update this Client model to include organizationId field. Here's the current model: [paste Client.swift]. Ensure backward compatibility for migration."
  ```

- [x] **Refactor ClientRepository** ✅ COMPLETED
  ```
  PROMPT: "Refactor this ClientRepository to use organization-scoped queries. All queries should be under organizations/{orgId}/clients path. Here's the current code: [paste ClientRepository.swift]. Include proper error handling for missing org context."
  ```

- [x] **Create OrganizationService** ✅ ALREADY EXISTED
  ```
  PROMPT: "Create an OrganizationService that handles: fetching user's organization, creating organizations, inviting members, updating org settings. Use async/await and proper error handling. Include HIPAA audit logging for all operations."
  ```

- [x] **Create OrganizationContext** ✅ COMPLETED
  ```
  PROMPT: "Create an OrganizationContext ObservableObject that maintains current organization state, user's role, and provides it throughout the app via @EnvironmentObject. Should update when user changes or org changes."
  ```

### Day 3: Firestore Security Rules

- [x] **Create Comprehensive Security Rules** ✅ COMPLETED
  ```
  PROMPT: "Create Firestore security rules for a HIPAA-compliant clinical app with this structure:
  - organizations/{orgId} with subcollections: clients, charts, providers, tags
  - userOrganizations/{userId} for user-org relationships
  - Users can only access their organization's data
  - Role-based permissions (owner, admin, provider, viewer)
  - Audit log requirements
  Include rules for all CRUD operations and subcollections."
  ```

- [x] **Create Storage Security Rules** ✅ COMPLETED
  ```
  PROMPT: "Create Firebase Storage security rules that:
  - Match the organization structure (/organizations/{orgId}/clients/{clientId}/charts/{chartId}/images/)
  - Verify user belongs to organization
  - Limit file sizes to 10MB
  - Only allow image file types
  - Include read permissions for organization members only"
  ```

### Day 4: Remove Hardcoded Values

- [x] **Fix OrgEncryptionKeyManager** ✅ ALREADY DONE
  ```
  PROMPT: "Refactor this OrgEncryptionKeyManager to dynamically get organizationId from OrganizationContext instead of hardcoded 'demo-clinic': [paste OrgEncryptionKeyManager.swift]. Add proper error handling for missing org context."
  ```

- [x] **Update All Hardcoded Org References** ✅ COMPLETED  
  ```
  PROMPT: "Search for these patterns and show how to replace them with dynamic organization context:
  - 'defaultOrg'
  - 'demo-clinic'
  - Any hardcoded collection paths
  Provide the grep command and replacement pattern."
  ```

### Day 5-6: User-Organization Relationships

- [ ] **Update AuthService**
  ```
  PROMPT: "Update this AuthService to fetch user's organization after login. Add methods: getUserOrganization(), switchOrganization(), checkUserRole(). Here's current code: [paste AuthService.swift]"
  ```

- [ ] **Create Organization Selection View**
  ```
  PROMPT: "Create an OrganizationSelectionView that shows when:
  1. User has no organization (show create/join options)
  2. User has multiple organizations (show picker)
  Use modern SwiftUI with clean clinical design. Include loading states and error handling."
  ```

- [x] **Update App Entry Point** ✅ COMPLETED
  ```
  PROMPT: "Update PluckrApp.swift to:
  1. Check if user has organization after auth
  2. Show org selection if needed
  3. Initialize OrganizationContext
  4. Pass context to all child views
  Here's current code: [paste PluckrApp.swift]"
  ```

### Day 7: Testing & Migration

- [ ] **Create Data Migration Script**
  ```
  PROMPT: "Create a Swift migration function that:
  1. Creates a default organization for existing users
  2. Moves root-level clients to organizations/{orgId}/clients
  3. Updates all chart references
  4. Creates userOrganizations entries
  5. Handles errors and rollback
  Include progress tracking and logging."
  ```

## 🎨 WEEK 2: MAKING IT BEAUTIFUL

### Day 8: Modern Design System

- [ ] **Create Comprehensive Color Palette**
  ```
  PROMPT: "Create a medical app color palette with:
  - Calming primary colors (suggest sage green, soft blues)
  - Status colors for clinical states (urgent, routine, follow-up)
  - Proper contrast ratios for accessibility
  - Light and dark mode support
  Output as Color extensions with hex values."
  ```

- [ ] **Implement Beautiful Cards**
  ```
  PROMPT: "Create a SwiftUI ClientCard component that:
  - Uses neumorphic or glass morphism design
  - Has subtle animations on tap
  - Shows client info hierarchically
  - Includes status indicators
  - Has smooth shadow effects
  Make it feel premium and medical-grade."
  ```

- [ ] **Design System Components**
  ```
  PROMPT: "Create these clinical UI components:
  1. ClinicalButton (primary, secondary, destructive variants)
  2. ClinicalTextField with floating labels
  3. ClinicalCard with different elevation levels
  4. StatusBadge for patient states
  5. SectionHeader with consistent styling
  Use modern iOS 17 design patterns."
  ```

### Day 9: Beautiful Forms

- [ ] **Enhance Chart Entry Form**
  ```
  PROMPT: "Redesign the chart entry form with:
  - Floating labels that animate on focus
  - Smooth section transitions
  - Visual feedback for validation
  - Progress indicator showing form completion
  - Haptic feedback on interactions
  Make it feel like a premium medical app."
  ```

- [ ] **Create Custom Pickers**
  ```
  PROMPT: "Create beautiful custom pickers for:
  1. Modality selection (with icons)
  2. Tag selection (with colors)
  3. Date/time (clinical style)
  Use bottom sheets, smooth animations, and visual feedback."
  ```

### Day 10: Animations & Polish

- [ ] **Add Micro-Interactions**
  ```
  PROMPT: "Add these micro-interactions to the app:
  1. Scale effect on button press
  2. Smooth list item appearance
  3. Pull-to-refresh with custom animation
  4. Loading states with medical theme
  5. Success checkmarks with haptic feedback
  Provide SwiftUI code with custom animations."
  ```

- [ ] **Create Custom Transitions**
  ```
  PROMPT: "Create custom page transitions that:
  1. Smoothly push with slight overlap
  2. Modal presentations with spring physics
  3. Fade + scale for pop-ups
  4. Matched geometry for shared elements
  Make them feel medical-grade professional."
  ```

### Day 11: Empty States & Loading

- [ ] **Design Beautiful Empty States**
  ```
  PROMPT: "Create empty state illustrations and layouts for:
  1. No clients (with add client CTA)
  2. No charts (with create chart CTA)
  3. Search no results
  4. Error states
  Use SF Symbols, soft colors, and encouraging copy. Medical theme."
  ```

- [ ] **Implement Skeleton Screens**
  ```
  PROMPT: "Create skeleton loading screens that:
  1. Match exact layout of loaded content
  2. Use shimmer animation effect
  3. Progressive loading (header first, then content)
  4. Smooth transition to real content
  Implement for client list and chart views."
  ```

### Day 12: iPad Excellence

- [ ] **Create iPad-Optimized Layouts**
  ```
  PROMPT: "Redesign these views for iPad with:
  1. ClientListView - use sidebar navigation
  2. ChartEntryForm - use floating panel
  3. ProviderHome - use grid layout for clients
  4. Settings - use split view
  Include keyboard shortcuts and drag-drop support."
  ```

## 🏗️ WEEK 3: ARCHITECTURE & FEATURES

### Day 13-14: MVVM Cleanup

- [ ] **Refactor Views to MVVM**
  ```
  PROMPT: "Refactor ClientJournalView to proper MVVM:
  1. Move all business logic to ViewModel
  2. View should only have UI code
  3. Use @Published for reactive updates
  4. Include loading and error states
  Here's current code: [paste ClientJournalView.swift]"
  ```

- [ ] **Create Reusable ViewModels**
  ```
  PROMPT: "Create a BaseViewModel protocol that includes:
  - Loading state management
  - Error handling
  - Organization context
  - Common navigation methods
  Then show how to implement it in concrete ViewModels."
  ```

### Day 15: Navigation System

- [ ] **Implement Navigation Coordinator**
  ```
  PROMPT: "Create a NavigationCoordinator that:
  1. Handles all navigation in the app
  2. Supports deep linking
  3. Manages navigation stack
  4. Handles sheets and alerts
  Use iOS 16+ NavigationStack. Include example usage."
  ```

### Day 16-17: Professional Features

- [ ] **Add Search Functionality**
  ```
  PROMPT: "Implement search that:
  1. Searches across client names, phones, emails
  2. Includes recent searches
  3. Has search suggestions
  4. Uses Firestore text search
  Beautiful iOS-native search UI with .searchable modifier."
  ```

- [ ] **Create Settings Screen**
  ```
  PROMPT: "Create a professional settings screen with:
  1. Account section (profile, password, logout)
  2. Organization settings (admin only)
  3. App preferences (theme, notifications)
  4. Data & privacy (export, delete)
  5. About section
  Use Form with proper sections and iOS styling."
  ```

- [ ] **Implement Data Export**
  ```
  PROMPT: "Create data export functionality that:
  1. Exports client data as CSV
  2. Exports charts as PDF
  3. Includes images (encrypted)
  4. Shows progress
  5. Shares via iOS share sheet
  Follow HIPAA compliance for data export."
  ```

### Day 18: Performance

- [ ] **Implement Image Optimization**
  ```
  PROMPT: "Create image handling that:
  1. Compresses images before upload (max 2MB)
  2. Generates thumbnails
  3. Lazy loads images in lists
  4. Caches images locally
  5. Shows progressive loading
  Use modern Swift concurrency."
  ```

- [ ] **Add List Pagination**
  ```
  PROMPT: "Implement infinite scroll pagination for:
  1. Client list (20 items per page)
  2. Chart entries (10 per page)
  3. Search results
  Show loading indicator and handle errors. Use Firestore cursors."
  ```

## 🎯 WEEK 4: POLISH & LAUNCH PREP

### Day 19-20: Testing

- [ ] **Create Unit Tests**
  ```
  PROMPT: "Create unit tests for ClientsListViewModel that test:
  1. Loading clients
  2. Search functionality
  3. Error handling
  4. Organization context
  Use XCTest with async/await support."
  ```

- [ ] **Create UI Tests**
  ```
  PROMPT: "Create UI tests for critical flows:
  1. Login and org selection
  2. Add new client
  3. Create chart entry with image
  4. Search and filter
  Use XCUITest with proper wait conditions."
  ```

### Day 21: Launch Essentials

- [ ] **Create Onboarding Flow**
  ```
  PROMPT: "Create beautiful onboarding that:
  1. Explains app purpose (HIPAA compliant)
  2. Requests permissions (camera, notifications)
  3. Sets up organization
  4. Tutorial for first chart
  Use page view with custom indicators."
  ```

- [ ] **Add Analytics**
  ```
  PROMPT: "Implement privacy-focused analytics that tracks:
  1. Screen views
  2. Feature usage
  3. Error rates
  4. Performance metrics
  No PII, HIPAA compliant. Use Firebase Analytics."
  ```

## 🎨 QUICK BEAUTY WINS (Can do anytime)

- [ ] **Update App Icon**
  ```
  PROMPT: "Design ideas for medical app icon:
  - Clean, professional
  - Medical cross or chart symbol
  - Sage green/blue palette
  - Works at all sizes
  Describe for designer or AI image generator."
  ```

- [ ] **Custom Launch Screen**
  ```
  PROMPT: "Create LaunchScreen.storyboard with:
  - Centered logo
  - Soft gradient background
  - Fade to main app
  - Loading indicator
  Professional medical aesthetic."
  ```

- [ ] **Haptic Feedback**
  ```
  PROMPT: "Add haptic feedback to:
  - All buttons (light impact)
  - Successful save (success notification)
  - Errors (error notification)
  - Pull to refresh (selection change)
  - Swipe actions (medium impact)"
  ```

- [ ] **Sound Effects**
  ```
  PROMPT: "Add subtle sound effects:
  - Success chime on save
  - Soft tap sound on buttons
  - Gentle error sound
  - Camera shutter on photo
  Medical grade, not annoying."
  ```

## 📱 Design Inspiration Prompts

### For Color Schemes:
```
PROMPT: "Suggest 5 color palettes for a medical iOS app that:
- Feel calming and professional
- Work for clinical settings
- Have excellent readability
- Include accent colors for actions
Show hex values and usage examples."
```

### For Layout Ideas:
```
PROMPT: "Show modern iOS app layouts for:
- Client list with search
- Medical chart entry form  
- Settings screen
- Dashboard with stats
Reference apps like Apple Health, Headspace, or Calm for inspiration."
```

### For Typography:
```
PROMPT: "Create a typography scale for medical app:
- Easy to read in clinical settings
- Clear hierarchy
- Works with Dynamic Type
- Professional but approachable
Use SF Pro with appropriate weights."
```

## 🚀 Daily Workflow

### Morning (Planning - 30 min)
1. Pick 3-5 tasks from current day
2. Run prompts to generate initial code
3. Review AI output for issues

### Midday (Implementation - 3-4 hours)
1. Integrate AI-generated code
2. Test each feature
3. Iterate with AI on issues

### Evening (Polish - 1 hour)
1. UI polish and animations
2. Code cleanup
3. Update progress

## 💡 Pro Tips

1. **Always test AI code** - It's 90% right but that 10% matters
2. **Keep design consistent** - Use the design system everywhere
3. **Test on real devices** - Simulator isn't enough for medical apps
4. **Get user feedback early** - Even if not perfect
5. **Document as you go** - AI can help with this too

---

**Remember**: This TODO is your roadmap. Check off items as you complete them. The prompts will save you hours of coding, but you still need to think about the overall architecture and user experience. Good luck! 🚀 