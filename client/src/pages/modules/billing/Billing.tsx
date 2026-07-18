import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api.js';
import { useAuth } from '../../../context/AuthContext.js';

import { CreditCard, Check, Loader2, History, ShoppingBag } from 'lucide-react';

export const Billing: React.FC = () => {
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();

  const [refillLoading, setRefillLoading] = useState(false);

  // Fetch payments
  const { data: payments } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await api.get('/billing/payments');
      return res.data.payments;
    }
  });

  // Refill Mutation
  const refillMutation = useMutation({
    mutationFn: async (vars: { creditAmount: number; priceInCents: number }) => {
      const res = await api.post('/billing/buy-credits', vars);
      return res.data;
    },
    onSuccess: () => {
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setRefillLoading(false);
    }
  });

  const handleBuyCredits = (credits: number, priceCents: number) => {
    setRefillLoading(true);
    refillMutation.mutate({ creditAmount: credits, priceInCents: priceCents });
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-3xl font-bold font-heading gradient-text">Plans & Billing</h1>
        <p className="text-muted-foreground text-sm">Purchase credits, subscribe to active SaaS plans, and manage transaction receipts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active plan card */}
        <div className="p-5 rounded-2xl glass border border-purple-500/20 md:col-span-1 flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Active Subscription</span>
              <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold rounded">
                {user?.subscription?.plan || 'FREE'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-foreground font-heading">
              {user?.subscription?.plan === 'PRO' ? '$29.00 / Mo' : '$0.00 / Mo'}
            </h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Status: {user?.subscription?.status || 'active'} • Expires: {user?.subscription?.currentPeriodEnd ? new Date(user.subscription.currentPeriodEnd).toLocaleDateString() : 'Never'}
            </p>
          </div>
          <button className="w-full py-2 border border-purple-500/20 hover:bg-purple-500/5 text-purple-300 rounded-lg text-xs font-semibold">
            Cancel Subscription
          </button>
        </div>

        {/* Credit details card */}
        <div className="p-5 rounded-2xl glass border border-white/5 md:col-span-2 flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">System Credit Balance</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-foreground font-heading">{user?.credit?.balance || 0}</span>
              <span className="text-xs text-muted-foreground">Credits Remaining</span>
            </div>
            <p className="text-xs text-muted-foreground leading-normal max-w-sm">
              Credits are consumed when generating files: Resumes (5), Cover Letters (3), Emails (2), PDF chats (1). Credits are refreshed daily.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleBuyCredits(100, 1000)}
              disabled={refillMutation.isPending || refillLoading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/15"
            >
              {refillMutation.isPending ? <Loader2 className="animate-spin" size={12} /> : <ShoppingBag size={12} />}
              Buy 100 Credits ($10.00)
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="pt-6 space-y-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">SaaS Membership Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Starter', price: '$9', features: ['50 daily credits', 'Standard PDF uploads', 'Modern template access'] },
            { name: 'Pro (Recommended)', price: '$29', features: ['200 daily credits', 'Priority RAG PDF chats', 'Full resume designs access', 'Tone enhancements'] },
            { name: 'Enterprise', price: '$99', features: ['Unlimited credits', 'Custom LLM models integration', '24/7 priority support', 'Admin system audits'] }
          ].map((tier) => (
            <div
              key={tier.name}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-80 transition-all ${
                tier.name.includes('Pro') ? 'border-purple-500 bg-purple-500/5 shadow-purple-500/5 shadow-2xl' : 'border-white/5 bg-muted/10'
              }`}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-lg text-foreground">{tier.name}</h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-foreground">{tier.price}</span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  {tier.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-400" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-purple-600/10">
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Receipts list */}
      <div className="pt-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <History size={14} /> Transaction History
        </div>
        {payments && payments.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-border bg-muted/5 text-center text-xs text-muted-foreground">
            No payments recorded yet. Buy a credit package above to verify!
          </div>
        ) : (
          <div className="space-y-3">
            {payments?.map((pay: any) => (
              <div key={pay.id} className="p-3 rounded-xl border border-white/5 bg-muted/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-300 rounded-lg">
                    <CreditCard size={14} />
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-200">Invoice: {pay.stripeInvoiceId}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(pay.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400 block">${(pay.amount / 100).toFixed(2)}</span>
                  <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                    {pay.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
