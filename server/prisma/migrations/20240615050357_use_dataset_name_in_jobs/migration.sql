/*
  Warnings:

  - You are about to drop the column `datasetId` on the `jobs` table. All the data in the column will be lost.
  - Added the required column `datasetName` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "baseModel" TEXT NOT NULL,
    "datasetName" TEXT NOT NULL,
    "trainingMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "hyperparameters" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_jobs" ("baseModel", "createdAt", "hyperparameters", "id", "lastUpdatedAt", "name", "status", "taskId", "trainingMethod", "userId") SELECT "baseModel", "createdAt", "hyperparameters", "id", "lastUpdatedAt", "name", "status", "taskId", "trainingMethod", "userId" FROM "jobs";
DROP TABLE "jobs";
ALTER TABLE "new_jobs" RENAME TO "jobs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
