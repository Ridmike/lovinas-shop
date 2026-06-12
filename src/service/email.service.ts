import { Resend } from "resend";
import type { Order } from "@/types/order";

const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || "orders@lovinas-shop.com";

/**
 * Get Resend client - instantiated only when needed
 */
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

/**
 * Generate branded HTML email template for order confirmation
 */
function generateOrderConfirmationHTML(order: Order): string {
  const itemsHTML = order.items
    .map(
      (item) =>
        `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; font-size: 14px;">
        ${item.name}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right;">
        ₹${item.price.toLocaleString()}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right;">
        ₹${item.subtotal.toLocaleString()}
      </td>
    </tr>
  `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Lovina's Shop</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      margin: 5px 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px 20px;
    }
    .order-number {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      border-left: 4px solid #667eea;
    }
    .order-number h3 {
      margin: 0 0 5px;
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .order-number p {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #667eea;
    }
    .section {
      margin-bottom: 25px;
    }
    .section h3 {
      margin: 0 0 12px;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section p {
      margin: 0 0 8px;
      font-size: 14px;
      color: #666;
    }
    .section p strong {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    table th {
      background: #f5f5f5;
      padding: 12px 8px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #333;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .summary {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 6px;
      margin-top: 20px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .summary-row:last-child {
      margin-bottom: 0;
    }
    .summary-row.total {
      border-top: 2px solid #e0e0e0;
      padding-top: 10px;
      font-weight: 600;
      font-size: 16px;
      color: #667eea;
    }
    .payment-info {
      background: #e8f5e9;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #4caf50;
      margin-top: 20px;
    }
    .payment-info p {
      margin: 0;
      font-size: 14px;
      color: #2e7d32;
    }
    .footer {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      padding: 12px 30px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      margin-top: 20px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ Order Confirmed</h1>
      <p>Thank you for your purchase at Lovina's Shop!</p>
    </div>

    <div class="content">
      <div class="order-number">
        <h3>Order Number</h3>
        <p>${order.orderNumber}</p>
      </div>

      <div class="section">
        <h3>📦 Order Details</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>

      <div class="summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>₹${order.subtotal.toLocaleString()}</span>
        </div>
        ${order.tax > 0 ? `<div class="summary-row"><span>Tax:</span><span>₹${order.tax.toLocaleString()}</span></div>` : ""}
        <div class="summary-row total">
          <span>Total:</span>
          <span>₹${order.total.toLocaleString()}</span>
        </div>
      </div>

      <div class="payment-info">
        <p><strong>💳 Payment Method:</strong> Cash on Delivery (COD)</p>
        <p style="margin-top: 5px;">Payment will be collected at the time of delivery.</p>
      </div>

      <div class="section">
        <h3>📍 Delivery Address</h3>
        <p>
          <strong>${order.customer.fullName}</strong><br>
          ${order.customer.address}<br>
          ${order.customer.city}<br>
          <strong>Phone:</strong> ${order.customer.phone}
        </p>
        ${
          order.customer.notes
            ? `<p><strong>Special Instructions:</strong><br>${order.customer.notes}</p>`
            : ""
        }
      </div>

      <div class="section">
        <h3>❓ What's Next?</h3>
        <p>
          ✓ Your order has been received and is being prepared<br>
          ✓ You'll receive a shipment confirmation email with tracking details<br>
          ✓ Our team will contact you at <strong>${order.customer.phone}</strong> to confirm delivery
        </p>
      </div>

      <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://lovinas-shop.com"}/order-success/${order.id}" class="button">View Order Details</a>
    </div>

    <div class="footer">
      <p>
        <strong>Lovina's Shop</strong> | Curated Gifts, Hampers & Craft Supplies<br>
        <em>Thank you for supporting small business!</em>
      </p>
      <p style="margin-top: 10px; color: #999;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping email");
    return;
  }

  try {
    const htmlContent = generateOrderConfirmationHTML(order);

    await resend.emails.send({
      from: SENDER_EMAIL,
      to: order.customer.email,
      subject: `Order Confirmation - ${order.orderNumber} | Lovina's Shop`,
      html: htmlContent,
    });

    console.log(`Order confirmation email sent to ${order.customer.email}`);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw new Error("Failed to send confirmation email");
  }
}

/**
 * Send order notification to admin
 */
export async function sendAdminNotificationEmail(order: Order): Promise<void> {
  const resend = getResendClient();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!resend || !adminEmail) {
    console.warn("RESEND_API_KEY or ADMIN_EMAIL not configured, skipping admin notification");
    return;
  }

  try {
    const itemsList = order.items
      .map(
        (item) =>
          `• ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`,
      )
      .join("\n");

    const plainText = `
New Order Received!

Order Number: ${order.orderNumber}
Customer: ${order.customer.fullName}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
Address: ${order.customer.address}, ${order.customer.city}

Items:
${itemsList}

Total: ₹${order.total.toLocaleString()}
Payment Method: ${order.paymentMethod}
Payment Status: ${order.paymentStatus}

Special Instructions: ${order.customer.notes || "None"}

Order Time: ${new Date(order.createdAt).toLocaleString()}
    `.trim();

    await resend.emails.send({
      from: SENDER_EMAIL,
      to: adminEmail,
      subject: `New Order: ${order.orderNumber} | Lovina's Shop`,
      text: plainText,
    });

    console.log(`Admin notification sent to ${adminEmail}`);
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    // Don't throw - admin notification failure shouldn't block order creation
  }
}
