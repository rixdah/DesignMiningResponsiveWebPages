CREATE TABLE "Website" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "screenshot" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL
);

CREATE TABLE "Element" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "website" INTEGER NOT NULL REFERENCES "Website" ("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "x" INTEGER,
    "y" INTEGER,
    "width" INTEGER,
    "height" INTEGER
);