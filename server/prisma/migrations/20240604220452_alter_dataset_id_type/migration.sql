/*
  Warnings:

  - You are about to alter the column `datasetId` on the `jobs` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "baseModel" TEXT NOT NULL,
    "datasetId" INTEGER NOT NULL,
    "trainingMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "hyperparameters" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_jobs" ("baseModel", "createdAt", "datasetId", "hyperparameters", "id", "lastUpdatedAt", "name", "status", "trainingMethod", "userId") SELECT "baseModel", "createdAt", "datasetId", "hyperparameters", "id", "lastUpdatedAt", "name", "status", "trainingMethod", "userId" FROM "jobs";
DROP TABLE "jobs";
ALTER TABLE "new_jobs" RENAME TO "jobs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
