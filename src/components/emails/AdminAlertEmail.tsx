import * as React from 'react';

interface AdminAlertEmailProps {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    orderId: number;
    orderDate: string;
    items: any[];
    total: number;
    transactionId: string;
}

export const AdminAlertEmail: React.FC<Readonly<AdminAlertEmailProps>> = ({
    customerName,
    customerEmail,
    customerPhone,
    orderId,
    orderDate,
    items,
    total,
    transactionId
}) => (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: '600px', margin: '0 auto', border: '4px solid #ff4757', padding: '40px', borderRadius: '24px', backgroundColor: '#111827', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: '#ff4757', fontSize: '28px', fontWeight: 900, margin: 0 }}>NEW SALE!</h2>
            <span style={{ backgroundColor: '#ff4757', color: 'white', padding: '4px 12px', borderRadius: '999px', fontWeight: 800, fontSize: '12px' }}>ACTION REQUIRED</span>
        </div>

        <div style={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>Transaction Details</h3>
            <p style={{ margin: '8px 0', fontSize: '16px' }}><strong>Order ID:</strong> #{orderId}</p>
            <p style={{ margin: '8px 0', fontSize: '16px' }}><strong>Transaction ID:</strong> {transactionId}</p>
            <p style={{ margin: '8px 0', fontSize: '16px' }}><strong>Status:</strong> <span style={{ color: '#10b981' }}>SUCCESS (PAID)</span></p>
            <p style={{ margin: '8px 0', fontSize: '16px' }}><strong>Order Date:</strong> {new Date(orderDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <p style={{ margin: '8px 0', fontSize: '24px', color: '#ff4757', fontWeight: 900 }}><strong>Amount: ${total.toFixed(2)}</strong></p>
        </div>

        <div style={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>Customer Information</h3>
            <p style={{ margin: '8px 0', fontSize: '16px' }}><strong>Name:</strong> {customerName}</p>
            <p style={{ margin: '8px 0', fontSize: '16px' }}><strong>Email:</strong> {customerEmail}</p>
            <p style={{ margin: '8px 0', fontSize: '16px' }}><strong>Phone:</strong> {customerPhone}</p>
        </div>

        <div style={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>Ordered Items</h3>
            {items.map((item, index) => (
                <div key={index} style={{ padding: '12px 0', borderBottom: '1px solid #374151' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700 }}>{item.quantity}x {item.name}</span>
                        <span style={{ color: '#ff4757', fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.specialInstructions && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>"{item.specialInstructions}"</p>
                    )}
                </div>
            ))}
        </div>

        <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '12px', marginTop: '32px' }}>
            Automated notification from Crave Premium Checkout Engine.
        </p>
    </div>
);
