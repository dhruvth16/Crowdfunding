/*
  Warnings:

  - You are about to alter the column `category` on the `Campaign` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Campaign` MODIFY `category` ENUM('EDUCATION', 'HEALTH', 'DISASTER_RELIEF', 'ORPHANAGE') NOT NULL;
