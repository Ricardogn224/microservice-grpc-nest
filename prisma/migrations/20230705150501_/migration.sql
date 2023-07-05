/*
  Warnings:

  - Added the required column `name` to the `Hero` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Hero` ADD COLUMN `hp` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `power` INTEGER NOT NULL DEFAULT 0;
