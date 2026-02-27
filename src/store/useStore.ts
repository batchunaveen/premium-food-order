import { create } from 'zustand';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    specialInstructions?: string;
    customization?: string;
}

export interface CustomerInfo {
    fullName: string;
    email: string;
    phoneNumber: string;
}

interface AppState {
    cart: CartItem[];
    selectedDate: Date | null;
    selectedLocation: string | null;
    customerInfo: CustomerInfo | null;
    isCheckoutOpen: boolean;

    // Actions
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, specialInstructions?: string) => void;
    updateQuantity: (id: string, quantity: number, specialInstructions?: string) => void;
    clearCart: () => void;

    setSelectedDate: (date: Date | null) => void;
    setSelectedLocation: (location: string) => void;
    setCustomerInfo: (info: CustomerInfo) => void;
    setIsCheckoutOpen: (isOpen: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
    cart: [],
    selectedDate: null,
    selectedLocation: null,
    customerInfo: null,
    isCheckoutOpen: false,

    addToCart: (item) =>
        set((state) => {
            const existingItem = state.cart.find(
                (i) => i.id === item.id && i.specialInstructions === item.specialInstructions
            );
            if (existingItem) {
                return {
                    cart: state.cart.map((i) =>
                        i.id === item.id && i.specialInstructions === item.specialInstructions
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    ),
                };
            }
            return { cart: [...state.cart, item] };
        }),

    removeFromCart: (id, specialInstructions) =>
        set((state) => ({
            cart: state.cart.filter(
                (i) => !(i.id === id && i.specialInstructions === specialInstructions)
            ),
        })),

    updateQuantity: (id, quantity, specialInstructions) =>
        set((state) => ({
            cart: quantity === 0
                ? state.cart.filter(
                    (i) => !(i.id === id && i.specialInstructions === specialInstructions)
                )
                : state.cart.map((i) =>
                    i.id === id && i.specialInstructions === specialInstructions
                        ? { ...i, quantity }
                        : i
                ),
        })),

    clearCart: () => set({ cart: [] }),

    setSelectedDate: (date) => set({ selectedDate: date }),
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    setCustomerInfo: (info) => set({ customerInfo: info }),
    setIsCheckoutOpen: (isOpen) => set({ isCheckoutOpen: isOpen }),
}));
