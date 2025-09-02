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
