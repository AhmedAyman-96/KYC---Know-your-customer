# JSON Schema Guide for Dynamic KYC Form

This guide explains how to create valid JSON schemas for the Dynamic KYC Form application. The form renders dynamically based on the JSON configuration you provide.

## Quick Start

1. **Download Sample Schemas**: Use the "Download Sample Schemas" feature in the Schema Manager
2. **Upload Your Schema**: Click "Load Schema" and select your JSON file
3. **Validate**: The system will automatically validate your schema and show any errors
4. **Test**: Fill out the form to see your schema in action

## Basic Schema Structure

A schema is an array of question objects. Each question defines a form field:

```json
[
  {
    "id": "field_identifier",
    "label": "Display Label",
    "type": "input_type",
    "required": true,
    "placeholder": "Optional placeholder text"
  }
]
```

## Supported Input Types

### 1. Text Input

```json
{
  "id": "full_name",
  "label": "Full Name",
  "type": "text",
  "required": true,
  "placeholder": "Enter your full name",
  "maxLength": 100,
  "minLength": 2
}
```

**Properties:**

- `maxLength` (optional): Maximum characters allowed
- `minLength` (optional): Minimum characters required

### 2. Textarea

```json
{
  "id": "bio",
  "label": "Biography",
  "type": "textarea",
  "required": false,
  "placeholder": "Tell us about yourself",
  "rows": 4,
  "maxLength": 500
}
```

**Properties:**

- `rows` (optional): Number of visible rows (default: 3)
- `maxLength` (optional): Maximum characters allowed

### 3. Radio Buttons

```json
{
  "id": "gender",
  "label": "Gender",
  "type": "radio_buttons",
  "required": true,
  "options": ["Male", "Female", "Other", "Prefer not to say"]
}
```

**Properties:**

- `options` (required): Array of string options

### 4. Multi-Choice (Checkboxes)

```json
{
  "id": "hobbies",
  "label": "Hobbies",
  "type": "multi_choice",
  "required": true,
  "options": ["Reading", "Gaming", "Sports", "Music", "Travel"],
  "min": 1,
  "max": 3
}
```

**Properties:**

- `options` (required): Array of string options
- `min` (optional): Minimum selections required
- `max` (optional): Maximum selections allowed

### 5. Dropdown

```json
{
  "id": "country",
  "label": "Country",
  "type": "drop_down",
  "required": true,
  "options": ["USA", "Canada", "UK", "Australia", "Germany"],
  "placeholder": "Select your country"
}
```

**Properties:**

- `options` (required): Array of string options
- `placeholder` (optional): Default text shown

### 6. Date Picker

```json
{
  "id": "birth_date",
  "label": "Date of Birth",
  "type": "date_picker",
  "required": true,
  "minDate": "1900-01-01",
  "maxDate": "today"
}
```

**Properties:**

- `minDate` (optional): Earliest allowed date (YYYY-MM-DD format)
- `maxDate` (optional): Latest allowed date (YYYY-MM-DD format or "today")

### 7. File Upload

```json
{
  "id": "documents",
  "label": "Identity Documents",
  "type": "file_upload",
  "required": true,
  "accept": ".pdf,.jpg,.jpeg,.png",
  "maxSize": 10,
  "multiple": true
}
```

**Properties:**

- `accept` (optional): Allowed file extensions (comma-separated)
- `maxSize` (optional): Maximum file size in MB
- `multiple` (optional): Allow multiple files (default: false)

### 8. Number Input

```json
{
  "id": "age",
  "label": "Age",
  "type": "number",
  "required": true,
  "min": 18,
  "max": 120,
  "placeholder": "Enter your age"
}
```

**Properties:**

- `min` (optional): Minimum value allowed
- `max` (optional): Maximum value allowed

## Complete Example Schema

```json
[
  {
    "id": "full_name",
    "label": "Full Name",
    "type": "text",
    "required": true,
    "placeholder": "Enter your full name",
    "maxLength": 100,
    "minLength": 2
  },
  {
    "id": "email",
    "label": "Email Address",
    "type": "text",
    "required": true,
    "placeholder": "Enter your email address"
  },
  {
    "id": "phone",
    "label": "Phone Number",
    "type": "text",
    "required": false,
    "placeholder": "Enter your phone number"
  },
  {
    "id": "bio",
    "label": "Biography",
    "type": "textarea",
    "required": false,
    "placeholder": "Tell us about yourself",
    "rows": 4,
    "maxLength": 500
  },
  {
    "id": "gender",
    "label": "Gender",
    "type": "radio_buttons",
    "required": true,
    "options": ["Male", "Female", "Other", "Prefer not to say"]
  },
  {
    "id": "interests",
    "label": "Areas of Interest",
    "type": "multi_choice",
    "required": true,
    "options": ["Technology", "Finance", "Healthcare", "Education", "Retail"],
    "min": 1,
    "max": 3
  },
  {
    "id": "country",
    "label": "Country of Residence",
    "type": "drop_down",
    "required": true,
    "options": [
      "USA",
      "Canada",
      "UK",
      "Australia",
      "Germany",
      "France",
      "Japan"
    ],
    "placeholder": "Select your country"
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
    "id": "age",
    "label": "Age",
    "type": "number",
    "required": false,
    "min": 18,
    "max": 120,
    "placeholder": "Enter your age"
  },
  {
    "id": "profile_picture",
    "label": "Profile Picture",
    "type": "file_upload",
    "required": false,
    "accept": ".jpg,.jpeg,.png",
    "maxSize": 5,
    "multiple": false
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

## Validation Rules

### Required Properties

- `id`: Unique identifier (string)
- `label`: Display text (string)
- `type`: Input type (must be one of supported types)
- `required`: Boolean indicating if field is mandatory

### Type-Specific Validation

- **Text/Textarea**: Email fields are automatically detected and validated
- **Multi-Choice**: `min` must be ≤ `max` if both are specified
- **Date Picker**: Dates must be in YYYY-MM-DD format or "today"
- **File Upload**: File size is in MB, extensions start with "."
- **Number**: `min` must be ≤ `max` if both are specified

### Common Validation Errors

- Missing required properties (`id`, `label`, `type`, `required`)
- Invalid input type (not in supported list)
- Invalid date format (not YYYY-MM-DD or "today")
- Multi-choice: `min` > `max`
- Number: `min` > `max`
- Missing `options` array for choice-based inputs
- Empty `options` array
- Invalid file size type (must be number)

## Tips for Creating Schemas

1. **Use Descriptive IDs**: Make IDs meaningful and unique
2. **Clear Labels**: Write user-friendly labels
3. **Logical Order**: Arrange fields in a logical flow
4. **Appropriate Validation**: Set reasonable limits and requirements
5. **Test Thoroughly**: Validate your schema before using in production

## Testing Your Schema

1. Create your JSON file with the schema structure
2. Use the Schema Manager to load and validate
3. Fill out the generated form to test user experience
4. Check that validation works as expected
5. Test edge cases and error scenarios

## Sample Schemas Available

The application includes several sample schemas you can download and try:

- **Default Schema**: Basic form with common fields
- **Basic KYC**: Simple form with essential fields
- **Investment KYC**: Comprehensive investment-related form
- **Fintech KYC**: Financial technology focused form
- **Invalid Schema Test**: Demonstrates validation error handling

Download these from the Schema Manager to see different schema patterns and structures.
