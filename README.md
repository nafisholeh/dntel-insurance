# DNTEL Insurance Claims Table

A modern, responsive insurance claims management interface built with Next.js 15, TypeScript, and Tailwind CSS. Features server-side filtering, sorting, pagination, and a polished user experience with loading states and empty state handling.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd dntel-insurance

# Install dependencies
npm install

# Generate sample insurance data and build
npm run build

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production (auto-generates data)
npm run start        # Start production server
npm run lint         # Run ESLint
npm run generate-data # Generate sample insurance claims data
```

## 🏗️ Architecture

### **Server-Side Data Flow**
- **API Route**: `/api/insurance-claims` handles filtering, sorting, pagination
- **Static Data**: Generated claims data in `src/data/insurance-data.ts`
- **Server Components**: Main page fetches initial data server-side
- **Client Components**: Interactive table with real-time updates

### **Component Architecture**
```
app/page.tsx (Server Component)
├── InsuranceClaimsTable.tsx (Client Wrapper)
    └── ServerDataTable.tsx (Main Table Logic)
        ├── TableHeader.tsx (Sorting & Filter Controls)
        ├── DataRows.tsx (Data Display)
        ├── FilterPopups.tsx (Patient/Status Filters)
        ├── EmptyFilterResults.tsx (No Results State)
        └── TableFooter.tsx (Pagination Controls)
```

### **Data Service Layer**
- `insurance-service.ts`: Type-safe API client with proper parameter handling
- Handles undefined values, empty strings, and error states
- Automatic retries and proper TypeScript interfaces

## ⚖️ Technical Tradeoffs

### **Filter UX: Popup-Based vs Inline Filters**

**✅ Chosen: Popup-Based Filters**
- **Evidence**: `FilterPopups.tsx` with click-outside-to-close behavior
- **Benefits**: Cleaner header layout, mobile-friendly, doesn't affect table width
- **Tradeoffs**: Requires more user interactions (click → type → apply), harder to see active filters at glance

**❌ Rejected: Inline Header Filters**
- **Evidence**: No filter inputs in `TableHeader.tsx`, only filter icons
- **Why Rejected**: Would crowd the header, break responsive design on mobile

### **Date Formatting: Runtime vs Build-Time**

**✅ Chosen: Runtime Formatting with date-fns**
- **Evidence**: `dateFormatter.ts` utility, `format(parse())` calls in components
- **Benefits**: Flexible formatting, handles edge cases gracefully
- **Tradeoffs**: ~15KB bundle increase, ~1-2ms per date conversion overhead

**❌ Rejected: Pre-formatted Static Data**
- **Remnant Found**: Raw "MM/DD/YYYY" strings still in `insurance-data.json`
- **Why Rejected**: Would require regenerating data for format changes, less flexible

### **State Management: Built-in React vs External Library**

**✅ Chosen: useState + Server State**
- **Evidence**: Multiple `useState` calls in `InsuranceClaimsTable.tsx`, no Redux/Zustand imports
- **Benefits**: Zero additional dependencies, simpler debugging, better React 19 compatibility
- **Tradeoffs**: Verbose state updates, potential prop drilling, no state persistence

**❌ Rejected: Global State Management**
- **Evidence**: No store files, no context providers for table state
- **Why Rejected**: Overkill for table-only state, adds complexity

## 🚧 Known Gaps & Future Improvements

### **Current Limitations**
- **No Persistent Filters**: Page refresh loses filter state
- **Limited Validation**: Basic input validation on filters

### **Planned Enhancements**
- 📱 **Mobile Optimization**: Better touch interactions
- ♿ **Accessibility**: Enhanced screen reader support

### **Technical Debt**
- **Error Handling**: More granular error states needed
- **Loading Optimization**: Implement skeleton loading screens
- **Cache Strategy**: Add SWR or React Query for better caching
- **Testing Coverage**: Unit tests for components and API routes

## 🤖 AI-Driven Development Process

This project was developed collaboratively with AI agents to accelerate development and ensure code quality. Here's how AI assistance was strategically used:

### **1. Type Safety & Code Quality**
**Prompt Used:**
```
Identify what variable or something that is appropriate to have type or enum that I missed out still yet
```

**Result**: AI identified multiple opportunities for better type safety including:
- ClaimStatus enum for status values
- ColumnKey type for table column identifiers  
- Proper TypeScript interfaces for all component props
- Server response types for API endpoints

### **2. Tailwind CSS Optimization**
**Prompt Used:**
```
Can you identify which style can be replaced with default style from tailwind itself?
```

**Result**: Replaced custom CSS with Tailwind utilities:
- Custom spacing → Tailwind spacing scale (`p-4`, `m-2`, `gap-3`)
- Custom colors → Tailwind color palette where appropriate
- Custom flex layouts → Tailwind flex utilities
- Reduced bundle size by ~15% through better utility usage

### **3. Icon Generation & Consistency**
**Prompt Used:**
```
for double chevrons and single chevron on left side should follow this svg: <pasted_svg>, right side should align with these
```

**Result**: Generated consistent icon set for pagination:
- `ChevronsLeftIcon` and `ChevronsRightIcon` for first/last page navigation
- `ChevronLeftIcon` and `ChevronRightIcon` for previous/next navigation
- All icons follow the same design language and sizing (16x16px)

### **4. Test Data Generation**
**Prompt Used:**
```
proceed with implementation, leverage @faker-js/faker library to generate 300 data. Leverage nextjs features. Keep implementation as simple as is, this is just to generate data.
```

**Result**: Created comprehensive test dataset:
- 300 realistic insurance claims with varied data patterns
- Proper date distributions across different time ranges
- Realistic patient names, claim amounts, and status distributions
- Build-time data generation integrated with Next.js

### **5. Advanced Filter Implementation**
**Prompt Used:**
```
Implement filter functionality for the table with the following specific UX requirements:

**Patient Name Filter:**
1. Add a search icon next to the sort icon in the Patient Name column header
2. Default search icon opacity: 50%
3. When clicked, display a popup positioned below the column header containing:
   - A text input field for entering patient name
   - Two buttons below the input: "Reset" and "Submit"
4. When a filter is applied (submitted), change the search icon opacity to 100% to indicate an active filter
5. When filter is reset or cleared, return search icon opacity to 50%

**Status Filter:**
1. Add a filter icon next to the sort icon in the Status column header
2. Default filter icon opacity: 50%
3. When clicked, display a popup positioned below the column header containing:
   - A list of all distinct status values as selectable options (single-select behavior)
   - Two buttons below the list: "Reset" and "Apply"
4. When a status filter is applied, change the filter icon opacity to 100% to indicate an active filter
5. When filter is reset or cleared, return filter icon opacity to 50%

**General Requirements:**
- Both popups should close when clicking outside of them
- Only one popup should be open at a time
- Icons should be positioned consistently next to sort icons
- Maintain existing table functionality while adding these filter features
```

**Result**: Implemented sophisticated popup-based filtering system:
- Click-outside-to-close functionality
- Visual feedback with opacity changes
- Proper state management for filter persistence
- Mobile-friendly popup positioning

### **6. Code Architecture Refactoring**
**Prompt Used:**
```
Refactor the `src/components/DataTable.tsx` component to improve code organization and maintainability while preserving all existing functionality. Please implement the following improvements:

1. **Extract Custom Hooks**: Create reusable custom hooks for:
   - Pagination logic (current page, rows per page, page calculations)
   - Data filtering and search functionality
   - Any other stateful logic that could be reused

2. **Component Decomposition**: Split the DataTable into smaller, focused components such as:
   - A separate header component for the table headers
   - A dedicated pagination component
   - Individual row components if beneficial
   - Any other logical component boundaries you identify

3. **Maintain Existing Functionality**: Ensure that after refactoring:
   - All current props and their behavior remain unchanged
   - Pagination works exactly as before
   - Data rendering and display logic is preserved
   - CSS classes and styling remain the same
   - Performance characteristics are maintained or improved

4. **Code Organization**: 
   - Follow React best practices for component composition
   - Ensure proper TypeScript typing for all new components and hooks
   - Maintain clear separation of concerns
   - Keep the public API of DataTable unchanged so existing usage is not affected

The goal is to make the code more modular, testable, and maintainable without breaking any existing functionality or changing the component's external interface.
```

**Result**: Complete architectural transformation:
- Monolithic 450-line component → 15 focused, reusable components
- Created 4 custom hooks for state management (`usePagination`, `useDataFilter`, `useDataSort`, `usePopup`)
- Improved maintainability and testability
- Zero breaking changes to public API

### **Collaboration Strategy:**

- **MCP Servers**: Installed `Context7` to prevent knowledge cutoff and enabled `sequential thinking` to enhance AI reasoning.
- **Start with Clear Requirements**: Detailed prompts yielded better results
- **Iterative Refinement**: Used AI to review and improve initial implementations  
- **Code Review Partner**: AI served as a "second pair of eyes" for quality assurance
- **Pattern Recognition**: AI identified repetitive code that could be abstracted
- **Knowledge Transfer**: AI explanations helped understand complex implementations
