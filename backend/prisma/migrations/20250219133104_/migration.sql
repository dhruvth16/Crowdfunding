/*
  Warnings:

  - You are about to drop the column `end_date` on the `Campaign` table. All the data in the column will be lost.
  - The values [EXPIRED] on the enum `Campaign_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Campaign` DROP COLUMN `end_date`,
    MODIFY `status` ENUM('ACTIVE', 'COMPLETED') NOT NULL;
