# Dynamic KYC Form

A modern, dynamic KYC (Know Your Customer) form built with React 18, TypeScript, and real-time validation. Features multi-step navigation, file uploads, date pickers, and JSON schema management.

## Key Features

- **Dynamic Form Rendering** - Generate forms from JSON schemas
- **Multi-Step Navigation** - Configurable step-by-step progression
- **Real-time Validation** - Zod-based validation with custom error messages
- **File Upload** - Drag-and-drop with preview and validation
- **Date Picker** - Native HTML5 with range validation
- **Form Persistence** - Automatic data saving with localStorage
- **Dark/Light Mode** - Theme switching with persistent preferences
- **JSON Schema Management** - Load schemas from files with validation
- **Sample Schema Downloads** - Download pre-built schemas to try out
- **Schema Validation** - Comprehensive validation with detailed error messages

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **pnpm** (Package manager)
- **React Hook Form** + **Zod** (Form management & validation)
- **Zustand** (State management with persistence)
- **Tailwind CSS** (Styling)
- **Vitest** + **Testing Library** (Testing)

## Quick Start

### Prerequisites

- **Node.js 18+**
- **pnpm** (recommended package manager)

### Installation

```bash
# Install pnpm globally (if not installed)
npm install -g pnpm

# Clone and setup
git clone <repository-url>
cd kyc-form

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production (TypeScript + Vite)
pnpm run preview      # Preview production build

# Testing
pnpm run test:run     # Run tests once

# Code Quality
pnpm run lint         # Run ESLint
```

## Project Evolution & Technical Challenges

### **Phase 1: Static Validation (Initial)**

- Used predefined Zod schemas for each question type
- Limited flexibility - required code changes for new field types
- Static validation rules defined at compile time

### **Phase 2: Dynamic Validation (Current)**

- **Dynamic Schema Generation**: Creates Zod schemas at runtime based on JSON configuration
- **Maximum Flexibility**: Supports any JSON schema structure without code changes
- **Runtime Validation**: Generates validation rules dynamically from form schema

### **Key Technical Challenges Solved**

#### 1. **Dynamic Validation System** (`src/utils/validation.ts`)

**Challenge**: How to validate form data when the schema structure is unknown at compile time?

**Solution**:

- Created `createValidationSchema()` function that generates Zod schemas dynamically
- Supports all input types with type-specific validation rules
- Auto-detects email fields and applies appropriate validation
- Handles complex validation scenarios (file uploads, date ranges, multi-choice limits)

```typescript
// Example: Dynamic schema generation
const validationSchema = createValidationSchema(formSchema);
const { control } = useForm({
  resolver: zodResolver(validationSchema),
  defaultValues: getDefaultFormData(formSchema),
});
```

#### 2. **Schema Loading & Validation** (`src/services/schemaLoader.ts`)

**Challenge**: How to safely load and validate external JSON schemas?

**Solution**:

- Comprehensive schema validation with detailed error messages
- Type checking for all question properties
- Support for complex validation rules (date formats, file types, option arrays)
- Graceful error handling with user-friendly feedback

```typescript
// Example: Schema validation
const result = await SchemaLoader.loadFromFile(file);
if (result.success) {
  // Schema is valid and ready to use
  onSchemaChange(result.schema);
} else {
  // Show validation errors
  setError(result.error);
}
```

#### 3. **Form Data Persistence**

**Challenge**: How to maintain form state across sessions and schema changes?

**Solution**:

- Zustand store with persistence middleware
- Automatic data saving to localStorage
- Smart data clearing when schema changes
- Separate stores for UI state and form data

## 📝 JSON Schema Management

### Using JSON Schemas

The form supports dynamic configuration through JSON schemas. You can:

1. **Download Sample Schemas** - Use the Schema Manager to download pre-built schemas
2. **Upload Your Schema** - Load custom JSON schemas from your local files
3. **Validate Automatically** - The system validates schemas and shows detailed errors
4. **Test Immediately** - See your schema in action with the live form

### Quick Start with JSON

1. Open the **Schema Manager** (always visible at the top)
2. Click **"Download Sample Schemas"** to get pre-built examples
3. Choose a schema to download (e.g., "Basic KYC", "Investment KYC")
4. Use **"Load Schema"** to upload and test the downloaded file
5. The form will automatically update with the new configuration

### Sample Schemas Available

- **Default Schema** - Basic form with common fields
- **Basic KYC** - Simple form with essential fields
- **Investment KYC** - Comprehensive investment-related form
- **Fintech KYC** - Financial technology focused form
- **Invalid Schema Test** - Demonstrates validation error handling

### JSON Schema Structure

```json
[
  {
    "id": "full_name",
    "label": "Full Name",
    "type": "text",
    "required": true,
    "maxLength": 100,
    "placeholder": "Enter your full name"
  },
  {
    "id": "email",
    "label": "Email Address",
    "type": "text",
    "required": true,
    "placeholder": "Enter your email address"
  },
  {
    "id": "birth_date",
    "label": "Date of Birth",
    "type": "date_picker",
    "required": true,
    "minDate": "1900-01-01",
    "maxDate": "today"
  },
  {
    "id": "documents",
    "label": "Identity Documents",
    "type": "file_upload",
    "required": true,
    "accept": ".pdf,.jpg,.jpeg,.png",
    "maxSize": 10,
    "multiple": true
  }
]
```

For detailed schema documentation, see [JSON_SCHEMA_GUIDE.md](./JSON_SCHEMA_GUIDE.md).

## Supported Input Types

- **Text** - Single line with email validation and min/max length
- **Textarea** - Multi-line with character limits and configurable rows
- **Radio Buttons** - Single selection from predefined options
- **Multi-Choice** - Multiple selections with min/max limits
- **Dropdown** - Select from predefined options with placeholder
- **File Upload** - Drag-and-drop with type/size validation and preview
- **Date Picker** - Date selection with range validation (YYYY-MM-DD or "today")
- **Number** - Numeric input with min/max value constraints

## Project Structure

```
kyc-form/
├── src/
│   ├── components/
│   │   ├── icons/              # Reusable SVG icon components
│   │   │   ├── index.ts        # Icon barrel exports
│   │   │   ├── CalendarIcon.tsx
│   │   │   ├── CheckIcon.tsx
│   │   │   ├── CloseIcon.tsx
│   │   │   ├── DocumentIcon.tsx
│   │   │   ├── ErrorIcon.tsx
│   │   │   ├── LoadingIcon.tsx
│   │   │   ├── MoonIcon.tsx
│   │   │   ├── SunIcon.tsx
│   │   │   └── UploadIcon.tsx
│   │   ├── inputs/             # Individual input components
│   │   │   ├── TextInput.tsx
│   │   │   ├── TextAreaInput.tsx
│   │   │   ├── RadioButtonsInput.tsx
│   │   │   ├── MultiChoiceInput.tsx
│   │   │   ├── DropDownInput.tsx
│   │   │   ├── FileUploadInput.tsx
│   │   │   └── DatePickerInput.tsx
│   │   ├── FormField.tsx       # Dynamic field renderer
│   │   ├── KYCForm.tsx         # Main form container
│   │   ├── MultiStepForm.tsx   # Multi-step navigation
│   │   ├── FormSettings.tsx    # Form configuration
│   │   ├── SchemaManager.tsx   # JSON schema management
│   │   ├── ThemeToggle.tsx     # Dark/light mode toggle
│   │   ├── ErrorBanner.tsx     # Error display component
│   │   ├── SuccessPage.tsx     # Form submission success
│   │   └── ConfirmationModal.tsx # Reusable modal
│   ├── store/
│   │   ├── useAppStore.ts      # Global UI state
│   │   └── useFormStore.ts     # Form data persistence
│   ├── types/
│   │   └── form.ts            # TypeScript definitions
│   ├── utils/
│   │   └── validation.ts      # Zod schema generation
│   ├── services/
│   │   ├── mockApi.ts         # Mock API service
│   │   └── schemaLoader.ts    # JSON schema loading/validation
│   ├── data/
│   │   └── sampleSchema.ts    # Sample form configuration
│   ├── test/                  # Test files
│   │   ├── setup.ts           # Test environment setup
│   │   ├── helpers/
│   │   │   ├── test-utils.tsx # Custom test utilities
│   │   │   └── mock-data.ts   # Test data and schemas
│   │   ├── components/        # Component tests
│   │   │   └── FormField.test.tsx
│   │   └── integration/       # Integration tests
│   │       ├── App.integration.test.tsx
│   │       └── KYCForm.integration.test.tsx
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
├── public/
│   └── schemas/               # Sample JSON schemas
│       ├── default-schema.json
│       ├── basic-kyc.json
│       ├── investment-kyc.json
│       ├── fintech-kyc.json
│       └── invalid-schema-test.json
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tailwind.config.js
├── README.md
└── JSON_SCHEMA_GUIDE.md
```

## Testing

```bash
# Run all tests
pnpm run test:run

# Run tests in watch mode
pnpm run test

# Run tests with coverage
pnpm run test:coverage
```
