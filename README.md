\# CampusConnect – Campus Facility Booking System



CampusConnect is a full-stack web application that allows students and faculty to view campus resources and book facilities. Administrators can manage resources, review booking requests, and view utilization analytics.



The project is built with \*\*Spring Boot, Spring Security, JWT, React, and MySQL\*\*.



\## Features



\- \*\*Authentication:\*\* User registration and login with JWT-based authentication.

\- \*\*Role-based access:\*\* STUDENT, FACULTY, and ADMIN roles.

\- \*\*Resource management:\*\* View available resources; administrators can create, update, and deactivate resources.

\- \*\*Facility booking:\*\* Create and view bookings, with validation to detect overlapping time slots.

\- \*\*Booking management:\*\* Users can cancel their own bookings; administrators can review pending requests and update booking status.

\- \*\*Conflict handling:\*\* Booking conflicts return an HTTP `409 Conflict` response.

\- \*\*Admin analytics:\*\* View resource utilization information.

\- \*\*Data validation and exception handling:\*\* Handles invalid requests and application errors.



\## Tech Stack



| Layer | Technologies |

|---|---|

| Frontend | React, JavaScript, HTML, CSS, Vite |

| Backend | Java 17, Spring Boot 3.3.2 |

| Security | Spring Security, JWT |

| Database | MySQL |

| API testing | Postman |

| Build tool | Maven |



\## Architecture



```mermaid

flowchart TD

&#x20;   A\[User] --> B\[React Frontend]

&#x20;   B -->|REST API + JWT| C\[Spring Boot Backend]

&#x20;   C --> D\[Spring Security]

&#x20;   C --> E\[Booking and Resource Services]

&#x20;   E --> F\[MySQL Database]

&#x20;   C --> G\[Admin Analytics API]

```



\## Project Structure



```text

CampusConnect/

├── backend/

│   ├── src/

│   └── pom.xml

├── frontend/

│   ├── src/

│   └── package.json

├── .gitignore

└── README.md

```



\## Getting Started



\### Prerequisites



Install the following before running the application:



\- Java 17

\- Maven

\- Node.js and npm

\- MySQL Server



\### 1. Clone the repository



```bash

git clone https://github.com/VandanaKumar28/CampusConnect.git

cd CampusConnect

```



\### 2. Configure MySQL



Start MySQL and create the database:



```sql

CREATE DATABASE campusconnect;

```



Configure a MySQL username and password that have access to this database. Do not put real credentials in source code or commit them to GitHub.



\### 3. Configure backend environment variables



The backend reads its database credentials and JWT signing secret from environment variables.



In \*\*Windows Command Prompt (CMD)\*\*, set the values for your current terminal session:



```cmd

set DB\_USERNAME=your\_mysql\_username

set DB\_PASSWORD=your\_mysql\_password

set JWT\_SECRET=your\_long\_random\_secret

```



Replace the example values with your own local configuration. Use a strong, randomly generated JWT secret that meets the application's configured signing algorithm requirements. Never share or commit the real secret.



\### 4. Run the backend



Open CMD in the project root and run:



```cmd

cd backend

mvn spring-boot:run

```



The backend runs on:



```text

http://localhost:8080

```



Keep the terminal open while using the application. Set the environment variables in any new CMD session before starting the backend.



\### 5. Run the frontend



Open a \*\*second CMD window\*\*:



```cmd

cd C:\\Users\\user\\Downloads\\campusconnect\\frontend

npm install

npm run dev

```



Open the local URL displayed by Vite, usually:



```text

http://localhost:5173

```



If the frontend uses a different API base URL, configure it according to the frontend's existing configuration.



\## REST API Endpoints



All paths below are relative to `http://localhost:8080`.



| Method | Endpoint | Access |

|---|---|---|

| POST | `/api/auth/register` | Public |

| POST | `/api/auth/login` | Public |

| GET | `/api/resources` | Authenticated |

| GET | `/api/resources/{id}` | Authenticated |

| POST | `/api/resources` | ADMIN |

| PUT | `/api/resources/{id}` | ADMIN |

| DELETE | `/api/resources/{id}` | ADMIN |

| POST | `/api/bookings` | Authenticated |

| GET | `/api/bookings/me` | Authenticated |

| GET | `/api/bookings/pending` | ADMIN |

| PATCH | `/api/bookings/{id}/cancel` | Authenticated; booking ownership is checked |

| PATCH | `/api/bookings/{id}/status` | ADMIN |

| GET | `/api/admin/analytics/utilization` | ADMIN |



\### Authentication



After logging in, use the returned JWT in the authorization header for protected endpoints:



```http

Authorization: Bearer <your-jwt-token>

```



Public registration assigns the `STUDENT` role. Administrative access should be granted only through a trusted, controlled process.



\### Booking Conflict Handling



The application checks for overlapping bookings in pending or approved status. Time intervals use the rule:



```text

existingStart < requestedEnd

AND

existingEnd > requestedStart

```



This allows adjacent bookings—for example, one ending at 10:00 and another beginning at 10:00—without treating them as overlapping. Conflicts detected by the application return HTTP `409 Conflict`.



\## Testing



Use Postman to test the REST APIs. Suggested scenarios include:



\- Register and log in with valid credentials.

\- Access protected endpoints with and without a JWT.

\- Try invalid or missing request fields.

\- Create a booking and try another booking for an overlapping time slot.

\- Verify that a user cannot cancel another user's booking.

\- Verify that non-admin users cannot access administrator-only endpoints.

\- Test resource creation, updates, and deactivation with an administrator account.



\## Current Project Status



CampusConnect is a \*\*local development project\*\*. The backend and frontend are configured to run locally, and the project has been pushed to GitHub. A live production deployment has not been completed.



\## Future Improvements



\- Deploy the application to a cloud platform.

\- Add automated backend and frontend tests.

\- Improve booking concurrency protection for simultaneous requests.

\- Introduce database migration management for production.

\- Improve deployment, monitoring, and application documentation.



\## Author



\*\*Vandana Kumar\*\*



GitHub: \[VandanaKumar28](https://github.com/VandanaKumar28)