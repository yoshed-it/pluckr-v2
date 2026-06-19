# Swift/SwiftUI Compilation Fixes Guide

## 🚨 CRITICAL: Read This Before Refactoring!

### SwiftUI Type Checking Errors

**Problem**: "The compiler is unable to type-check this expression in reasonable time"

**DON'T DO THIS:**
- Don't refactor the entire file
- Don't break everything into tiny components 
- Don't delete and recreate code
- Don't waste time and money on complex solutions

**DO THIS INSTEAD (in order):**

1. **Add @ViewBuilder**
   ```swift
   @ViewBuilder
   var body: some View {
       // Your complex view code
   }
   ```

2. **Add explicit return types**
   ```swift
   var someComputedView: some View {
       Text("Hello")
   }
   ```

3. **Break complex view hierarchy with let statements** (BEST FIX)
   ```swift
   @ViewBuilder
   var body: some View {
       // Break down complex views into simple components
       // DON'T redeclare theme properties!
       let titleRow = HStack {
           Text("Title").font(PluckrTheme.bodyFont())
           Spacer()
           Text("Value").foregroundColor(PluckrTheme.textPrimary)
       }
       
       let subtitleRow = HStack {
           Text("Subtitle").font(PluckrTheme.captionFont())
           Spacer()
       }
       
       // Simple final structure
       return VStack {
           titleRow
           subtitleRow
           // other simple components
       }
   }
   ```

4. **Break ForEach closures into functions**
   ```swift
   // Instead of complex inline closures
   ForEach(items) { item in
       makeRowView(for: item)
   }
   
   func makeRowView(for item: Item) -> some View {
       // Complex view code here
   }
   ```

4. **Only if above fails**: Extract into smaller views

### MainActor Isolation Errors

**Problem**: "Main actor-isolated property can not be referenced from a nonisolated context"

**Quick Fixes:**

1. **For static properties**:
   ```swift
   // Instead of accessing .shared directly
   nonisolated static var live: AppEnvironment {
       AppEnvironment(
           service: ServiceClass() // Create new instance
       )
   }
   ```

2. **For init methods**:
   ```swift
   nonisolated init() {
       // Non-isolated initialization
   }
   ```

3. **For async contexts**:
   ```swift
   Task { @MainActor in
       // Access MainActor-isolated properties here
   }
   ```

### Preview Errors

**Problem**: "@State used inline will not work unless tagged with @Previewable"

**Fix**: These are just warnings, not errors. Ignore them unless you need the preview to work.

If you need the preview:
```swift
#Preview {
    @Previewable @State var value = false
    
    return SomeView(value: $value)
}
```

### Private Initializer Errors

**Problem**: "initializer is inaccessible due to 'private' protection level"

**Fix**: Use the shared instance
```swift
// Wrong
ChartService()

// Right  
ChartService.shared
```

## 🎯 General Rules

1. **Try simple fixes first** - Most SwiftUI errors have simple solutions
2. **Don't refactor unless necessary** - It wastes time and introduces bugs
3. **Check for existing patterns** - The codebase likely has examples
4. **Test compilation frequently** - Don't make 10 changes then test

## 💰 Cost-Saving Tips

1. **@ViewBuilder** fixes 90% of type checking errors
2. **Don't restructure files** unless explicitly asked
3. **Read the actual error** - It often tells you exactly what's wrong
4. **Use git checkout** to undo mistakes quickly

Remember: The user is paying per token. Be efficient! 