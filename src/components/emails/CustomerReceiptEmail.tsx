import * as React from 'react';

interface CustomerReceiptEmailProps {
    customerName: string;
    orderId: number;
    orderDate: string;
    items: any[];
    total: number;
    transactionId: string;
}

export const CustomerReceiptEmail: React.FC<Readonly<CustomerReceiptEmailProps>> = ({
    customerName,
    orderId,
    orderDate,
    items,
    total,
    transactionId
}) => (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', color: '#1a1a1a', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 900, margin: 0, color: '#ff4757' }}>CRAVE</h1>
            <p style={{ color: '#71717a', marginTop: '8px' }}>Premium Food Delivery</p>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>Order Confirmed!</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#4b5563', marginBottom: '32px' }}>
            Hi {customerName}, your order <strong>#{orderId}</strong> has been received and is being prepared for <strong>{new Date(orderDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>.
        </p>

        <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>Order Summary</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '0 0 12px 0' }}>Item</th>
                        <th style={{ padding: '0 0 12px 0', textAlign: 'center' }}>Qty</th>
                        <th style={{ padding: '0 0 12px 0', textAlign: 'right' }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td style={{ padding: '12px 0', fontWeight: 600, fontSize: '14px', borderTop: '1px solid #f3f4f6' }}>
                                {item.name}
                                {item.specialInstructions && (
                                    <>
                                        <br />
                                        <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 400, fontStyle: 'italic' }}>"{item.specialInstructions}"</span>
                                    </>
                                )}
                            </td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontSize: '14px', borderTop: '1px solid #f3f4f6' }}>{item.quantity}</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600, fontSize: '14px', borderTop: '1px solid #f3f4f6' }}>${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={2} style={{ padding: '20px 0 0 0', fontWeight: 700, textAlign: 'right', fontSize: '14px', color: '#71717a' }}>Subtotal</td>
                        <td style={{ padding: '20px 0 0 0', textAlign: 'right', fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>${((total / 1.08875)).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{ padding: '8px 0 0 0', fontWeight: 700, textAlign: 'right', fontSize: '14px', color: '#71717a' }}>Tax (8.875%)</td>
                        <td style={{ padding: '8px 0 0 0', textAlign: 'right', fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>${(total - (total / 1.08875)).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{ padding: '16px 0 0 0', fontWeight: 900, textAlign: 'right', fontSize: '20px', color: '#1a1a1a' }}>Total</td>
                        <td style={{ padding: '16px 0 0 0', textAlign: 'right', fontWeight: 900, fontSize: '20px', color: '#ff4757' }}>${total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px' }}>
            <p>Order ID: #{orderId} | Transaction: {transactionId}</p>
            <p style={{ marginTop: '24px' }}>&copy; {new Date().getFullYear()} Crave Premium Food Delivery. All rights reserved.</p>
        </div>
    </div>
);
