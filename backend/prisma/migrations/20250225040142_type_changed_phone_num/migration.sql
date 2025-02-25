-- AlterTable
ALTER TABLE `Admin` MODIFY `phone_num` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Campaign` MODIFY `start_date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` MODIFY `phone_num` VARCHAR(191) NOT NULL;
