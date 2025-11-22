const prisma = new (require('@prisma/client').PrismaClient)();
const midtransClient = require('midtrans-client');

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

        let newStatus = "PENDING";

        if (status === "capture" && notif.fraud_status === "accept")
            newStatus = "APPROVED";

        if (status === "settlement")
            newStatus = "APPROVED";

        if (status === "expire")
            newStatus = "EXPIRED";

        if (status === "deny")
            newStatus = "REJECTED";

        if (status === "cancel")
            newStatus = "CANCELLED";

        await prisma.registration.update({
            where: { orderId },
            data: { status: newStatus }
        });

        return res.json({ message: "OK" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

