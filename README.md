# Brain-ag Test Code

## Overview

This repository contains a Node.js application designed for testing purposes, particularly around user-related operations. The project structure includes use cases, domain entities, value objects (VOs), infrastructure components, and interfaces for controllers and presentations. The application uses **Express** for routing, **Mongoose** as the ODM for MongoDB, and **JWT** for authorization.

## Dockerfile Structure

The Dockerfile is multi-staged to ensure efficient builds, separating the build process from the production runtime. Here's an outline of the Docker stages:

1. **Builder Stage:**
   - Uses Node.js 18 as the base image.
   - Installs dependencies and runs the build process.

2. **Dependencies Stage:**
   - Cleans up the build environment and installs only production dependencies.

3. **Release Stage:**
   - Uses Node.js 18 as the final runtime.
   - Copies the build output and dependencies for production.

## Getting Started

### Prerequisites

- Docker
- Node.js (v18+)

### Project Setup

1. Run with docker-compose
   ```bash
   docker-compose up --build -d
   ```

2. Build and run the Docker container:

   ```bash
   docker build -t brain-ag-test-code .
   docker run -p 3000:3000 brain-ag-test-code
   ```

3. Once the server is up, you should see logs similar to:

   ```bash
   [INFO] - 2024-10-22T04:11:20.109Z - [8e489612-7dca-4163-ab9b-c8f0f01a91ad] - ✅ [Successfully] - Database Connection
   [INFO] - 2024-10-22T04:11:21.072Z - [e2bef4be-2297-46dc-9100-524788d93f65] - ✅ Registering route: get | /v1/dashboard/totals
   [INFO] - 2024-10-22T04:11:21.073Z - [210ed189-7a9f-4ae0-b6c6-eeba87970b57] - ✅ Registering route: post | /v1/producers
   [INFO] - 2024-10-22T04:11:21.074Z - [e45f43f4-5086-4af9-af92-214aefa8be29] - ✅ Registering route: patch | /v1/producers/:id
   [INFO] - 2024-10-22T04:11:21.075Z - [923a20d2-023e-49bd-95e4-e64d7c333e65] - ✅ Registering route: delete | /v1/producers/:id
   [INFO] - 2024-10-22T04:11:21.077Z - [8c2bf582-db7e-4698-bec3-65abc97f180e] - ✅ [Successfully] - Server Startup - port: 3000
   ```

### Running Locally (Without Docker)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Run tests:

   ```bash
   npm run test:coverage
   ```

4. Build the project:

   ```bash
   npm run build
   ```

5. Start the production server:

   ```bash
   npm run start
   ```

## Test Example


#### POST /v1/producers
```bash
curl --location 'localhost:3000/v1/producers' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.WHDfHlX4MCE-koQFp8lDU4Ei45ZilvlfDfASW1j4qlM' \
--header 'Content-Type: application/json' \
--header 'Cookie: csrftoken=TfmyKEszBAxMu0FGxvYc08AnoL5jzVCz' \
--data '{
    "name": "teste abcdfe",
    "document": "01234567890",
    "farms": [
        {
            "name": "fazenda Teste AC",
            "city": "Cidade 1",
            "state": "AC",
            "total_area_hectares": 120,
            "arable_area_hectares": 50,
            "vegetation_area_hectares": 70,
            "crops": ["1", "5"]
        }
    ]
}'
```

#### PATCH /v1/producers/:id
```bash
curl --location --request PATCH 'localhost:3000/v1/producers/1' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.WHDfHlX4MCE-koQFp8lDU4Ei45ZilvlfDfASW1j4qlM' \
--header 'Content-Type: application/json' \
--header 'Cookie: csrftoken=TfmyKEszBAxMu0FGxvYc08AnoL5jzVCz' \
--data '{
    "name": "teste abcdf",
    "farms": [
        {
            "id": "1",
            "name": "fazenda Teste",
            "city": "Cidade 2",
            "state": "RN",
            "total_area_hectares": 100,
            "arable_area_hectares": 50,
            "vegetation_area_hectares": 50,
            "crops": [
                "1"
            ]
        }
    ]
}'
```

#### DELETE /v1/producers/:id
```bash
curl --location --request DELETE 'localhost:3000/v1/producers/1' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.WHDfHlX4MCE-koQFp8lDU4Ei45ZilvlfDfASW1j4qlM' \
--header 'Cookie: csrftoken=TfmyKEszBAxMu0FGxvYc08AnoL5jzVCz'
```

#### DELETE /v1/dashboard/totals
```bash
curl --location 'localhost:3000/v1/dashboard/totals' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.WHDfHlX4MCE-koQFp8lDU4Ei45ZilvlfDfASW1j4qlM' \
--header 'Cookie: csrftoken=TfmyKEszBAxMu0FGxvYc08AnoL5jzVCz'
```


## Test Coverage

The application has high test coverage as shown below:
File                            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines                                                                                                                                 
--------------------------------|---------|----------|---------|---------|------------------------------
All files                       |   88.96 |    83.76 |    91.2 |   88.61 | 
 application/usecases           |   94.64 |      100 |   81.81 |   94.44 | 
  create-producer.ts            |     100 |      100 |     100 |     100 | 
  delete-producer.ts            |     100 |      100 |     100 |     100 | 
  get-dashboard.ts              |   71.42 |      100 |       0 |   71.42 | 25-26
  update-producer.ts            |   94.44 |      100 |   66.66 |   94.44 | 41
 domain/entity                  |     100 |      100 |     100 |     100 | 
  crop.ts                       |     100 |      100 |     100 |     100 | 
  document.ts                   |     100 |      100 |     100 |     100 | 
  error.ts                      |     100 |      100 |     100 |     100 | 
  farm.ts                       |     100 |      100 |     100 |     100 | 
  producer.ts                   |     100 |      100 |     100 |     100 | 
 domain/vo                      |     100 |      100 |     100 |     100 | 
  city.ts                       |     100 |      100 |     100 |     100 | 
  cnpj.ts                       |     100 |      100 |     100 |     100 | 
  cpf.ts                        |     100 |      100 |     100 |     100 | 
  hectaresArea.ts               |     100 |      100 |     100 |     100 | 
  name.ts                       |     100 |      100 |     100 |     100 | 
  state.ts                      |     100 |      100 |     100 |     100 | 
 infra/authorization            |     100 |      100 |     100 |     100 | 
  validate-jwt.ts               |     100 |      100 |     100 |     100 | 
 infra/database                 |     100 |      100 |     100 |     100 | 
  pg-adapter.ts                 |     100 |      100 |     100 |     100 | 
 infra/di                       |     100 |      100 |     100 |     100 | 
  di.ts                         |     100 |      100 |     100 |     100 | 
 infra/http                     |     100 |      100 |     100 |     100 | 
  express-adapter.ts            |     100 |      100 |     100 |     100 | 
 infra/input-validator/ajv      |     100 |      100 |     100 |     100 | 
  compile.ts                    |     100 |      100 |     100 |     100 | 
 infra/repository               |   65.92 |    66.66 |   65.38 |   65.73 | 
  crop-repository.ts            |     100 |      100 |     100 |     100 | 
  farm-repository.ts            |   49.12 |     42.1 |   57.89 |   49.12 | 24-72,99-142,231-350,393-394
  producer-repository.ts        |   91.17 |       80 |      80 |   91.17 | 101-103
 interfaces/controllers         |     100 |    72.09 |     100 |     100 | 
  create-producer-controller.ts |     100 |    72.72 |     100 |     100 | 32,44-57
  delete-producer-controller.ts |     100 |    72.72 |     100 |     100 | 31,43-56
  get-dashboard-controller.ts   |     100 |       70 |     100 |     100 | 23,35-48
  update-producer-controller.ts |     100 |    72.72 |     100 |     100 | 32,44-57
 interfaces/presentations       |     100 |      100 |     100 |     100 | 
  http.ts                       |     100 |      100 |     100 |     100 | 
--------------------------------|---------|----------|---------|---------|------------------------------

Test Suites: 27 passed, 27 total
Tests:       186 passed, 186 total
Snapshots:   0 total
Time:        10.744 s
Ran all test suites

## Environment Variables

To run the project, you may need to set up the following environment variables:

```bash
JWT_SECRET=<your-secret-key>
MONGODB_URI=<your-mongodb-uri>
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Maintainer

- **Gledson Assis**

---

Feel free to modify the project to fit your needs. Contributions are welcome!