> [!WARNING]
>
> This repository contains a solution for an assignment in the VAVJS course at FIIT STU. If you are currently enrolled in this course or a similar one, please **do not copy** this code or parts of it and submit it as your own work. Submitting plagiarized work can lead to serious academic consequences according to the university's regulations.
>
> You may use this repository for inspiration or reference _after_ you have completed and submitted your own work, or if you are no longer taking the course. **It is crucial that you develop your own solution to understand the concepts and learn effectively.** The best way to learn is by doing the work yourself.

# Personal Fitness Monitoring Application

This project was created as an assignment for the **VAVJS_B (Application Development in JavaScript)** course at the **[FIIT STU](https://www.fiit.stuba.sk/en.html?page_id=749)**.

The goal is to create a full-stack web application for monitoring personal fitness data. The application involves user management, data logging (weight, blood pressure, heart rate, steps), data visualization with linear regression, method management, an admin interface with user and ad management, data import/export, and end-to-end testing, all running within a Docker environment.

## Project Goal

To create a web application accessible at `http://localhost:8080` for monitoring personal fitness/condition.

## Scoring Breakdown

| Section                    | Task                                                                                           | Points | Sub-Total |
| :------------------------- | :--------------------------------------------------------------------------------------------- | :----- | :-------- |
| **1. DB & JS Interaction** |                                                                                                |        | **5**     |
|                            | a. Weights table/logic                                                                         | 1      |           |
|                            | b. Systolic Pressure, Diastolic Pressure tables/logic (e.g., Blood Pressure or HR/Steps)       | 1      |           |
|                            | c. Users table/logic                                                                           | 1      |           |
|                            | d. Methods table/logic                                                                         | 1      |           |
|                            | e. Advertisement table/logic                                                                   | 1      |           |
| **2. User Application UI** |                                                                                                |        | **12**    |
|                            | a. Registration and Login pages                                                                | 1      |           |
|                            | b. Measurement Management pages (Insert & Delete measurements)                                 | 2      |           |
|                            | c. Measurement Import & Export (CSV)                                                           | 2      |           |
|                            | d. Method Management page (Insert & Delete methods)                                            | 2      |           |
|                            | e. User Data page (Table & Graph) with time range selection                                    | 2      |           |
|                            | f. Linear Regression display on graph (Weight)                                                 | 1      |           |
|                            | g. Linear Regression display on graph ([Param 2] & [Param 3])                                  | 1      |           |
|                            | h. Data filtering by method on the data page                                                   | 2      |           |
|                            | i. Advertisement display page/logic                                                            | 1      |           |
| **3. Admin Interface**     |                                                                                                |        | **3**     |
|                            | a. User Management (Create & Delete users)                                                     | 1      |           |
|                            | b. User Import & Export (CSV)                                                                  | 1      |           |
|                            | c. Advertisement settings (change links) & counter display                                     | 1      |           |
| **4. End-to-End Testing**  | E2E test for measurement insertion (Mocha, network call simulation, separate Docker container) | 5      | **5**     |
|                            | **TOTAL**                                                                                      |        | **25**    |

## Database (DB) Requirements

- **Type:** Relational Database (RDB) only. No document DBs, no SQLite.
  - Recommended Libraries (use specified versions): `mysql@2.18.1`, `pg@8.13.1`, `mariadb@3.4.0`. Ask if you want to use another RDB library.
  - Recommended Docker Images (use _exactly_ these versions): `postgres:17.2`, `mysql:9.1`, `mariadb:11.6`.
- **Schema:**
  - **Measurements (Weight/Systolic Pressure/Diastolic Pressure):** `id`, `date` (YYYY-MM-DD), `value` (numeric), `method_id` (FK or similar, can be ID, name, or NULL/''). Consider separate tables or a single table with a 'type' column.
  - **Users:** `id`, `email` (unique), `name`, `password` (hashed), `age`, `height`.
  - **Methods:** `id`, `name`, `description`.
  - **Advertisements:** `id` (or single row), `image_link`, `target_link`, `click_counter`.
- **Setup:** The database schema MUST be created automatically during the `docker-compose build` or `docker-compose up` process. Do NOT submit database volumes or custom database images.

## User Interface Requirements

- **Authentication:** Pages for user registration and login.
- **Measurement Management:**
  - Insert single measurements (Weight, Systolic Pressure, Diastolic Pressure).
  - Import measurements from CSV: Format `YYYY-MM-DD,value,type,method_name` where `type` is 'weight', '[param2_name]', or '[param3_name]'.
  - Export measurements to CSV.
  - Delete measurements.
- **Method Management:** Page to insert and delete measurement methods (e.g., "Morning Weigh-in", "Post-Workout HR").
- **Data Visualization:**
  - Page displaying user data in a table and a graph.
  - Ability to select a date range for the displayed data.
  - Graph should show linear regression lines for Weight, Systolic Pressure and Diastolic Pressure data series.
  - Ability to filter the displayed data (both table and graph) based on the measurement method used.
- **Advertisements:**
  - An advertisement (fetched from DB settings) should be displayed to the user roughly every minute of application usage.
  - Clicking the ad increments its counter in the DB and redirects the user to the ad's target link.

## Admin Interface Requirements

- **Credentials:** Login: `admin`, Password: `admin`.
- **Functionality:** A dedicated admin section.
  - **User Management:** View, Create, Delete users. Import/Export users via CSV (Format: `email,name,password,age`).
  - **Advertisement Management:** Ability to change the advertisement's image link (`img src`) and target link (`href`). Display the current click count for the ad banner.

## End-to-End Testing

- Implement at least one end-to-end test using **Mocha**.
- The test should simulate the process of inserting a new measurement via network calls (e.g., simulating `fetch` requests to your backend API).
- This test MUST run in a **separate Docker container** defined in your `docker-compose.yml`.

## Allowed Libraries & Frameworks

- **Frontend:** React, Angular, Vue, Svelte
- **Backend/ORM:** Express, Sequelize / TypeORM
- **Utilities:** jQuery, Axios (or native `fetch`)
- **Language:** TypeScript is allowed.
- **Other Libraries:** Ask the instructor before using any library not listed here.

## Forbidden Libraries & Frameworks

- Nest.js, Next.js, Nuxt.js (and similar meta-frameworks that might abstract away required core functionalities).

## How to Run the Project

```bash
# Clone the repository
git clone https://github.com/TechOctopus/fitness-app-vavjs
cd fitness-app-vavjs
# Build and run the Docker containers
docker-compose up --build
# Access the application in your web browser
open http://localhost:8080
```

## License

This project is licensed under the **MIT License**. You can find the full license text in the `LICENSE` file.
