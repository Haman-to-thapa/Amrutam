# Amrutam — Senior React Native Assignment

A production-oriented Ayurvedic Super App built with React Native and TypeScript.

The application is organized into three independent business modules:

1. **Consultation**
2. **Shop**
3. **Health Records**

The implementation focuses on architecture, scalability, performance, offline-first behavior, reliability, accessibility, testing, and developer experience rather than pixel-perfect UI.

---

## Tech Stack

| Area              | Technology                                   |
| ----------------- | -------------------------------------------- |
| Mobile            | React Native 0.87                            |
| Language          | TypeScript                                   |
| Navigation        | React Navigation 7                           |
| State Management  | Redux Toolkit                                |
| Server State      | RTK Query                                    |
| Large Lists       | Shopify FlashList / React Native SectionList |
| Local Storage     | react-native-mmkv                            |
| Network Detection | @react-native-community/netinfo              |
| Forms             | React Hook Form                              |
| Validation        | Zod                                          |
| Date Utilities    | date-fns                                     |
| Testing           | Jest                                         |
| E2E               | Detox                                        |
| JavaScript Engine | Hermes                                       |
| Architecture      | React Native New Architecture                |

---

# Project Goals

The application is designed around the following engineering goals:

* Modular feature architecture
* Strong TypeScript contracts
* Predictable state management
* Large dataset support
* Virtualized rendering
* Offline-first behavior
* Persistent local state
* Centralized error handling
* Reusable UI components
* Theme support
* Accessibility
* Testable business logic
* Clear developer experience

---

# Application Modules

## 1. Consultation

Features implemented:

* Doctor listing
* Doctor search
* Doctor filters
* Doctor details
* Available consultation slots
* Slot selection
* Booking confirmation
* Upcoming consultations
* Cancellation
* Expired slot handling
* Slot conflict handling
* Duplicate booking protection
* Offline booking queue
* Automatic synchronization

### Consultation Flow

```text
Doctor Listing
      ↓
Search / Filters
      ↓
Doctor Details
      ↓
Available Slots
      ↓
Slot Selection
      ↓
Booking Confirmation
      ↓
Confirmed Booking
      ↓
Upcoming Consultation
      ↓
Cancellation
```

---

## 2. Shop

Features implemented:

* Product listing
* 20,000 product dataset
* Infinite scrolling
* Search
* Multi-filter
* Sorting
* Product details
* Wishlist
* Cart
* Quantity management
* Stock-aware quantity limits
* Local cart persistence
* Offline cart support
* Checkout summary

### Shop Flow

```text
Product Listing
      ↓
Search / Filters / Sorting
      ↓
Product Details
      ↓
Add to Cart
      ↓
Cart
      ↓
Quantity Update
      ↓
Checkout Summary
```

---

## 3. Health Records

Features implemented:

* 10,000 health records
* Timeline view
* Month/year grouping
* Search
* Record type filters
* Tag filters
* Record details
* Image attachment preview
* PDF attachment representation
* Pagination
* Virtualized rendering

Supported record types:

```text
Lab Report
Prescription
Consultation
Vaccination
Allergy
```

### Health Records Flow

```text
Health Records Timeline
          ↓
Search / Filters / Tags
          ↓
Record Details
          ↓
Attachments
```

---

# Folder Structure & Module Explanation

The application follows a **Feature-Driven Modular Architecture**. Each directory has a clear single responsibility to ensure maintainability, testability, and scalability:

```text
src/
├── app/                                 # [Application Bootstrapping & Routing Layer]
│   ├── navigation/                      # React Navigation 7 setup & Deep Linking
│   │   ├── RootNavigator.tsx            # Top-level container hosting MainTabs
│   │   ├── MainTabs.tsx                 # Bottom tab bar with safe-area insets & screen freezing
│   │   ├── ConsultationNavigator.tsx    # Stack routing for Doctors, Doctor Details, Booking Confirm
│   │   ├── ShopNavigator.tsx            # Stack routing for Catalog, Product Details, Cart, Checkout
│   │   ├── HealthRecordsNavigator.tsx   # Stack routing for Records Timeline, Record Details
│   │   ├── SettingsNavigator.tsx        # Stack routing for Preferences (Theme, Language, Sync)
│   │   └── linking.ts                   # Universal deep linking URI scheme mapping (amrutam://)
│   │
│   └── providers/                       # Global React Contexts & Background Event Bridges
│       ├── AppProviders.tsx             # Root wrapper composing Redux, Theme, and Safety boundaries
│       ├── ThemeProvider.tsx            # Manages Light/Dark/System theme context & dynamic styles
│       ├── NetworkBridge.tsx            # Subscribes to NetInfo to broadcast live network state to Redux
│       └── SyncBridge.tsx               # Listens for network reconnection to auto-flush offline bookings
│
├── components/                          # [Reusable Shared Design System]
│   ├── ui/                              # Base Atomic UI elements styled with theme tokens
│   │   ├── Button.tsx                   # Reusable accessible button with primary, outline & ghost variants
│   │   ├── Input.tsx                    # Theme-aware text input with search icons & error states
│   │   ├── Card.tsx                     # Elevation & surface container matching Amrutam design system
│   │   ├── Chip.tsx                     # Filter tag chip with active/inactive bubble states
│   │   └── Screen.tsx                   # Base screen container handling Safe Area Insets automatically
│   │
│   └── feedback/                        # User Communication & Asynchronous States
│       ├── SplashScreen.tsx             # Animated startup splash screen with pulsing Ayurvedic emblem
│       ├── LoadingState.tsx             # Standardized spinner indicator
│       ├── EmptyState.tsx               # Friendly empty graphic & reset action button
│       ├── ErrorState.tsx               # Graceful error display with retry callback
│       ├── Toast.tsx                    # Non-blocking global notification banner (Success/Warning/Error)
│       ├── OfflineBanner.tsx            # Sticky status header indicating offline mode
│       └── SyncStatus.tsx               # Floating pill showing background sync queue progress
│
├── core/                                # [Domain-Agnostic Core Infrastructure & Services]
│   ├── api/                             # Base RTK Query setup (`baseApi.ts`) & tag management
│   ├── errors/                          # Centralized error normalization (`AppError.ts`)
│   ├── logger/                          # Abstracted logging utility (Debug/Info/Warn/Error)
│   ├── network/                         # Reactive NetInfo listener & connection status helper
│   ├── performance/                     # Performance profiler & execution timer (`performanceMonitor`)
│   ├── storage/                         # High-performance synchronous MMKV persistence wrappers
│   ├── sync/                            # Offline booking queue manager with retry & idempotency
│   ├── i18n/                            # Localization setup with English & Hindi dictionaries
│   └── utils/                           # Pure utilities (date formatters, debouncer, cache key generator)
│
├── features/                            # [Business Domain Modules — Fully Self-Contained]
│   ├── consultations/                   # Doctor Directory & Appointment Booking Module
│   │   ├── api/                         # RTK Query endpoints for fetching doctors & booking slots
│   │   ├── components/                  # DoctorCard, DoctorFilters, SlotCard, UpcomingBookingCard
│   │   ├── hooks/                       # useDoctors, useDoctorSlots, useDoctorDetails
│   │   ├── screens/                     # DoctorListScreen, DoctorDetailsScreen, BookingConfirmationScreen
│   │   ├── types/                       # Doctor, Slot, Booking TypeScript data models
│   │   └── utils/                       # Slot validation, expiration check & conflict detection rules
│   │
│   ├── shop/                            # E-Commerce & Ayurvedic Catalog Module
│   │   ├── api/                         # RTK Query endpoints for fetching products & formulations
│   │   ├── components/                  # ProductCard, ProductFilters, WishlistButton, CartItemRow
│   │   ├── hooks/                       # useProducts, useCartHydration, useWishlistPersistence
│   │   ├── screens/                     # ProductListScreen, ProductDetailsScreen, CartScreen, CheckoutSummary
│   │   ├── types/                       # Product, Category, Cart, Wishlist schemas
│   │   └── utils/                       # Subtotal computation, shipping rules & product filters
│   │
│   ├── health-records/                  # Medical History & Record Management Module
│   │   ├── api/                         # RTK Query endpoints for medical records
│   │   ├── components/                  # RecordCard, RecordFilters, RecordTagFilter, AttachmentPreview
│   │   ├── hooks/                       # useHealthRecords, useHealthRecordDetails
│   │   ├── screens/                     # HealthRecordsScreen, HealthRecordDetailsScreen
│   │   ├── types/                       # LabReport, Prescription, Vaccination, Allergy models
│   │   └── utils/                       # groupRecordsByMonthYear chronological timeline utility
│   │
│   └── settings/                        # User Preferences Module
│       └── SettingsScreen.tsx           # UI to switch Dark/Light theme, English/Hindi language & view sync stats
│
├── mocks/                               # [In-Memory Mock Database & Network Simulator]
│   ├── config/                          # Latency controls (50-150ms) and failure mode configurations
│   ├── db/                              # In-memory database holding 5k doctors, 20k products, 10k records
│   ├── generators/                      # Seeded deterministic generators creating realistic datasets
│   ├── repositories/                    # Data access layer handling filtering, search, and pagination
│   ├── transport/                       # Network transport simulator imitating real HTTP requests
│   └── seed.ts                          # Seed constants ensuring reproducible data generation
│
├── store/                               # [Global Redux Toolkit State Management]
│   ├── selectors/                       # Memoized Reselect selectors (Cart item counts, Wishlist IDs)
│   ├── slices/                          # State slices (cart, wishlist, offlineQueue, theme, language, network)
│   ├── hooks.ts                         # Type-safe useAppDispatch and useAppSelector hooks
│   ├── rootReducer.ts                   # Combines all slices into a single unified root reducer
│   └── store.ts                         # Configures the Redux store with RTK Query middleware
│
├── theme/                               # [Design Tokens & Theme Definitions]
│   ├── colors.ts                        # Light and Dark theme Ayurvedic color palettes
│   ├── spacing.ts                       # Consistent layout spacing scales (xs, sm, md, lg, xl)
│   ├── typography.ts                    # Font scale and weight definitions
│   ├── theme.ts                         # Theme construction and contract enforcement
│   └── theme.types.ts                   # Theme TypeScript interfaces
│
└── types/                               # [Global TypeScript Definitions]
    └── common.ts                        # Shared ID, ISODateString, and pagination types
```

---

# Architecture

The application follows a feature-oriented architecture with shared core infrastructure.

## High-Level Data Flow

```text
Screens
   ↓
Feature Hooks
   ↓
RTK Query / Redux
   ↓
API / Repository Layer
   ↓
Mock Backend
```

Shared infrastructure sits below the feature layer:

```text
Features
   ↓
Core
├── API
├── Storage
├── Network
├── Errors
├── Logger
├── Sync
├── Performance
└── i18n
```

This keeps feature-specific behavior separate from reusable infrastructure.

---

# State Management Strategy

The project intentionally separates **server state** from **client state**.

## RTK Query

Used for server/cache-oriented data:

* Doctors
* Slots
* Products
* Health Records
* Product details
* Record details
* Upcoming consultations

Example:

```text
RTK Query
   ↓
API data
   ↓
Cache
   ↓
UI
```

## Redux Toolkit

Used for local application state:

* Cart
* Wishlist
* Theme
* Language
* Network state
* Offline booking queue
* Toast state

This avoids putting all application data into one global Redux structure.

---

# Offline-First Strategy

Offline behavior is implemented in layers.

## Cart

```text
Cart
 ↓
Redux
 ↓
MMKV
```

Cart operations do not require an active internet connection.

## Wishlist

```text
Wishlist
 ↓
Redux
 ↓
MMKV
```

## API Cache

Previously retrieved API responses can be persisted locally and used as fallback data when the network request fails.

## Offline Booking Queue

```text
User offline
     ↓
Create booking request
     ↓
Persistent queue
     ↓
Pending status
     ↓
Internet reconnects
     ↓
Sync manager
     ↓
Booking API
```

Booking requests carry an idempotency key to reduce duplicate submission risk.

---

# Network Handling

Network connectivity is centralized through a network abstraction.

```text
NetInfo
   ↓
Network Service
   ↓
Redux Network State
   ↓
UI / Sync Manager
```

The application distinguishes between:

* Connection state
* Internet reachability
* Sync state

This prevents business logic from directly depending on low-level network APIs.

---

# Reliability Strategy

The mock backend supports controlled failure simulation.

Supported scenarios:

```text
Slow network
API timeout
Random failure
Empty response
Partial response
Invalid response
Session expiration
Booking conflicts
Expired slots
Duplicate booking attempts
```

The mock transport can introduce latency so loading states and slow-network behavior can be tested realistically.

---

# Error Handling

Errors are normalized through a central `AppError` model.

```text
Unknown Error
     ↓
Error Mapper
     ↓
AppError
     ↓
Feature/UI
```

The application also includes a top-level Error Boundary.

The Error Boundary is responsible for unexpected rendering failures, while API/business errors are handled at the feature/API level.

---

# Logging

Direct `console.log()` usage is avoided in feature code.

A central logger supports:

```text
debug
info
warn
error
```

Example:

```ts
logger.info('Products loaded', {
  count: products.length,
});
```

The logger is intentionally vendor-independent so a production logging/crash platform can be connected later.

---

# Performance & Scalability

The assignment requires support for:

```text
5,000 doctors
20,000 products
10,000 health records
```

The application uses several techniques to support this scale.

## Virtualized Rendering

Large lists use:

* FlashList
* SectionList

The UI does not attempt to render thousands of rows simultaneously.

## Pagination

Large datasets are retrieved in pages.

Example:

```text
20,000 products
      ↓
30/page
```

and:

```text
10,000 records
      ↓
50/page
```

## Memoization

Reusable cards are memoized:

```ts
memo(Component)
```

Stable callbacks use:

```ts
useCallback()
```

Derived values use:

```ts
useMemo()
```

## Lightweight Redux State

Cart and wishlist store IDs and lightweight metadata rather than full product objects.

Example:

```ts
{
  productId: 'product-00001',
  quantity: 2
}
```

This avoids unnecessary state duplication.

---

# Large Dataset Generation

The mock backend generates:

```text
5,000 Doctors
20,000 Products
10,000 Health Records
```

Data generation is deterministic.

A fixed seed is used so repeated executions produce predictable data.

This improves:

* Testing
* Debugging
* Performance comparison
* Reproducibility

---

# Mock Backend Architecture

The application does not couple screens directly to generated data.

```text
Screen
  ↓
RTK Query
  ↓
Repository
  ↓
Mock Transport
  ↓
Mock Database
```

This makes replacing the mock backend with a real backend straightforward.

---

# Mock Repository Responsibilities

Repositories handle:

* Searching
* Filtering
* Sorting
* Pagination
* Entity lookup
* Booking validation
* Booking conflicts
* Cancellation rules

The UI should not directly manipulate the mock database.

---

# Consultation Business Rules

A consultation slot is bookable only when:

```text
status = available
AND
slot has not expired
```

Booking is rejected when:

```text
Slot is booked
Slot is blocked
Slot is expired
Doctor does not exist
Slot does not exist
Booking conflicts
Duplicate booking is detected
```

Cancellation is rejected for:

```text
Missing booking
Already cancelled booking
Non-confirmed booking
Past consultation
```

---

# Shop Business Rules

Cart behavior:

```text
Add existing product
→ Increase quantity

Decrease quantity from 1
→ Remove item

Quantity cannot exceed known stock

Unknown product
→ Safe failure
```

Checkout subtotal is calculated from:

```text
Product Price × Cart Quantity
```

---

# Health Records

Supported types:

```text
lab_report
prescription
consultation
vaccination
allergy
```

Timeline grouping is handled by a pure utility:

```text
Records
  ↓
Sort by date
  ↓
Group by year/month
  ↓
Timeline sections
```

This logic is isolated from UI rendering and is unit tested.

---

# Theme Support

Three modes are supported:

```text
System
Light
Dark
```

Theme state is persisted locally.

Theme-aware shared components include:

* Button
* Input
* Card
* Chip
* Screen
* Loading state
* Empty state
* Error state
* Toast
* Navigation

The application preserves system font scaling and uses accessibility semantics for interactive controls.

---

# Localization

Two languages are supported:

```text
English
Hindi
```

Translation resources are separated from UI components.

Language selection is persisted locally.

Architecture:

```text
UI
 ↓
Translation key
 ↓
i18next
 ↓
Language resource
```

---

# Deep Linking

The application defines routes for:

```text
amrutam://consultation
amrutam://consultation/doctor/:doctorId

amrutam://shop
amrutam://shop/product/:productId

amrutam://health-records
amrutam://health-records/:recordId
```

Routes use entity IDs instead of passing complete domain objects through navigation.

This keeps navigation state small and allows screens to resolve current data through RTK Query.

---

# Performance Monitoring

A vendor-independent performance abstraction is included.

Example:

```ts
const timer =
  performanceMonitor.start(
    'generate-products',
    {count: 20000},
  );

// operation

timer.end();
```

This can later be connected to a dedicated monitoring provider without changing feature code.

---

# Accessibility

The application uses accessibility semantics for interactive controls.

Examples:

```text
Buttons
Radio selections
Search inputs
Toast alerts
Filter controls
Wishlist controls
Quantity controls
```

The implementation avoids disabling font scaling unnecessarily.

---

# Testing Strategy

Testing focuses on business-critical behavior instead of large numbers of snapshot tests.

## Business Logic

Covered areas include:

* Booking rules
* Slot expiration
* Booking conflict
* Duplicate booking
* Cancellation rules
* Cart calculations
* Cart quantity behavior
* Wishlist duplicate protection
* Health record grouping
* Product filtering

## Utilities

Tests include:

* Date/grouping utilities
* Cart calculations
* Cache key generation
* Debounce behavior
* Large dataset generation

## E2E

The primary E2E flow is:

```text
Shop
 ↓
Product
 ↓
Add to Cart
 ↓
Cart
 ↓
Checkout
```

Stable test IDs are used for important UI elements.

---

# Development Commands

Install dependencies:

```bash
npm install
```

Start Metro:

```bash
npm start
```

Run Android:

```bash
npm run android
```

Type checking:

```bash
npx tsc --noEmit
```

Lint:

```bash
npm run lint
```

Tests:

```bash
npm test -- --runInBand
```

Coverage:

```bash
npm test -- --runInBand --coverage
```

---

# Environment

Android development requires:

* Node.js 22+
* Java 17
* Android SDK
* Android Build Tools
* ADB
* Android device or emulator

The project uses Hermes and React Native's New Architecture.

Environment-specific configuration should remain outside feature logic.

---

# Architectural Decisions

## Why Redux Toolkit?

Redux Toolkit provides predictable state updates, strong TypeScript support, and a standard approach for shared application state.

## Why RTK Query?

RTK Query is used for server-state caching, request lifecycle management, cache invalidation, and API data synchronization.

## Why MMKV?

MMKV provides fast local persistence and is suitable for frequently accessed lightweight application data such as cart, wishlist, theme, and offline queues.

## Why Feature-Based Architecture?

Feature ownership becomes clear:

```text
consultations/
shop/
health-records/
```

A developer joining the project can work inside one feature without navigating unrelated modules.

## Why Repository Abstraction?

The assignment allows mock APIs. Repositories provide a boundary so the UI does not depend directly on generated mock data.

This makes replacing the mock backend with a real API easier.

---

# Trade-offs

## Mock Backend

A real backend is not required by the assignment, so an in-memory deterministic mock backend was selected.

Trade-off:

* Faster development
* Easy failure simulation
* No actual server infrastructure
* Not suitable for true multi-user concurrency

A production backend should enforce booking uniqueness at the database/transaction level.

## Local Cache

The implementation prioritizes usable cached data when the network is unavailable.

Trade-off:

* Data may become stale
* Cache invalidation is simpler than a fully distributed cache system

## PDF Attachments

The assignment requires PDF thumbnails/previews. The current implementation represents PDFs with a lightweight PDF card instead of embedding a full native PDF viewer.

Trade-off:

* Less native dependency complexity
* No full PDF reader functionality

## Offline Sync

Offline booking synchronization is intentionally queue-based rather than implementing a full distributed conflict-resolution framework.

Production systems may additionally require:

* Exponential backoff
* Server-generated operation IDs
* Background execution
* Persistent sync history
* More advanced conflict resolution

---

# Production Improvements

With more development time, the following areas could be expanded:

* Real backend integration
* Authentication and token refresh
* Secure credential storage
* Server-side transactional slot reservation
* Advanced cache indexing
* Exponential backoff for synchronization
* Background sync
* Push notifications
* Real PDF viewer
* Image caching/CDN strategy
* Crash reporting provider
* Remote configuration
* Feature flag service
* Analytics
* More extensive E2E coverage
* CI/CD pipeline
* Automated performance regression testing

---

# Selected Bonus Features

The assignment asks for any three bonus features.

Implemented:

### 1. Localization

```text
English
Hindi
```

### 2. Deep Linking

Supports application routes for:

```text
Consultation
Shop
Health Records
```

### 3. Performance Monitoring

Vendor-independent performance measurement abstraction.

---

# Evaluation Mapping

| Evaluation Area          | Implementation                                                    |
| ------------------------ | ----------------------------------------------------------------- |
| Application Architecture | Feature-based architecture, core abstractions, typed navigation   |
| Code Quality             | TypeScript, reusable components, centralized utilities            |
| Performance              | FlashList, SectionList, pagination, memoization, stable callbacks |
| Offline & Error Handling | MMKV, API cache, booking queue, network detection, Error Boundary |
| State Management         | Redux Toolkit + RTK Query                                         |
| Testing                  | Jest business logic, utilities, hooks, E2E flow                   |
| Documentation            | Architecture, trade-offs, offline strategy, folder structure      |
| UX / Accessibility       | Loading, empty/error states, accessibility roles, theme support   |

---

# Current Project Status

```text
Consultation
├── Doctor Listing         ✅
├── Search                 ✅
├── Filters                ✅
├── Details                ✅
├── Slots                  ✅
├── Booking                ✅
├── Conflict Handling      ✅
├── Upcoming               ✅
└── Cancellation           ✅

Shop
├── Product Listing        ✅
├── Infinite Scroll        ✅
├── Search                 ✅
├── Filters                ✅
├── Sorting                ✅
├── Product Details        ✅
├── Wishlist               ✅
├── Cart                   ✅
├── Offline Persistence    ✅
└── Checkout Summary       ✅

Health Records
├── Timeline               ✅
├── Month/Year Grouping    ✅
├── Search                 ✅
├── Filters                ✅
├── Tags                   ✅
├── Details                ✅
└── Attachments            ✅

Platform
├── Error Boundary         ✅
├── Logger                 ✅
├── Global Toast           ✅
├── Network Detection      ✅
├── Offline Queue          ✅
├── Automatic Sync         ✅
├── Theme Support          ✅
├── Light / Dark / System  ✅
├── Localization           ✅
├── Deep Linking           ✅
├── Performance Monitor    ✅
└── Accessibility          ✅
```

---

# Final Notes

The project is intentionally structured so that feature development, infrastructure, and domain logic remain separated.

The primary engineering principle is:

```text
Keep UI simple.
Keep business rules testable.
Keep infrastructure reusable.
Keep server state separate from client state.
Keep large datasets virtualized and paginated.
Keep offline behavior explicit and recoverable.
```

This architecture is designed to make the application easier to scale and easier for another developer to understand and extend.
