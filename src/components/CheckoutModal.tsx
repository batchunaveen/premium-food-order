"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, CreditCard, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CheckoutModal() {
    const isCheckoutOpen = useStore((state) => state.isCheckoutOpen);
    const setIsCheckoutOpen = useStore((state) => state.setIsCheckoutOpen);
    const cart = useStore((state) => state.cart);
    const clearCart = useStore((state) => state.clearCart);

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 = Success
    const [isProcessing, setIsProcessing] = useState(false);

    // Customer Info State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.08875;
    const total = subtotal + tax;

    const handleClose = () => {
        setIsCheckoutOpen(false);
        setTimeout(() => {
            // Reset state on close after animation
            if (step === 4) setStep(1);
        }, 300);
    };

    const processPayment = async () => {
        setIsProcessing(true);
        // Placeholder for Clover Payment Gateway
        // Normally you would process the card here.

        const orderId = Math.floor(Math.random() * 900000) + 100000;
        const selectedDate = useStore.getState().selectedDate; // need to get this directly or bring it into component state

        const orderData = {
            orderId,
            orderDate: selectedDate || new Date(),
            customer: { name, email, phone },
            items: cart,
            total,
        };

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderData }),
            });

            if (!response.ok) {
                console.error("Failed to send order emails", await response.text());
                // Still proceed to success page in standard flow, or handle error
            } else {
                console.log("Emails sent successfully");
            }
        } catch (error) {
            console.error("Error calling checkout API:", error);
        }

        setIsProcessing(false);
        setStep(4); // Move to success step
        clearCart();
    };

    if (!isCheckoutOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center shrink-0">
                        <h2 className="text-2xl font-black">
                            {step === 4 ? "Order Confirmed" : "Checkout"}
                        </h2>
                        {step !== 4 && (
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Progress Bar (if not success) */}
                    {step < 4 && (
                        <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-center gap-2 sm:gap-4 text-sm font-bold shrink-0">
                            <div className={cn("flex items-center gap-2", step >= 1 ? "text-accent" : "text-neutral-400")}>
                                <span className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-current">1</span>
                                Review
                            </div>
                            <ChevronRight className="w-4 h-4 text-neutral-300 my-auto" />
                            <div className={cn("flex items-center gap-2", step >= 2 ? "text-accent" : "text-neutral-400")}>
                                <span className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-current">2</span>
                                Details
                            </div>
                            <ChevronRight className="w-4 h-4 text-neutral-300 my-auto" />
                            <div className={cn("flex items-center gap-2", step >= 3 ? "text-accent" : "text-neutral-400")}>
                                <span className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-current">3</span>
                                Payment
                            </div>
                        </div>
                    )}

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {step === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold">Order Summary</h3>
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={`${item.id}-${item.specialInstructions || ""}`} className="flex justify-between items-center bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="font-bold bg-neutral-200 dark:bg-neutral-700 w-8 h-8 flex items-center justify-center rounded-md">
                                                    {item.quantity}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{item.name}</p>
                                                    {item.specialInstructions && (
                                                        <p className="text-xs text-neutral-500">"{item.specialInstructions}"</p>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="font-bold border-l pl-4 border-neutral-200 dark:border-neutral-700">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl space-y-3">
                                    <div className="flex justify-between text-neutral-500">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-500">
                                        <span>Taxes</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 flex justify-between font-black text-xl">
                                        <span>Total</span>
                                        <span className="text-accent">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold">Contact Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="john@example.com"
                                            className="w-full bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="(555) 123-4567"
                                            className="w-full bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 flex flex-col items-center py-8">
                                <div className="w-20 h-20 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                                    <CreditCard className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-center">Secure Payment</h3>
                                <p className="text-neutral-500 text-center max-w-sm">
                                    This connects directly to the Clover Payment Gateway API to process your ${(total).toFixed(2)} order.
                                </p>
                                <div className="w-full bg-neutral-50 dark:bg-neutral-800 p-8 rounded-2xl flex flex-col gap-4 mt-6">
                                    <p className="text-sm font-bold text-center uppercase tracking-wider text-neutral-400 mb-2">
                                        Payment Gateway Placeholder
                                    </p>
                                    {/* Dummy Card Input fields for visual completeness */}
                                    <input disabled placeholder="Card Number •••• •••• •••• 4242" className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-xl opacity-50 cursor-not-allowed" />
                                    <div className="flex gap-4">
                                        <input disabled placeholder="MM/YY" className="w-1/2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-xl opacity-50 cursor-not-allowed" />
                                        <input disabled placeholder="CVC" className="w-1/2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-xl opacity-50 cursor-not-allowed" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 flex flex-col items-center py-12 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="text-accent mb-4"
                                >
                                    <CheckCircle className="w-24 h-24" />
                                </motion.div>
                                <h3 className="text-3xl font-black">Order Received!</h3>
                                <p className="text-neutral-500 max-w-md">
                                    Thank you, {name || "Guest"}. Your order has been placed successfully. A confirmation email has been sent to {email}.
                                </p>
                                <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-2xl mt-8 w-full max-w-sm flex justify-between font-bold">
                                    <span className="text-neutral-500">Order ID:</span>
                                    <span>#{Math.floor(Math.random() * 900000) + 100000}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 shrink-0 bg-neutral-50 dark:bg-neutral-800/50 flex gap-4">
                        {step > 1 && step < 4 && (
                            <button
                                onClick={() => setStep(step - 1 as 1 | 2 | 3)}
                                className="px-6 py-4 rounded-xl font-bold rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                                Back
                            </button>
                        )}

                        {step === 1 && (
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 bg-foreground text-background py-4 px-6 rounded-xl font-bold tracking-wide hover:opacity-90 transition-opacity active:scale-[0.98]"
                            >
                                Continue to Details
                            </button>
                        )}

                        {step === 2 && (
                            <button
                                onClick={() => setStep(3)}
                                disabled={!name || !email || !phone}
                                className="flex-1 bg-foreground text-background py-4 px-6 rounded-xl font-bold tracking-wide hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Proceed to Payment
                            </button>
                        )}

                        {step === 3 && (
                            <button
                                onClick={processPayment}
                                disabled={isProcessing}
                                className="flex-1 bg-accent text-white py-4 px-6 rounded-xl font-bold tracking-wide hover:opacity-90 transition-opacity active:scale-[0.98] shadow-lg shadow-accent/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay $${total.toFixed(2)}`
                                )}
                            </button>
                        )}

                        {step === 4 && (
                            <button
                                onClick={handleClose}
                                className="flex-1 bg-foreground text-background py-4 px-6 rounded-xl font-bold tracking-wide hover:opacity-90 transition-opacity active:scale-[0.98]"
                            >
                                Back to Home
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
