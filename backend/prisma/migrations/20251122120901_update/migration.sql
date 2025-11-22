/*
  Warnings:

  - You are about to drop the column `paymentProofUrl` on the `Registration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.
  - Made the column `status` on table `Registration` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Registration` DROP COLUMN `paymentProofUrl`,
    ADD COLUMN `orderId` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX `Registration_orderId_key` ON `Registration`(`orderId`);
