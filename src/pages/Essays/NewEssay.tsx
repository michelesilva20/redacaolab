import { useState, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  Save,
  Upload,
  Image,
  FileText,
  Clock,
  X,
  AlertCircle,
} from 'lucide-react';
import { fakeApi } from '../../services/fakeApi';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';

const categoryOptions = [
  { value: 'enem', label: 'ENEM' },
  { value: 'unesp', label: 'UNESP' },
  { value: 'concursos', label: 'Concursos' },
];

export function NewEssay() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { addToast, triggerConfetti } = useUIStore();

  const preselectedThemeId = location.state?.themeId;

  const [activeTab, setActiveTab] = useState('write');
  const [selectedTheme, setSelectedTheme] = useState(preselectedThemeId || '');
  const [category, setCategory] = useState('enem');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);

  const { data: themes } = useQuery({
    queryKey: ['themes'],
    queryFn: () => fakeApi.themes.getAll(),
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Comece a escrever sua redação aqui...',
      }),
      CharacterCount.configure({
        limit: 3000,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  const wordCount = editor?.storage.characterCount.words() || 0;
  const characterCount = editor?.storage.characterCount.characters() || 0;

  const submitMutation = useMutation({
    mutationFn: async (type: 'texto' | 'imagem') => {
      const data = {
        userId: user?.id,
        themeId: selectedTheme,
        type,
        content: type === 'texto' ? editor?.getHTML() : undefined,
        imageUrl: type === 'imagem' && imagePreview ? imagePreview : undefined,
        category: category as 'enem' | 'unesp' | 'concursos',
        notes,
      };
      return fakeApi.essays.create(data);
    },
    onSuccess: () => {
      triggerConfetti();
      addToast({
        title: 'Redação enviada!',
        message: 'Você receberá a correção em breve.',
        type: 'success',
      });
      navigate('/app/redacoes');
    },
    onError: () => {
      addToast({
        title: 'Erro ao enviar',
        message: 'Tente novamente mais tarde.',
        type: 'error',
      });
    },
  });

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = () => {
    if (activeTab === 'write') {
      submitMutation.mutate('texto');
    } else {
      submitMutation.mutate('imagem');
    }
  };

  const canSubmit = selectedTheme && (
    (activeTab === 'write' && wordCount >= 100) ||
    (activeTab === 'photo' && imagePreview)
  );

  const themeOptions = themes?.map((t) => ({ value: t.id, label: t.title })) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link to="/app/redacoes" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-800">Nova Redação</h1>
        <p className="text-neutral-500">Escreva ou envie uma foto da sua redação</p>
      </div>

      {/* Theme Selection */}
      <Card>
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Tema da redação"
            options={[{ value: '', label: 'Selecione um tema' }, ...themeOptions]}
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
          />
          <Select
            label="Modalidade"
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </Card>

      {/* Editor Tabs */}
      <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="write">
            <FileText className="w-4 h-4 mr-2" />
            Escrever aqui
          </TabsTrigger>
          <TabsTrigger value="photo">
            <Image className="w-4 h-4 mr-2" />
            Enviar foto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write">
          <Card padding="none">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span>{wordCount} palavras</span>
                <span>{characterCount} caracteres</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                    isTimerRunning 
                      ? 'bg-accent-100 text-accent-700' 
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
                </button>
              </div>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} className="min-h-[400px]" />

            {wordCount < 100 && wordCount > 0 && (
              <div className="px-4 py-2 bg-highlight-50 border-t border-highlight-200 flex items-center gap-2 text-sm text-highlight-700">
                <AlertCircle className="w-4 h-4" />
                Mínimo de 100 palavras para enviar ({100 - wordCount} restantes)
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="photo">
          <Card>
            {!imagePreview ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center hover:border-primary-400 transition-colors"
              >
                <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 mb-2">
                  Arraste e solte a imagem aqui ou
                </p>
                <label className="cursor-pointer">
                  <span className="text-primary-600 hover:text-primary-700 font-medium">
                    clique para selecionar
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-neutral-400 mt-4">
                  PNG, JPG ou JPEG até 10MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-xl"
                />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-danger-500 text-white rounded-full flex items-center justify-center hover:bg-danger-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Photo tips */}
            <div className="mt-4 p-4 bg-primary-50 rounded-xl">
              <h4 className="font-medium text-primary-800 mb-2">Dicas para uma boa foto:</h4>
              <ul className="text-sm text-primary-700 space-y-1">
                <li>• Boa iluminação, sem sombras</li>
                <li>• Folha bem enquadrada</li>
                <li>• Letra legível</li>
                <li>• Sem reflexos ou borrões</li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notes */}
      <Card>
        <Textarea
          label="Observações para o professor (opcional)"
          placeholder="Alguma dúvida específica ou contexto sobre sua redação..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" leftIcon={<Save className="w-4 h-4" />}>
          Salvar rascunho
        </Button>
        <Button
          variant="gradient"
          rightIcon={<Send className="w-4 h-4" />}
          onClick={handleSubmit}
          disabled={!canSubmit}
          isLoading={submitMutation.isPending}
        >
          Enviar para correção
        </Button>
      </div>
    </div>
  );
}
