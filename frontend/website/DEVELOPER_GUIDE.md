# Developer Usage Guide & Standards

> **Status:** Active Standard  
> **Last Updated:** 2026-01-28  
> **Scope:** Frontend (`frontend/website`)

This guide outlines the development standards for our **Production-Grade Architecture**. Adhering to these patterns ensures consistency, maintainability, and automatic support for theming (Dark Mode).

---

## 1. Styling & Theming

We have moved away from hardcoded utility colors (e.g., `bg-blue-600`) to **Semantic CSS Variables**. This decouples our design tokens from specific color values, allowing global theming changes and automatic Dark Mode support without changing component code.

### 🔴 Before (The Wrong/Old Way)
Using specific color scales implies hardcoding logic for light/dark modes and breaks if we change the brand color.

```tsx
// ❌ Bad: Hardcoded colors, no semantic meaning
<button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500">
  Submit
</button>

<div className="bg-slate-100 border border-slate-200 text-slate-900">
  <p className="text-slate-500">Description text</p>
</div>
```

### 🟢 After (The New Standard Way)
Use semantic variables. These map to different hex values depending on the active theme (Light/Dark).

```tsx
// ✅ Good: Semantic tokens handled by Tailwind v4 aliases
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Submit
</Button>

// Standard card usage (or just use the <Card> component!)
<div className="bg-card border-border text-card-foreground">
  <p className="text-muted-foreground">Description text</p>
</div>
```

| Semantic Name | Usage |
|--------------|-------|
| `bg-primary` | Main brand color (buttons, active states) |
| `text-primary-foreground` | Text color meant to sit ON TOP of primary |
| `bg-muted` | Secondary backgrounds (grayed out areas) |
| `text-muted-foreground` | Subtle text (replacing gray-500) |
| `bg-destructive` | Error states, delete buttons |

---

## 2. Building Forms

We use **Shadcn Form** (wrapping React Hook Form) + **Zod** for validation. This standardizes error handling, label association, and focus management.

### 🔴 Before (The Wrong/Old Way)
Manually handling labels, inputs, and error states leads to inconsistent UI and accessibility issues.

```tsx
// ❌ Bad: Verbose, manual error handling, no accessibility connection
const { register, formState: { errors } } = useForm();

<div className="flex flex-col gap-2">
  <label htmlFor="email">Email</label>
  <input 
    id="email"
    {...register("email")} 
    className="border p-2 rounded" 
  />
  {errors.email && <span className="text-red-500">{errors.email.message}</span>}
</div>
```

### 🟢 After (The New Standard Way)
Use the `<FormField>` wrapper and our reusable inputs like `<PasswordInput>`. This automatically handles IDs, `aria-invalid`, error messages, and labels.

```tsx
// ✅ Good: Clean, accessible, standardized
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input"; // Pre-built eye toggle

export function LoginForm() {
  const form = useForm<LoginSchema>({ ... });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Standard Input */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Input (Built-in toggle) */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </form>
    </Form>
  );
}
```

---

## 3. Adding Navigation Menu Items

The dashboard sidebar and navigation logic are **configuration-driven**. You should never need to edit component files (like `sidebar.tsx` or `nav-main.tsx`) just to add a link.

### 🔴 Before (The Wrong/Old Way)
Hardcoding links inside components creates technical debt and scattering of route definitions.

```tsx
// ❌ Bad: Editing logic logic to add content
// features/dashboard/sidebar.tsx
return (
  <nav>
    <Link href="/dashboard">Home</Link>
    <Link href="/dashboard/new-link">New Link</Link> {/* DON'T DO THIS */}
  </nav>
)
```

### 🟢 After (The New Standard Way)
Add the item to `config/dashboard-nav.ts`. It will automatically appear in the correct user's sidebar with the correct icon and active state logic.

```ts
// ✅ Good: Config-driven navigation in config/dashboard-nav.ts
export const adminNavItems: NavItem[] = [
    {
        title: "Users",
        url: "/admin/users",
        icon: Users,
    },
    // Just add the new object here:
    {
        title: "New Feature",
        url: "/admin/new-feature",
        icon: Sparkles, // Import icon from lucide-react
    }
]
```

---

## 4. Fetching Data (Architecture)

We follow a strictly layered architecture for API interaction using **TanStack Query (React Query)**. Components should never fetch data directly.

### 🔴 Before (The Wrong/Old Way)
Fetching inside components couples UI to data fetching implementation and misses caching/deduplication features.

```tsx
// ❌ Bad: Fetching directly in component
function UserProfile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/users/me').then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;
  return <div>{data.name}</div>;
}
```

### 🟢 After (The New Standard Way)
**Layer 1: Service (`features/*/api/service.ts`)**  
Handle the HTTP request, types, and raw data extraction.

```ts
// features/auth/api/auth-service.ts
export const authService = {
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  }
};
```

**Layer 2: Hook (`features/*/hooks/use-something.ts`)**  
Wrap the service in `useQuery` or `useMutation`. Manage cache keys and side effects (toasts, redirects).

```ts
// features/auth/hooks/use-auth.ts
export function useUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => authService.getMe(),
  });
}
```

**Layer 3: Component**  
Consume the hook.

```tsx
// features/auth/components/user-profile.tsx
export function UserProfile() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <Skeleton className="h-4 w-20" />;
  
  return <div>{user?.firstName}</div>;
}
```
