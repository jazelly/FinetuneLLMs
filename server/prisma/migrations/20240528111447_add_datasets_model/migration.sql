-- CreateTable
CREATE TABLE "datasets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT,
    "name" TEXT NOT NULL,
    "config" TEXT NOT NULL DEFAULT 'en',
    "split" TEXT NOT NULL DEFAULT 'train',
    "size" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "numRows" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
