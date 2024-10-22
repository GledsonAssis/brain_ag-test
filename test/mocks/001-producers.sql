CREATE DATABASE producers;
\c producers;
CREATE TABLE "producers" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "document" VARCHAR(20) NOT NULL UNIQUE,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE "farms" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(2) NOT NULL, -- Using state abbreviation (e.g., "SP", "RJ")
    "total_area_hectares" NUMERIC(10, 2) NOT NULL,
    "arable_area_hectares" NUMERIC(10, 2) NOT NULL,
    "vegetation_area_hectares" NUMERIC(10, 2) NOT NULL,
    "id_producer" INT NOT NULL,
    CONSTRAINT "FK_producer_farm" FOREIGN KEY ("id_producer") REFERENCES "producers" ("id"),
    CONSTRAINT "unique_farm_name_per_producer" UNIQUE ("name", "id_producer")
);
CREATE TABLE "crops" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE "farms_crops_relationship" (
    "id" SERIAL PRIMARY KEY,
    "id_farm" INT NOT NULL,
    "id_crop" INT NOT NULL,
    CONSTRAINT "FK_farms_crops_relationship_farm" FOREIGN KEY ("id_farm") REFERENCES "farms" ("id"),
    CONSTRAINT "FK_farms_crops_relationship_crop" FOREIGN KEY ("id_crop") REFERENCES "crops" ("id")
);