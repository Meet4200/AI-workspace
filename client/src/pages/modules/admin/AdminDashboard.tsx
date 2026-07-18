import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api.js';
import { useAuth } from '../../../context/AuthContext.js';

import { Users, DollarSign, BarChart2, Shield, Loader2, CheckCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    }
  });

  // Fetch Users list
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data.users;
    }
  });

  // Update Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: async (vars: { userId: string; role: string }) => {
      const res = await api.put('/admin/users/role', vars);
      return res.data.user;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setSuccessMsg(`Successfully updated role for ${updatedUser.email}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  });

  const handleRoleChange = (userId: string, role: string) => {
    updateRoleMutation.mutate({ userId, role });
  };

  if (statsLoading || usersLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="mt-2 text-sm text-muted-foreground">Retrieving admin system stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-3xl font-bold font-heading gradient-text">Admin Control Panel</h1>
        <p className="text-muted-foreground text-sm">System management console, aggregated revenue metrics, and user permission controls</p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-xs flex gap-2.5 items-center max-w-md">
          <CheckCircle size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl glass border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Registrations</span>
            <Users size={16} className="text-purple-400" />
          </div>
          <h3 className="text-3xl font-extrabold font-heading text-foreground">{stats?.users || 0}</h3>
          <span className="text-[10px] text-muted-foreground block">Active database records</span>
        </div>

        <div className="p-5 rounded-2xl glass border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Gross SaaS Revenue</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <h3 className="text-3xl font-extrabold font-heading text-foreground">
            ${((stats?.revenueInCents || 0) / 100).toFixed(2)}
          </h3>
          <span className="text-[10px] text-muted-foreground block">Aggregated stripe checkouts</span>
        </div>

        <div className="p-5 rounded-2xl glass border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Paid Packages Sold</span>
            <BarChart2 size={16} className="text-blue-400" />
          </div>
          <h3 className="text-3xl font-extrabold font-heading text-foreground">{stats?.transactions || 0}</h3>
          <span className="text-[10px] text-muted-foreground block">Credit packages purchases</span>
        </div>
      </div>

      {/* Users directory table */}
      <div className="pt-6 space-y-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Shield size={14} /> User Permissions Directory
        </h3>

        <div className="border border-white/5 rounded-2xl overflow-hidden glass">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
                  <th className="p-4">Email</th>
                  <th className="p-4">Credits Remaining</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {usersData?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-semibold text-slate-200">{u.email}</td>
                    <td className="p-4 font-mono">{u.credit?.balance || 0}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold rounded">
                        {u.subscription?.plan || 'FREE'}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={updateRoleMutation.isPending || u.id === user?.id}
                        className="px-2 py-1 bg-muted/40 rounded border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="GUEST">Guest</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
