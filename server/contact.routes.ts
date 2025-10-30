// contact.routes.ts
import express from "express";
import { collections } from "./database";

import { sendContactNotification } from "./mailer";

const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
    try {
        const newContact = req.body;
        newContact.contactDate = new Date(); // ensure timestamp
        newContact.status = [
            {
                code: "new",
                upDate: new Date(),
                message: "Initial contact",
                statusOwner: "system",
            },
        ];

        const result = await collections.contacts?.insertOne(newContact);
        if (!result?.acknowledged) {
            res.status(500).send("Failed to insert contact.");
            return;
        }

        await sendContactNotification(req.body); // send email after saving

        res.status(201).send(result);
    } catch (err) {
        console.error("Error inserting contact:", err);
        res.status(500).send("Something went wrong.");
    }
});

export default router;
