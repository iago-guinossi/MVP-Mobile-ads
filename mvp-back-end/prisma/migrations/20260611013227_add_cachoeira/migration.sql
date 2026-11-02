-- CreateTable
CREATE TABLE "Cachoeira" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "location" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ImagemCachoeira" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "src" TEXT NOT NULL,
    "cachoiraId" INTEGER NOT NULL,
    CONSTRAINT "ImagemCachoeira_cachoiraId_fkey" FOREIGN KEY ("cachoiraId") REFERENCES "Cachoeira" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
