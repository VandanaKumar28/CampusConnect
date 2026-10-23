# CampusConnect

A full-stack campus facility booking and resource management system built with
Spring Boot and React. CampusConnect allows students and faculty to request
campus resources while administrators manage approvals and monitor resource
utilization.

The project focuses on real-world backend engineering concepts such as
JWT authentication, role-based authorization, conflict-free scheduling,
optimistic locking, approval workflows, and REST API design.

---

## Features

### Authentication & Authorization
- User registration and login
- Stateless JWT authentication
- Role-based access control
- Supported roles:
  - STUDENT
  - FACULTY
  - ADMIN
- Protected frontend routes
- Admin-only approval and analytics pages

### Resource Management
- View available campus resources
- Resource categories and locations
- Capacity information
- Resources that require administrator approval
- Instant-confirmation resources

### Booking System
- Request a resource for a specific date and time
- Specify booking purpose
- Prevent overlapping bookings
- Handle booking conflicts with HTTP 409 responses
- View personal booking history
- Cancel pending or approved bookings

### Admin Approval Workflow
- View pending booking requests
- Approve or reject requests
- Re-check conflicts during approval
- Prevent approval when another booking overlaps the requested slot

### Analytics
- Admin-only resource utilization dashboard
- Visualizes approved bookings per resource using Recharts

---

## Tech Stack

### Backend
- Java 17
- Spring Boot 3
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- MySQL
- Maven

### Frontend
- React
- React Router
- Axios
- Recharts
- Vite
- CSS

---

## Architecture

```text
                    ┌─────────────────────┐
                    │      React SPA      │
                    │                     │
                    │ Login / Register    │
                    │ Resources           │
                    │ My Bookings         │
                    │ Admin Approvals     │
                    │ Admin Analytics     │
                    └──────────┬──────────┘
                               │
                         Axios + JWT
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot API   │
                    │                     │
                    │ Controllers         │
                    │ Services            │
                    │ Security / JWT      │
                    │ DTOs                │
                    │ Repositories        │
                    └──────────┬──────────┘
                               │
                         Spring Data JPA
                               │
                               ▼
                    ┌─────────────────────┐
                    │        MySQL        │
                    │                     │
                    │ Users               │
                    │ Resources           │
                    │ Bookings            │
                    └─────────────────────┘