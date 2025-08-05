-- AlterTable
ALTER TABLE `event` MODIFY `flyerUrl` VARCHAR(191) NULL,
    MODIFY `certificateTemplateUrl` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
