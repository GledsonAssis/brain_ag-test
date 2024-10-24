\c producers;
-- Producers --
INSERT INTO "producers" ("id", "name", "document", "is_active") VALUES (1, 'Landen', '23109130068', true);
INSERT INTO "producers" ("id", "name", "document", "is_active") VALUES (2, 'Jeffery', '30579004023', true);
INSERT INTO "producers" ("id", "name", "document", "is_active") VALUES (3, 'Franco', '93669199012', true);
INSERT INTO "producers" ("id", "name", "document", "is_active") VALUES (4, 'Tod', '95219153072', true);
INSERT INTO "producers" ("id", "name", "document", "is_active") VALUES (5, 'Aidan', '30822227061', true);
-- Farms --
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (1, 'Strosin Rue', 'Jerdeworth', 'SC', 124, 78, 46, 1);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (2, 'Schiller Pines', 'Daughertybury', 'AL', 87, 36, 51, 1);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (3, 'Stanley Street', 'Port Uniqueborough', 'RN', 50, 48, 2, 1);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (4, 'Schoen Roads', 'Ressieshire', 'DE', 77, 73, 4, 2);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (5, 'Hester Underpass', 'South Petra', 'SP', 136, 26, 110, 2);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (6, 'Sylvan Place', 'Brentwood', 'RS', 96, 67, 29, 2);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (7, 'Norris Passage', 'Klockocester', 'RS', 80, 21, 59, 3);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (8, 'E 4th Street', 'New Holden', 'PI', 158, 141, 17, 3);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (9, 'Stanton Ferry', 'East Isaiaston', 'MA', 82, 78, 4, 3);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (10, 'Belle Crescent', 'East Garnetstead', 'AL', 142, 140, 2, 4);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (11, 'Jasen Inlet', 'Nathanfort', 'SC', 192, 89, 103, 4);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (12, 'Witting Flats', 'New Javierchester', 'MG', 110, 84, 26, 4);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (13, 'Wilhelmine Villages', 'West Veronica', 'RS', 77, 59, 18, 5);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (14, 'W Lake Street', 'New Janiya', 'SP', 110, 65, 45, 5);
INSERT INTO "farms" ("id", "name", "city", "state", "total_area_hectares", "arable_area_hectares", "vegetation_area_hectares", "id_producer") VALUES (15, 'Common Lane', 'New Ward', 'MG', 157, 133, 24, 5);
-- Farms-Crops Relationships --
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (1, 1, 3);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (2, 1, 1);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (3, 2, 5);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (4, 2, 4);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (5, 3, 3);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (6, 3, 2);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (7, 4, 3);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (8, 4, 1);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (9, 5, 3);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (10, 5, 2);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (11, 6, 1);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (12, 6, 2);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (13, 7, 4);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (14, 7, 2);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (15, 8, 3);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (16, 8, 2);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (17, 9, 3);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (18, 9, 1);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (19, 10, 1);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (20, 10, 5);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (21, 11, 2);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (22, 11, 3);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (23, 12, 4);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (24, 12, 3);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (25, 13, 4);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (26, 13, 2);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (27, 14, 2);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (28, 14, 4);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (29, 15, 4);
INSERT INTO "farms_crops_relationship" ("id", "id_farm", "id_crop") VALUES (30, 15, 2);