import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { CustomerReceiptEmail } from '@/components/emails/CustomerReceiptEmail';
import { AdminAlertEmail } from '@/components/emails/AdminAlertEmail';

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

        // The user specifically requested this admin email address
        const ADMIN_EMAIL = 'batchunaveen6@gmail.com';

        // Create a fake transaction ID for the report
        const transactionId = `txn_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

        // 1. Send Email to Customer
        const customerEmailResponse = await resend.emails.send({
            from: 'Crave Premium <onboarding@resend.dev>', // Resend requires this for free unverified accounts
            to: customer.email,
            subject: `Order Confirmation #${orderId}`,
            react: <CustomerReceiptEmail
                customerName={customer.name}
                orderId={orderId}
                orderDate={orderDate}
                items={items}
                total={total}
                transactionId={transactionId}
            />
        });

        // 2. Send Email to Admin (Hidden from customer)
        const adminEmailResponse = await resend.emails.send({
            from: 'Crave Admin <onboarding@resend.dev>',
            to: ADMIN_EMAIL,
            subject: `🚀 UNQUE ORDER: #${orderId} | $${total.toFixed(2)}`,
            react: <AdminAlertEmail
                customerName={customer.name}
                customerEmail={customer.email}
                customerPhone={customer.phone}
                orderId={orderId}
                orderDate={orderDate}
                items={items}
                total={total}
                transactionId={transactionId}
            />
        });

        // Log detailed error from Resend to the Terminal
        if (customerEmailResponse.error) {
            console.error("🔴 CUSTOMER Email Error:", JSON.stringify(customerEmailResponse.error, null, 2));
        }
        if (adminEmailResponse.error) {
            console.error("🔴 ADMIN Email Error:", JSON.stringify(adminEmailResponse.error, null, 2));
        }

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
