import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Shield,
  Save,
  CheckCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useUIStore } from '../../stores/uiStore';

const competencyOptions = [
  { value: 'strict', label: 'Rigoroso' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'flexible', label: 'Flexível' },
];

export function Settings() {
  const { addToast } = useUIStore();
  const [settings, setSettings] = useState({
    platformName: 'RedaçãoLab',
    primaryColor: '#7c3aed',
    logoUrl: '',
    correctionDeadline: 72,
    c1Criteria: 'moderate',
    c2Criteria: 'moderate',
    c3Criteria: 'moderate',
    c4Criteria: 'moderate',
    c5Criteria: 'moderate',
    emailNotifications: true,
    pushNotifications: true,
  });

  const handleSave = () => {
    addToast({
      title: 'Configurações salvas!',
      type: 'success',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Configurações</h1>
          <p className="text-neutral-500">Personalize a plataforma</p>
        </div>
        <Button variant="gradient" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
          Salvar alterações
        </Button>
      </div>

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary-600" />
              </div>
              <CardTitle>Identidade visual</CardTitle>
            </div>
          </CardHeader>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Nome da plataforma"
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Cor primária
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-12 h-12 rounded-lg border border-neutral-200 cursor-pointer"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Correction Criteria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <CardTitle>Critérios de correção</CardTitle>
                <p className="text-sm text-neutral-500 mt-1">
                  Defina o nível de rigor para cada competência
                </p>
              </div>
            </div>
          </CardHeader>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="C1: Norma culta"
              options={competencyOptions}
              value={settings.c1Criteria}
              onChange={(e) => setSettings({ ...settings, c1Criteria: e.target.value })}
            />
            <Select
              label="C2: Compreensão do tema"
              options={competencyOptions}
              value={settings.c2Criteria}
              onChange={(e) => setSettings({ ...settings, c2Criteria: e.target.value })}
            />
            <Select
              label="C3: Argumentação"
              options={competencyOptions}
              value={settings.c3Criteria}
              onChange={(e) => setSettings({ ...settings, c3Criteria: e.target.value })}
            />
            <Select
              label="C4: Coesão"
              options={competencyOptions}
              value={settings.c4Criteria}
              onChange={(e) => setSettings({ ...settings, c4Criteria: e.target.value })}
            />
            <Select
              label="C5: Proposta de intervenção"
              options={competencyOptions}
              value={settings.c5Criteria}
              onChange={(e) => setSettings({ ...settings, c5Criteria: e.target.value })}
            />
            <Input
              label="Prazo de correção (horas)"
              type="number"
              value={settings.correctionDeadline}
              onChange={(e) => setSettings({ ...settings, correctionDeadline: Number(e.target.value) })}
            />
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-highlight-100 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-highlight-600" />
              </div>
              <CardTitle>Notificações</CardTitle>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl cursor-pointer">
              <div>
                <p className="font-medium text-neutral-800">Notificações por e-mail</p>
                <p className="text-sm text-neutral-500">Receber atualizações por e-mail</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl cursor-pointer">
              <div>
                <p className="font-medium text-neutral-800">Notificações push</p>
                <p className="text-sm text-neutral-500">Receber notificações no navegador</p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-danger-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-danger-600" />
              </div>
              <CardTitle>Segurança</CardTitle>
            </div>
          </CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <Button variant="outline">Alterar senha</Button>
            <Button variant="outline">Gerenciar sessões</Button>
            <Button variant="danger">Excluir conta</Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
