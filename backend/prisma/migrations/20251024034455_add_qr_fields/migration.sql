-- AlterTable
ALTER TABLE `Event` ADD COLUMN `qrCode` VARCHAR(191) NULL,
    ADD COLUMN `qrExpiresAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Registration` ADD COLUMN `checkedInAt` DATETIME(3) NULL;
