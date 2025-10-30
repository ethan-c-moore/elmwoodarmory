import nodemailer from 'nodemailer';
import {CartItem} from "./cart.model";

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_APP_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
        servername: 'smtp.gmail.com',
        rejectUnauthorized: process.env.PAYPAL_ENVIRONMENT !== 'SANDBOX',
    }
});

export function sendContactNotification(contactData: any) {
    const { contactInfo, request } = contactData;

    const pieceTypeLine = request.pieceType
        ? `\nPiece Type: ${request.pieceType}`
        : '';

    const recipients = process.env.GMAIL_APP_RECEIVERS?.split(',').map(email => email.trim()) || [];

    const mailOptions = {
        from: process.env.GMAIL_APP_USER,
        to: recipients,
        subject: 'New Contact Form Submission',
        text: `
New contact request from ${contactInfo.firstName} ${contactInfo.lastName}
Request Type: ${request.requestType}${pieceTypeLine}
Message: ${request.message}
Contact via: ${contactInfo.contactType} (${contactInfo.contactValue})
    `.trim()
    };

    return transporter.sendMail(mailOptions);
}

export function sendOrderConfirmation(cart: CartItem[], orderData: any) {
    // Admin recipients from env (comma-separated)
    const adminRecipients =
        process.env.GMAIL_APP_RECEIVERS?.split(',').map(e => e.trim()).filter(Boolean) || [];

    // Try to find a customer email
    const customerEmail = orderData.email;

    // Build a unique recipients list (user + admins)
    const toRecipients = Array.from(new Set([customerEmail, ...adminRecipients].filter(Boolean))) as string[];

    // Basic order/capture info
    const tx = orderData.apiRef.payment;

    const status = tx.status;

    const amountVal = orderData.apiRef.payment.amount.value;

    const currency = orderData.apiRef.payment.amount.currency;

    // Totals (fallback to computing from cart if not provided)
    const subtotal = Number(orderData?.totals?.subtotal ?? cart.reduce((s, it) => s + Number(it.finalPrice), 0));
    const shipping = Number(orderData?.totals?.shipping) ?? Number(['84074', '84029', '84701'].includes(orderData.shipping.postalCode.toString()) ? 0 : cart.length * 11);
    const total = Number(orderData?.totals?.total ?? (subtotal + shipping));

    const fmt = (n: number | string) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(Number(n || 0));

    // Addresses (defensive formatting)
    const addr = (a?: any) => {
        if (!a) return 'N/A';
        const lines = [
            [a.firstName, a.lastName].filter(Boolean).join(' ') || null,
            a.addressLine1 || null,
            a.addressLine2 || null,
            [a.adminArea2, a.adminArea1, a.postalCode].filter(Boolean).join(', ') || null,
            a.countryCode || null,
        ].filter(Boolean);
        return lines.join('\n');
    };

    const shippingAddr = addr(orderData?.shipping);
    const billingAddr  = addr(orderData?.billing);

    // Cart table (HTML)
    const cartRowsHTML = cart.map(it => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">
        ${escapeHtml(it.name)}
        ${Object.entries(it.selectedOptions || {})
            .map(([key, value]) => `<br><small><i>${escapeHtml(key)}: ${escapeHtml(value)}</i></small>`)
            .join('')}
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${Number(it.quantity || 1)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${fmt(it.finalPrice)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${fmt(Number(it.finalPrice) * Number(it.quantity || 1))}</td>
    </tr>
  `).join('');

    // Cart (text)
    const cartLinesText = cart.map(it =>
        `- ${it.name} x${Number(it.quantity || 1)} @ ${fmt(it.finalPrice)} = ${fmt(Number(it.finalPrice) * Number(it.quantity || 1))}`
    ).join('\n');

    const subject = `Order Confirmation ${tx.orderId !== 'N/A' ? `– ${tx.orderId}` : ''}`;

    const html = `
<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#222;">
  <h2 style="margin:0 0 8px;">Order received!</h2>
  <p style="margin:0 0 16px;">Thanks for your purchase. Your payment has been processed${status ? ` (<b>${escapeHtml(status)}</b>)` : ''}.
  ${tx && tx !== 'N/A' ? `Transaction ID: <b>${escapeHtml(tx)}</b>.` : ''}</p>

  <h3 style="margin:16px 0 8px;">Order Summary</h3>
  <table style="border-collapse:collapse;width:100%;max-width:680px;">
    <thead>
      <tr>
        <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #ddd;">Item</th>
        <th style="text-align:right;padding:8px 12px;border-bottom:2px solid #ddd;">Qty</th>
        <th style="text-align:right;padding:8px 12px;border-bottom:2px solid #ddd;">Price</th>
        <th style="text-align:right;padding:8px 12px;border-bottom:2px solid #ddd;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${cartRowsHTML || `<tr><td colspan="4" style="padding:8px 12px;">(No items)</td></tr>`}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" style="padding:8px 12px;text-align:right;">Subtotal</td>
        <td style="padding:8px 12px;text-align:right;"><b>${fmt(subtotal)}</b></td>
      </tr>
      <tr>
        <td colspan="3" style="padding:8px 12px;text-align:right;">Shipping</td>
        <td style="padding:8px 12px;text-align:right;"><b>${fmt(shipping)}</b></td>
      </tr>
      <tr>
        <td colspan="3" style="padding:8px 12px;text-align:right;border-top:2px solid #ddd;">Total</td>
        <td style="padding:8px 12px;text-align:right;border-top:2px solid #ddd;"><b>${fmt(total)}</b></td>
      </tr>
    </tfoot>
  </table>

  <div style="display:flex;gap:24px;margin-top:16px;">
    <div>
      <h4 style="margin:16px 0 4px;">Shipping Address</h4>
      <pre style="margin:0;background:#f7f7f7;padding:8px 10px;border-radius:8px;border:1px solid #eee;">${escapeHtml(shippingAddr)}</pre>
    </div>
    <div>
      <h4 style="margin:16px 0 4px;">Billing Address</h4>
      <pre style="margin:0;background:#f7f7f7;padding:8px 10px;border-radius:8px;border:1px solid #eee;">${escapeHtml(billingAddr)}</pre>
    </div>
  </div>

  ${amountVal ? `<p style="margin-top:16px;">Captured amount: <b>${fmt(amountVal)}</b></p>` : ''}

  <p style="margin-top:16px;color:#666;font-size:12px;">If you have any questions, reply to this email and include your transaction ID.</p>
</div>
  `.trim();

    const text = `
Order received!

Status: ${status}
${tx.orderId && tx.orderId !== 'N/A' ? `Transaction ID: ${tx.orderId}\n` : ''}

Order Summary
${cartLinesText || '(No items)'}
Subtotal: ${fmt(subtotal)}
Shipping: ${fmt(shipping)}
Total:    ${fmt(total)}

Shipping Address
${shippingAddr}

Billing Address
${billingAddr}

${amountVal ? `Captured Amount: ${fmt(amountVal)}\n` : ''}
If you have questions, reply to this email and include your transaction ID.
  `.trim();

    const mailOptions = {
        from: process.env.GMAIL_APP_USER,
        to: toRecipients, // user + admins
        subject,
        text,
        html,
    };

    // Return the Promise from nodemailer so caller can await/handle errors
    return transporter.sendMail(mailOptions);
}

/** Helpers */
function escapeHtml(s: any): string {
    if (!s && s !== 0) return '';
    return String(s)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}