## Controller Layer
**Responsibilities**:
- Handles HTTP requests (GET/POST/PUT/DELETE) from clients (frontend/mobile)
- Parses request parameters (URL paths, query params, request body)
- Invokes Service layer for business logic
- Returns HTTP responses (JSON data, status codes, error messages)

## Service Layer
**Responsibilities**:
- Implements core business logic (order creation, auth validation, calculations)
- Calls DAO for data operations
- Manages transactions (e.g., DB atomicity)

## DAO Layer (Data Access Object)
**Responsibilities**:
- Direct DB interactions (CRUD operations)
- Encapsulates SQL/ORM (e.g., MyBatis, Hibernate)
- Converts DB records to domain objects
