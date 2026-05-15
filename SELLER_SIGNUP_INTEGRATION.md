# Seller Signup Integration Guide

## Overview

The seller signup flow is now integrated with your backend controller endpoint. Here's how everything is set up:

---

## Setup Summary

### 1. **API Service** (`src/services/api.ts`)

- **Base URL**: `https://t2sg84b0-3005.uks1.devtunnels.ms`
- **Endpoint**: `/seller/signup`
- **Function**: `createSellerAccount(userData)`

```typescript
// Example usage in API service
const response = await createSellerAccount({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123',
  mobile: '(555) 123-4567',
});
```

### 2. **Zustand Store** (`src/store/auth.store.ts`)

State Management with the following properties:

- `token`: Auth token from successful signup
- `user`: User email
- `loading`: Loading state during API call
- `error`: Error message if signup fails

**Key Action:**

```typescript
// Call this to trigger signup
await signupSeller(userData);
```

### 3. **Custom Hook** (`src/hooks/use-seller-signup.ts`)

Convenient wrapper around store:

```typescript
const { signup, loading, error, isSuccessful, token } = useSellerSignup();

// In your component
await signup({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123',
  mobile: '(555) 123-4567',
});
```

### 4. **Registration Hook** (`src/features/auth/useRegistration.ts`)

Already integrated! This is your main entry point for signup:

- Uses Zod validation from `auth.schema.ts`
- Automatically calls the API through the store
- Handles errors and navigation

---

## Usage in Components

### Option 1: Using Registration Hook (Recommended for UI Forms)

```typescript
import { useRegistration } from '@/features/auth/useRegistration';

export default function SignupScreen() {
  const { form, onSubmit, isLoading, error } = useRegistration();

  return (
    <View>
      {/* Your form fields bound to form.register() */}
      <TextInput
        placeholder="Full Name"
        {...form.register('fullName')}
      />
      {/* ... more fields ... */}
      <Button
        onPress={form.handleSubmit(onSubmit)}
        disabled={isLoading}
        title={isLoading ? 'Creating Account...' : 'Sign Up'}
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
}
```

### Option 2: Using Custom Hook (For Direct API Calls)

```typescript
import { useSellerSignup } from '@/hooks/use-seller-signup';

export default function DirectSignup() {
  const { signup, loading, error, isSuccessful } = useSellerSignup();

  const handleSignup = async () => {
    await signup({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'SecurePass123',
      mobile: '(555) 123-4567'
    });
  };

  return (
    <View>
      <Button onPress={handleSignup} disabled={loading} title="Sign Up" />
      {error && <Text>{error}</Text>}
      {isSuccessful && <Text>Signup successful!</Text>}
    </View>
  );
}
```

### Option 3: Using Store Directly

```typescript
import { useAuthStore } from '@/store/auth.store';

export default function StoreSignup() {
  const { signupSeller, token, loading, error } = useAuthStore();

  const handleSignup = async () => {
    await signupSeller({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'SecurePass123',
      mobile: '(555) 123-4567'
    });
  };

  return (
    <View>
      <Button onPress={handleSignup} disabled={loading} title="Sign Up" />
      {token && <Text>Token: {token}</Text>}
    </View>
  );
}
```

---

## Data Flow

```
Component Form Submit
  ↓
useRegistration() hook validates form
  ↓
Calls signupSeller() in Zustand store
  ↓
Store calls createSellerAccount() from API service
  ↓
API service sends POST to https://t2sg84b0-3005.uks1.devtunnels.ms/seller/signup
  ↓
Controller receives request and processes
  ↓
Response returned with token on success
  ↓
Store updates: token, user, loading, error states
  ↓
Component re-renders with new state
```

---

## Expected API Response

Based on your controller, the response will be:

**On Success (201):**

```json
{
  "message": "Seller created successfully",
  "data": "eyJhbGciOiJIUzI1NiIs...",
  "success": true
}
```

**On Error (400/500):**

```json
{
  "message": "User already exists",
  "success": false,
  "data": null
}
```

---

## Testing Endpoints Locally

You can test the endpoint directly using cURL or Postman:

```bash
curl -X POST https://t2sg84b0-3005.uks1.devtunnels.ms/seller/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "mobile": "(555) 123-4567"
  }'
```

---

## Error Handling

Errors are captured in the store and can be accessed via:

```typescript
const { error } = useAuthStore();
```

Common errors:

- **"User already exists"** - Email is already registered
- **"Password not strong enough"** - Password validation failed
- **Network error** - Backend is unreachable

---

## Next Steps

1. Test the signup flow in your app
2. Verify the token is being stored correctly
3. Implement token persistence (AsyncStorage) for authenticated requests
4. Add token to future API requests using axios interceptor
