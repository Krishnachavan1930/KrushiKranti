export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const initializeRazorpayPayment = async (options: {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
    handler: (response: any) => void;
    modal?: {
        ondismiss: () => void;
    };
}) => {
    const res = await loadRazorpayScript();

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
};
