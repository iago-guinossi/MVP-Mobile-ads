/*
  Warnings:

  - You are about to drop the column `url` on the `ImagemTrilha` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `Trilha` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Trilha` table. All the data in the column will be lost.
  - Added the required column `src` to the `ImagemTrilha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance` to the `Trilha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Trilha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Trilha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Trilha` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ImagemTrilha" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "src" TEXT NOT NULL,
    "trilhaId" INTEGER NOT NULL,
    CONSTRAINT "ImagemTrilha_trilhaId_fkey" FOREIGN KEY ("trilhaId") REFERENCES "Trilha" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ImagemTrilha" ("id", "trilhaId") SELECT "id", "trilhaId" FROM "ImagemTrilha";
DROP TABLE "ImagemTrilha";
ALTER TABLE "new_ImagemTrilha" RENAME TO "ImagemTrilha";
CREATE TABLE "new_Trilha" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "distance" TEXT NOT NULL,
    "location" TEXT NOT NULL
);
INSERT INTO "new_Trilha" ("id") SELECT "id" FROM "Trilha";
DROP TABLE "Trilha";
ALTER TABLE "new_Trilha" RENAME TO "Trilha";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
