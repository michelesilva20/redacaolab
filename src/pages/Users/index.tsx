import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users as UsersIcon, Plus, Search, Mail, MoreVertical, Shield, GraduationCap, User } from 'lucide-react';
import { fakeApi } from '../../services/fakeApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../lib/utils';
import type { Role } from '../../types';

const roleOptions = [
  { value: 'all', label: 'Todos os papéis' },
  { value: 'admin', label: 'Admin' },
  { value: 'professor', label: 'Professor' },
  { value: 'aluno', label: 'Aluno' },
];

const roleIcons: Record<Role, React.ReactNode> = {
  admin: <Shield className="w-4 h-4" />,
  professor: <GraduationCap className="w-4 h-4" />,
  aluno: <User className="w-4 h-4" />,
};

const roleBadgeVariants: Record<Role, 'danger' | 'secondary' | 'primary'> = {
  admin: 'danger',
  professor: 'secondary',
  aluno: 'primary',
};

export function Users() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => fakeApi.users.getAll(),
  });

  const filteredUsers = users?.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Usuários</h1>
          <p className="text-neutral-500">Gerencie os usuários da plataforma</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Mail className="w-4 h-4" />}>
            Convidar
          </Button>
          <Button variant="gradient" leftIcon={<Plus className="w-4 h-4" />}>
            Novo usuário
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card padding="sm" className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar usuários..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
        <Select
          options={roleOptions}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        />
      </Card>

      {/* Users Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Usuário</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Papel</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Cadastro</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-neutral-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
                ))
              ) : (
                filteredUsers?.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-neutral-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-neutral-800">{user.name}</p>
                          <p className="text-sm text-neutral-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={roleBadgeVariants[user.role]}>
                        <span className="flex items-center gap-1.5">
                          {roleIcons[user.role]}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">Ativo</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-neutral-100 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-neutral-500" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
