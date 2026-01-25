# LMS Frontend Architecture

## 1. Tech Stack Overview
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Server State:** TanStack Query v5
- **Client State:** Zustand
- **Validation:** Zod + React Hook Form
- **HTTP Client:** Axios (Interceptors configured)

## 2. Directory Structure (Feature-First)
We typically avoid `src/` to keep imports shorter and structure cleaner.
The `app/` folder is reserved strictly for **Routing** and **Layouts**.
Business logic resides in `features/`.

```
frontend/website/
├── app/                        # Next.js Routing Layer (Thin)
│   ├── (auth)/                 # Auth route group (login, register)
│   ├── admin/                  # Admin dashboard routes
│   │   ├── layout.tsx          # Admin layout (Sidebar, Navbar)
│   │   └── page.tsx
│   ├── instructor/             # Instructor dashboard routes
│   │   ├── courses/
│   │   └── analytics/
│   ├── student/                # Student portal routes
│   │   ├── my-courses/
│   │   └── browse/
│   ├── api/                    # Next.js API Routes (if needed)
│   ├── globals.css             # Global Styles (Tailwind v4)
│   └── layout.tsx              # Root Layout (Providers wrapper)
├── components/                 # Shared Components
│   └── ui/                     # Atomic shadcn/ui components (Button, Input)
├── features/                   # Domain Modules
│   ├── auth/
│   │   ├── api/                # authService (login, register, logout)
│   │   ├── components/         # Auth-specific UI (LoginForm, RegisterForm)
│   │   ├── hooks/              # useLogin, useAuth, useUser
│   │   └── types/              # User, AuthResponse interfaces
│   ├── instructor/             # Instructor Domain
│   │   ├── api/                # courseService, analyticsService
│   │   ├── components/         # CourseBuilder, RevenueChart
│   │   ├── hooks/              # useCreateCourse, useCourseStats
│   │   └── types/              # Course, Module interfaces
│   └── student/                # Student Domain
├── config/                 # App Constants (Navigation, Metadata)
├── hooks/                  # Global Hooks (useDebounce, useClickOutside)
├── lib/                    # Singletons & Configuration
│   ├── axios.ts            # Axios instance with interceptors
│   ├── env.ts              # Type-safe Env Variables (Zod)
│   ├── query-client.ts     # TanStack Query Client config
│   └── utils.ts            # cn(), date formatters
├── providers/              # Context Providers
│   ├── query-provider.tsx  # TanStack Query Provider
│   └── toast-provider.tsx  # Toast Notification Provider
├── stores/                 # Global Stores (Zustand)
│   └── use-sidebar-store.ts
├── types/                  # Global Shared Types
├── middleware.ts           # Edge Middleware for RBAC
└── package.json            # Dependencies
```

## 3. Implementation Guidelines

### A. Tailwind CSS v4 Setup
In Tailwind v4, configuration happens in CSS. No `tailwind.config.js` is needed usually.
**`app/globals.css`**:
```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", sans-serif;
  --color-primary: #3b82f6; 
  /* Define other tokens here */
}

/* Utilities if needed */
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}
```

### B. Security & Middleware (RBAC)
Protect routes using `middleware.ts`.
**`middleware.ts`**:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = {
  admin: '/admin',
  instructor: '/instructor',
  student: '/student',
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // Or use generic auth check via service
  const { pathname } = request.nextUrl;

  // 1. Redirect to login if no token for protected routes
  if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/instructor') || pathname.startsWith('/student'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Role-Based Access Control (Mock Logic - Replace with real JWT decoding)
  // const userRole = decode(token).role; 
  // if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
  //   return NextResponse.rewrite(new URL('/403', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### C. Data Fetching Pattern
Follow a 3-layer architecture: **API Service -> Custom Hook -> UI Component**.

**1. API Service (`features/courses/api/course-service.ts`)**
```typescript
import { axiosInstance } from '@/lib/axios';
import { Course } from '../types';

export const courseService = {
  getAll: async () => {
    const { data } = await axiosInstance.get<Course[]>('/courses');
    return data;
  },
  create: async (payload: CreateCourseDto) => {
    const { data } = await axiosInstance.post<Course>('/courses', payload);
    return data;
  }
};
```

**2. Custom Hook (`features/courses/hooks/use-courses.ts`)**
```typescript
import { useQuery } from '@tanstack/react-query';
import { courseService } from '../api/course-service';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAll,
    staleTime: 5 * 60 * 1000, // 5 mins
  });
};
```

**3. UI Component (`app/instructor/courses/page.tsx`)**
```tsx
'use client';
import { useCourses } from '@/features/instructor/hooks/use-courses';

export default function CoursesPage() {
  const { data: courses, isLoading, error } = useCourses();

  if (isLoading) return <Loader />;
  if (error) return <ErrorState />;

  return (
    <div>
      {courses?.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

### D. Global Providers
Wrap your app in `app/layout.tsx`:
```tsx
import { QueryProvider } from '@/providers/query-provider';
import { useSidebarStore } from '@/stores/use-sidebar-store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

### E. Environment Variables
Use `lib/env.ts` to ensure type safety.
```typescript
import { env } from '@/lib/env';

// Usage
console.log(env.NEXT_PUBLIC_API_URL);
```

### F. Global Navigation
Use `config/app.config.ts` for navigation items to avoid hardcoding strings.
```typescript
import { adminNavItems } from '@/config/app.config';
```
