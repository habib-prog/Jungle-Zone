"use client";
import React, { useState, useEffect } from 'react';
import { Check, Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const SubscriptionPage = () => {
    const [selectedRole, setSelectedRole] = useState('parent');
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch('/api/parent/subscription');
                const { plans } = await response.json();
                setPlans(plans);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load subscription plans');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleSelectPlan = async (planId) => {
        try {
            // Check if user is authenticated
            const authResponse = await fetch('/api/parent/profile');
            if (!authResponse.ok) {
                toast.error('Please login to checkout');
                router.push('/login');
                return;
            }

            setCheckoutLoading(true);

            const response = await fetch('/api/payment/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId,
                    billingCycle: 'monthly',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { sessionId } = await response.json();

            const stripe = await import('@stripe/stripe-js').then(m => m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
            const result = await stripe.redirectToCheckout({ sessionId });

            if (result.error) {
                toast.error(result.error.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to process checkout');
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size={40} className="animate-spin text-brandColor" />
            </div>
        );
    }

    const filteredPlans = plans.filter(p => p.category === selectedRole || p.category === 'both');
    const parentPlans = filteredPlans.length > 0 ? filteredPlans : [];
    const monthlyPrice = parentPlans[0]?.price || 2.99;
    const yearlyPrice = monthlyPrice * 12 * 0.75;
    const savings = monthlyPrice * 12 - yearlyPrice;

    const data = {
        parent: {
            name: 'Parent',
            icon: '👨‍👩‍👧',
            features: [
                'Find trusted babysitters near you',
                'UNLIMITED babysitter searches',
                'Background checks & verified profiles',
                'Cancellation protection',
            ],
        },
        babysitter: {
            name: 'Babysitter',
            icon: '👩‍🍼',
            features: [
                'Get hired by families',
                'Build your reputation',
            ],
        },
    };

    return (
        <section className="min-h-screen pt-30 pb-12 lg:pt-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Select your role to see the subscription options available.
                    </p>
                </div>

                {/* Role Selector */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-1 inline-flex">
                        {Object.keys(data).map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${selectedRole === role
                                        ? 'bg-brandColor text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="text-xl">{data[role].icon}</span>
                                <span>{data[role].name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Monthly Card */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 border-2 border-brandColor">
                        <div className="bg-brandColor p-6 text-white text-center">
                            <h3 className="text-xl font-bold mb-1">Monthly</h3>
                            <p className="opacity-90 text-sm">Pay month-to-month</p>
                        </div>
                        <div className="p-8 text-center">
                            <div className="flex items-center justify-center baseline mb-4">
                                <span className="text-5xl font-bold text-gray-900">
                                    £{monthlyPrice.toFixed(2)}
                                </span>
                                <span className="text-gray-500 text-lg ml-1">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {data[selectedRole].features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="mt-0.5 w-5 h-5 rounded-full bg-[#e8f5e9] flex items-center justify-center shrink-0">
                                            <Check size={14} className="text-brandColor" />
                                        </div>
                                        <span className="text-gray-600 text-sm leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleSelectPlan(parentPlans[0]?._id)}
                                disabled={checkoutLoading || !parentPlans[0]}
                                className="w-full bg-brandColor text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#558b2f] transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {checkoutLoading && <Loader size={20} className="animate-spin" />}
                                {checkoutLoading ? 'Processing...' : 'Choose Monthly'}
                            </button>
                        </div>
                    </div>

                    {/* Yearly Card */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 relative">
                        {/* Best Value Badge */}
                        <div className="absolute top-0 right-0 bg-[#ff5722] text-white px-5 py-2 rounded-bl-xl text-sm font-bold z-20 shadow-lg flex items-center gap-1.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff5722] focus-visible:ring-opacity-50 transform hover:scale-105 transition-all duration-300">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            <span>Most Popular</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="bg-linear-to-r from-[#ff9800] to-[#ffb74d] p-6 text-white text-center">
                            <h3 className="text-xl font-bold mb-1">Yearly</h3>
                            <p className="opacity-90 text-sm">Billed annually (25% off)</p>
                        </div>
                        <div className="p-8 text-center">
                            <div className="flex items-center justify-center baseline mb-2">
                                <span className="text-5xl font-bold text-gray-900">
                                    £{yearlyPrice.toFixed(2)}
                                </span>
                                <span className="text-gray-500 text-lg ml-1">/year</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-4">
                                £{(yearlyPrice / 12).toFixed(2)} per month
                            </p>
                            <div className="mb-4 inline-flex items-center gap-1 bg-green-100 text-brandColor px-3 py-1 rounded-full text-sm font-medium">
                                <Check size={16} />
                                You save £{savings.toFixed(2)}!
                            </div>
                            <ul className="space-y-3 mb-8">
                                {data[selectedRole].features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="mt-0.5 w-5 h-5 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                                            <Check size={14} className="text-brandColor" />
                                        </div>
                                        <span className="text-gray-600 text-sm leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleSelectPlan(parentPlans[0]?._id)}
                                disabled={checkoutLoading || !parentPlans[0]}
                                className="w-full bg-[#ff9800] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#f57c00] transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {checkoutLoading && <Loader size={20} className="animate-spin" />}
                                {checkoutLoading ? 'Processing...' : 'Choose Yearly'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SubscriptionPage;
