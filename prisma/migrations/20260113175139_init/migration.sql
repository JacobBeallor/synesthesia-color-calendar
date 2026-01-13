-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monthsJson" TEXT NOT NULL,
    "daysOfMonthJson" TEXT NOT NULL,
    "daysOfWeekJson" TEXT NOT NULL
);
