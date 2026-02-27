import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
// In a real app, this should be in .env.local: RESEND_API_KEY=re_...
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_dev');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderData } = body;

        if (!orderData || !orderData.customer || !orderData.customer.email) {
            return NextResponse.json(
                { error: 'Missing customer email or order data' },
                { status: 400 }
            );
        }

        const { customer, items, total, orderId, orderDate } = orderData;

        // Define the default admin email (this can be moved to env variables later)
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@premiumfoodorder.com';

        // 1. Send Email to Customer
        const customerEmailResponse = await resend.emails.send({
            from: 'Premium Food Order <orders@yourdomain.com>', // Replace with your verified domain
            to: customer.email,
            subject: `Order Confirmation #${orderId}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Thank you for your order, ${customer.name}!</h2>
                    <p>We have received your order <strong>#${orderId}</strong> for <strong>${new Date(orderDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>.</p>
                    
                    <h3>Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 2px solid #eee; text-align: left;">
                                <th style="padding: 8px 0;">Item</th>
                                <th style="padding: 8px 0;">Qty</th>
                                <th style="padding: 8px 0; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map((item: any) => `
                                <tr style="border-bottom: 1px solid #eee;">
                                    <td style="padding: 8px 0;">
                                        ${item.name}
                                        <br/>
                                        <small style="color: #666;">${item.specialInstructions || ''}</small>
                                    </td>
                                    <td style="padding: 8px 0;">${item.quantity}</td>
                                    <td style="padding: 8px 0; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2" style="padding: 16px 0 8px; font-weight: bold; text-align: right;">Total:</td>
                                <td style="padding: 16px 0 8px; font-weight: bold; text-align: right; color: #ff4757;">$${total.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    <p style="margin-top: 32px; color: #666; font-size: 14px;">If you have any questions, please contact us at support@yourdomain.com.</p>
                </div>
            `
        });

        // 2. Send Email to Admin (Hidden from customer)
        const adminEmailResponse = await resend.emails.send({
            from: 'Premium Food Order <orders@yourdomain.com>',
            to: ADMIN_EMAIL,
            subject: `NEW ORDER ALERT: #${orderId} from ${customer.name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #ff4757; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #ff4757; margin-top: 0;">New Order Received!</h2>
                    <p><strong>Order ID:</strong> #${orderId}</p>
                    <p><strong>Order Date:</strong> ${new Date(orderDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    <p><strong>Total:</strong> $${total.toFixed(2)}</p>
                    
                    <h3>Customer Details</h3>
                    <p>
                        Name: ${customer.name}<br/>
                        Email: ${customer.email}<br/>
                        Phone: ${customer.phone}
                    </p>
                    
                    <h3>Items</h3>
                    <ul>
                        ${items.map((item: any) => `
                            <li>${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)}) - <em>${item.specialInstructions || 'None'}</em></li>
                        `).join('')}
                    </ul>
                </div>
            `
        });

        // Check for errors in sending
        if (customerEmailResponse.error || adminEmailResponse.error) {
            console.error("Email Error:", customerEmailResponse.error || adminEmailResponse.error);
            return NextResponse.json({ error: 'Failed to send one or more emails' }, { status: 500 });
        }


        return NextResponse.json({
            success: true,
            message: 'Emails sent successfully',
            customerEmailId: customerEmailResponse.data?.id,
            adminEmailId: adminEmailResponse.data?.id
        });

    } catch (error) {
        console.error('Checkout API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error during checkout' },
            { status: 500 }
        );
    }
}
