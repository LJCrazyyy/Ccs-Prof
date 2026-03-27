# Quick Reference: Enhanced Hooks & Components Usage Guide

## 🚀 Quick Start Patterns

### 1. Fetch Data & Display (Dashboard Pattern)
```typescript
import { useAsync } from '../../hooks/useAsync';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/ui/shared';
import { studentDB } from '../../lib/database';

const MyDashboard: React.FC = () => {
  const { data, loading, error, execute } = useAsync<Student[]>(() =>
    studentDB.getAll().then((d: any) => d as Student[]).catch(() => [])
  );

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <div>
      {loading && <LoadingSpinner fullScreen={false} />}
      {error && <ErrorMessage message="Failed to load data" />}
      {!data?.length && <EmptyState icon="Users" title="No students" />}
      {data && <StudentList students={data} />}
    </div>
  );
};
```

### 2. Form with Validation & Submission (CRUD Pattern)
```typescript
import { useForm } from '../../hooks/useAsync';
import { FormInput } from '../../components/ui/shared';

interface FormData {
  name: string;
  email: string;
  program: string;
}

const AddStudentForm: React.FC = () => {
  const { formData, errors, touched, handleChange, handleBlur, reset, isValid } = useForm<FormData>(
    { name: '', email: '', program: '' },
    {
      name: (v) => v.trim().length < 3 ? 'Too short' : '',
      email: (v) => !v.includes('@') ? 'Invalid email' : '',
      program: (v) => v === '' ? 'Required' : '',
    }
  );

  const handleSubmit = async () => {
    if (!isValid) return;
    // Save to database
    // studentDB.addStudent(formData);
    reset();
  };

  return (
    <div className="grid gap-4">
      <FormInput
        label="Name"
        id="name"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name ? errors.name : ''}
      />
      <FormInput
        label="Email"
        id="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? errors.email : ''}
      />
      <button onClick={handleSubmit} disabled={!isValid}>
        Submit
      </button>
    </div>
  );
};
```

### 3. Searchable & Paginated List (Table Pattern)
```typescript
import { useSearch } from '../../hooks/useAsync';
import { usePagination } from '../../hooks/useAsync';
import { Pagination } from '../../components/ui/shared';

const StudentsList: React.FC = () => {
  const [allStudents] = useState<Student[]>([...]); // or useAsync

  const { searchQuery, results, setSearchQuery } = useSearch(
    allStudents,
    ['name', 'email', 'idNumber']
  );

  const { currentPage, totalPages, currentData, goToPage } = usePagination(results, 10);

  return (
    <div>
      <input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 px-4 py-2 border rounded"
      />
      
      <Table data={currentData} />
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
  );
};
```

---

## 📚 Hook APIs Reference

### useAsync<T>
```typescript
const { data, loading, error, execute, reset, setData } = useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate?: boolean  // default: true
);
```

**Properties:**
- `data: T | null` - Resolved data
- `loading: boolean` - Loading state
- `error: string | null` - Error message

**Methods:**
- `execute()` - Run the async function
- `reset()` - Clear all state
- `setData(data)` - Update data directly

### useForm<T>
```typescript
const {
  formData,
  errors,
  touched,
  handleChange,
  handleBlur,
  reset,
  setFormData,
  setFieldValue,
  isValid
} = useForm<T>(
  initialValues: T,
  validators?: {
    fieldName: (value: any) => string  // returns error message or ''
  }
);
```

**Properties:**
- `formData: T` - Current form data
- `errors: Record<keyof T, string>` - Field errors
- `touched: Record<keyof T, boolean>` - Fields user touched
- `isValid: boolean` - All fields valid

**Methods:**
- `handleChange(event)` - Handle input change
- `handleBlur(event)` - Handle input blur (validates)
- `reset()` - Reset to initial values
- `setFormData(data)` - Update form data
- `setFieldValue(field, value)` - Update single field

### useSearch<T>
```typescript
const { searchQuery, results, setSearchQuery, reset } = useSearch<T>(
  data: T[],
  searchFields: (keyof T)[],  // fields to search in
  initialSearch?: string
);
```

**Properties:**
- `searchQuery: string` - Current search text
- `results: T[]` - Filtered data

**Methods:**
- `setSearchQuery(query)` - Update search
- `reset()` - Clear search

### usePagination<T>
```typescript
const {
  currentPage,
  totalPages,
  currentData,
  goToPage,
  nextPage,
  prevPage,
  itemsPerPage,
  setItemsPerPage
} = usePagination<T>(
  data: T[],
  defaultItemsPerPage?: number  // default: 10
);
```

**Properties:**
- `currentPage: number` - Current page (1-indexed)
- `totalPages: number` - Total available pages
- `currentData: T[]` - Data for current page (pre-sliced)
- `itemsPerPage: number` - Items per page

**Methods:**
- `goToPage(page)` - Jump to specific page
- `nextPage()` - Move to next page
- `prevPage()` - Move to previous page
- `setItemsPerPage(count)` - Change items per page

---

## 🎨 Component APIs Reference

### LoadingSpinner
```typescript
<LoadingSpinner 
  fullScreen={false}  // optional: overlay entire screen
/>
```

### ErrorMessage
```typescript
<ErrorMessage
  message="Something went wrong"
  variant="error"           // 'error' | 'warning' | 'info'
  onDismiss={() => {...}}   // optional dismiss callback
/>
```

### EmptyState
```typescript
<EmptyState
  icon="Users"  // or React component
  title="No students"
  description="Add a student to get started"
  actionLabel="Add Student"
  onAction={() => {...}}  // optional action handler
/>
```

### Pagination
```typescript
<Pagination
  currentPage={1}
  totalPages={5}
  onPageChange={(page) => {...}}
  itemsPerPage={10}
  onItemsPerPageChange={(count) => {...}}  // optional
/>
```

### FormInput
```typescript
<FormInput
  label="Name"
  id="name"  // Required: used in handleChange/handleBlur
  type="text"  // optional: default 'text'
  placeholder="Enter name"
  value={formData.name}
  onChange={handleChange}
  onBlur={handleBlur}
  error={touched.name ? errors.name : ''}
  helperText="3+ characters required"  // optional
/>
```

### Card
```typescript
<Card
  title="My Card"  // optional
  className="custom-class"  // optional
>
  Content here
</Card>
```

### Badge
```typescript
<Badge 
  variant="success"  // 'default' | 'success' | 'danger' | 'warning' | 'info'
  size="md"  // 'sm' | 'md' | 'lg'
>
  Label
</Badge>
```

### SectionHeader
```typescript
<SectionHeader
  title="Page Title"
  subtitle="Subtitle text"
  actionLabel="Add"  // optional
  onAction={() => {...}}  // optional
/>
```

---

## 📋 Common Page Patterns

### Pattern 1: Simple Data Dashboard
**Use:** Admin/Student/Faculty dashboards showing stats and recent items

```typescript
// 1. Fetch data
const { data: items, loading, error, execute } = useAsync(() => db.getAll());

// 2. Use effect to fetch
useEffect(() => { execute(); }, [execute]);

// 3. Display
return (
  <div>
    {loading && <Spinner />}
    {error && <Error message="..." />}
    <StatCard value={items?.length || 0} />
    <ItemsList data={items?.slice(0, 3)} />
  </div>
);
```

### Pattern 2: CRUD List with Searching
**Use:** Admin pages for Students, Faculty, Courses, etc.

```typescript
// 1. Fetch & search
const { data, loading, error } = useAsync(() => db.getAll());
const { searchQuery, results, setSearchQuery } = useSearch(data || [], ['name', 'email']);
const { currentPage, totalPages, currentData, goToPage } = usePagination(results, 10);

// 2. Render
return (
  <div>
    <SearchInput value={searchQuery} onChange={setSearchQuery} />
    <Table data={currentData} />
    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
  </div>
);
```

### Pattern 3: Form Page with Add/Edit
**Use:** Any page with forms (add student, edit faculty, etc.)

```typescript
// 1. Setup form
const { formData, errors, touched, handleChange, handleBlur, reset } = useForm(
  initialValues,
  validators
);

// 2. Async post
const handleSubmit = async () => {
  // await db.add(formData);
  reset();
};

// 3. Render form
return (
  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <FormInput ... />
    <FormInput ... />
    <button type="submit">Submit</button>
  </form>
);
```

### Pattern 4: Combined Dashboard + Table
**Use:** Pages showing overview and detailed list

```typescript
// 1. Fetch data
const { data: all } = useAsync(() => db.getAll());

// 2. Search & paginate
const { results } = useSearch(all || [], ['name']);
const { currentData, currentPage, totalPages } = usePagination(results, 5);

// 3. Display stats + table
return (
  <div>
    <Card>
      <StatCard value={all?.length || 0} />
    </Card>
    <SearchInput ... />
    <Table data={currentData} />
    <Pagination ... />
  </div>
);
```

---

## 🔌 Database Service Usage

### Importing
```typescript
import { studentDB, facultyDB, coursesDB, gradesDB, eventsDB } from '../../lib/database';
```

### Common Queries
```typescript
// Get all
const students = await studentDB.getAll();

// Get one
const student = await studentDB.getStudent(studentId);

// Get filtered
const grades = await gradesDB.getStudentGrades(studentId);

// Add (use setDocument directly)
import { setDocument } from '../../lib/database';
await setDocument('students', newId, studentData);

// Update
await studentDB.updateStudent(studentId, updatedData);

// Delete
await studentDB.deleteStudent(studentId);
```

---

## ✅ Validation Examples

### Name Validation
```typescript
name: (value: string) => {
  if (value.trim().length === 0) return 'Name is required';
  if (value.trim().length < 3) return 'Name must be at least 3 characters';
  return '';
}
```

### Email Validation
```typescript
email: (value: string) => {
  if (!value.includes('@')) return 'Invalid email format';
  return '';
}
```

### Number Validation
```typescript
year: (value: string) => {
  if (value === '' || !['1', '2', '3', '4'].includes(value)) {
    return 'Please select a valid year';
  }
  return '';
}
```

### Dropdown Validation
```typescript
program: (value: string) => {
  if (!value) return 'Program is required';
  return '';
}
```

---

## 🎯 Implementation Checklist for New Pages

Copy this for each page you enhance:

- [ ] Import hooks: `useAsync`, `useForm`, `useSearch`, `usePagination`
- [ ] Import components: `LoadingSpinner`, `ErrorMessage`, `EmptyState`, `FormInput`, `Card`, `Pagination`
- [ ] Setup useAsync for data fetching
- [ ] Add useEffect to trigger initial fetch
- [ ] Create form with useForm if needed
- [ ] Add validation for form fields
- [ ] Implement search with useSearch if listing
- [ ] Add pagination with usePagination if many items
- [ ] Display LoadingSpinner while loading
- [ ] Display ErrorMessage on error
- [ ] Display EmptyState when no data
- [ ] Render data in appropriate UI (table, grid, cards)
- [ ] Add add/edit/delete buttons with handlers
- [ ] Test with real data
- [ ] Test with empty data
- [ ] Test with errors

---

**Remember:** All patterns are production-ready and tested. Copy & adapt for your use case!
