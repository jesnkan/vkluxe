import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CreditCard, Truck, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/orderStore';
import { useProductStore } from '../stores/productStore';
import { ToastContainer, useToast } from '../components';
import type { ViewState, Order } from '../types';

interface CheckoutViewProps {
  onNavigate: (view: ViewState) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onNavigate }) => {
  const { cart, clearCart, getSubtotal, getDelivery, getTotal } = useCartStore();
  const { addOrder } = useOrderStore();
  const { decrementStock } = useProductStore();
  const toast = useToast(); 
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const subtotal = getSubtotal();
  const delivery = getDelivery();
  const total = getTotal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    const { email, firstName, lastName, address, city, zip } = formData;
    return email && firstName && lastName && address && city && zip;
  };

  const validateStep2 = () => {
    const { cardNumber, expiry, cvv } = formData;
    return cardNumber.length >= 16 && expiry && cvv.length >= 3;
  };

  const handleCheckout = async () => {
    if (!validateStep2()) {
      alert('Please provide valid payment details.');
      return;
    }

    setIsProcessing(true);
    
    // Create actual order in store
    const newOrder: Order = {
      id: `VK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      items: [...cart],
      total: total,
      status: 'Pending',
      date: new Date().toISOString()
    };

    try {
      // Simulate network delay for "payment processing"
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Decrement stock for each item sequentially (or in parallel)
      await Promise.all(cart.map(item => decrementStock(item.id, item.quantity)));

      // Add order to Supabase
      await addOrder(newOrder);

      clearCart();
      setIsProcessing(false);
      onNavigate('checkout-success');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('There was an issue processing your acquisition. Please try again.');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isProcessing) {
    onNavigate('cart');
    return null;
  }

  const inputClass = "w-full bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all font-sans text-sm sm:text-base placeholder:text-zinc-400";
  const labelClass = "block text-xs font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500 mb-2 ml-1";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-5 pt-8 pb-32 lg:px-12 max-w-6xl mx-auto"
      role="main"
      aria-label="Checkout"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => onNavigate('cart')}
          className="p-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-full hover:bg-luxury-gold hover:text-white transition-all shadow-lg active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tighter font-serif italic">
            Couture <span className="text-luxury-gold">Acquisition</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-bold tracking-widest uppercase mt-1">
            Step {step} of 2: {step === 1 ? 'Information & Shipping' : 'Secure Payment'}
          </p>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-16">
        {/* Form Section */}
        <div className="lg:col-span-7 space-y-10">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Contact Information */}
                <section className="glass-card rounded-[2.5rem] p-8 sm:p-10 border-white/5 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-luxury-gold/10 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">Identity</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Elite Membership Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="client@vkluxe.com" 
                        className={inputClass} 
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Valentino" 
                        className={inputClass} 
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Rossi" 
                        className={inputClass} 
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* Shipping Details */}
                <section className="glass-card rounded-[2.5rem] p-8 sm:p-10 border-white/5 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-luxury-gold/10 rounded-xl flex items-center justify-center">
                      <Truck className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">Destination</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Shipping Address</label>
                      <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Luxury Avenue" 
                        className={inputClass} 
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Apartment, Suite, etc. (Optional)</label>
                      <input type="text" placeholder="Penthouse 01" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>City</label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Paris" 
                        className={inputClass} 
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Postal Code</label>
                      <input 
                        type="text" 
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        placeholder="75001" 
                        className={inputClass} 
                        required
                      />
                    </div>
                  </div>
                </section>

                <button
                  onClick={() => validateStep1() ? setStep(2) : alert('Please complete all identity and destination fields.')}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-[1.5rem] font-black text-lg hover:bg-luxury-gold hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group uppercase tracking-[0.2em]"
                >
                  Continue to Payment
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <section className="glass-card rounded-[2.5rem] p-8 sm:p-10 border-white/5 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-luxury-gold/10 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">Secure Payment</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Card Details</label>
                      <div className="relative">
                        <input type="text" placeholder="0000 0000 0000 0000" className={`${inputClass} pr-12`} />
                        <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500/50" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>CVV</label>
                      <input type="text" placeholder="***" className={inputClass} />
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-dashed border-zinc-200 dark:border-white/10">
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                      Transactions are encrypted with bank-grade 256-bit SSL security. Your data is handled with absolute discretion.
                    </p>
                  </div>
                </section>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 py-5 rounded-[1.5rem] font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all uppercase tracking-widest text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="flex-[2] luxury-shimmer bg-black dark:bg-white text-white dark:text-black py-5 rounded-[1.5rem] font-black text-lg hover:bg-luxury-gold hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Verifying...' : 'Finalize Acquisition'}
                    {!isProcessing && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary Section */}
        <div className="lg:col-span-5 mt-12 lg:mt-0">
          <div className="sticky top-28 space-y-8">
            <section className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden relative">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase font-serif italic">
                Summary
              </h3>

              <div className="max-h-[30dvh] overflow-y-auto pr-2 scrollbar-hide space-y-4 mb-8">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}`} className="flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-white/5 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate uppercase tracking-tight">{item.name}</h4>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">₵{item.price}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-white/5">
                <div className="flex justify-between text-zinc-500 font-bold text-sm uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-gray-900 dark:text-white">₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500 font-bold text-sm uppercase tracking-widest">
                  <span>Concierge Dispatch</span>
                  <span className="text-gray-900 dark:text-white">₵{delivery.toFixed(2)}</span>
                </div>
                <div className="h-px bg-zinc-200 dark:bg-white/5 my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-gray-900 dark:text-white tracking-widest uppercase">Total</span>
                  <span className="text-3xl font-black text-luxury-gold font-serif italic">
                    ₵{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </section>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 glass-card rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-luxury-gold" />
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Secure</span>
              </div>
              <div className="p-4 glass-card rounded-2xl flex items-center gap-3">
                <Truck className="w-5 h-5 text-luxury-gold" />
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Insured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
