const prisma = new (require('@prisma/client').PrismaClient)();
const midtransClient = require('midtrans-client');
const registrationService = require('../services/registration.service');

const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.notification = async (req, res) => {
    try {
        const notif = await core.transaction.notification(req.body);

        const orderId = notif.order_id;
        const status = notif.transaction_status;
        const fraud = notif.fraud_status;

        let newStatus = "PENDING";

        if (status === "capture") {
            if (fraud === "accept") newStatus = "APPROVED";
            else newStatus = "PENDING";
        }

        if (status === "settlement") newStatus = "APPROVED";
        if (status === "deny") newStatus = "REJECTED";
        if (status === "expire") newStatus = "EXPIRED";
        if (status === "cancel") newStatus = "CANCELLED";

        const registration = await prisma.registration.findFirst({
            where: { orderId }
        });

        if (!registration) {
            console.error("Registration not found for:", orderId);
            return res.json({ status: "OK" });
        }

        await registrationService.updatePaymentStatus(registration.id, newStatus);

        return res.json({ status: "OK" });

    } catch (err) {
        console.error("❌ Notification Error:", err);
        return res.json({ status: "OK" });
    }
};



