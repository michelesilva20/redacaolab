import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import {
  ArrowLeft,
  Send,
  Save,
  Upload,
  Image,
  FileText,
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
import { Skeleton } from '../../components/ui/Skeleton';
import { ForbiddenPage } from '../../components/ForbiddenPage';
import { canEditDraft } from '../../lib/permissions';
import { invalidateEssayRelatedQueries } from '../../lib/essayQueryInvalidation';
import { EssayDomainError } from '../../lib/essayErrors';
import { persistEssayTimer } from '../../lib/essayRepository';
import { snapshotFromEssay } from '../../lib/essayTimer';
import { validateEssayImage } from '../../lib/imageUpload';
import { useEssayTimer } from '../../hooks/useEssayTimer';
import { EssayTimerControls } from '../../components/essays/EssayTimerControls';
import { ConfirmModal } from '../../components/ui/Modal';

const categoryOptions = [
  { value: 'enem', label: 'ENEM' },
  { value: 'unesp', label: 'UNESP' },
  { value: 'concursos', label: 'Concursos' },
];

type EssaySnapshot = {
  themeId: string;
  category: string;
  notes: string;
  content: string;
};

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof EssayDomainError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function NewEssay() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { id: routeId } = useParams<{ id: string }>();
  const userId = useAuthStore((state) => state.user?.id);
  const { addToast, triggerConfetti } = useUIStore();

  const isEditRoute = Boolean(routeId);
  const preselectedThemeId = location.state?.themeId;

  const [activeTab, setActiveTab] = useState('write');
  const [selectedTheme, setSelectedTheme] = useState(preselectedThemeId || '');
  const [category, setCategory] = useState('enem');
  const [notes, setNotes] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);
  const [confirmResetTimer, setConfirmResetTimer] = useState(false);
  const [essayId, setEssayId] = useState<string | undefined>(routeId);
  const objectUrlRef = useRef<string | null>(null);
  const validationGenRef = useRef(0);
  const keepObjectUrlRef = useRef(false);
  const essayIdRef = useRef<string | undefined>(routeId);
  const userIdRef = useRef(userId);
  essayIdRef.current = essayId;
  userIdRef.current = userId;

  const timer = useEssayTimer({
    onCheckpoint: (snapshot) => {
      const id = essayIdRef.current;
      const actor = userIdRef.current;
      if (!id || !actor) return;
      try {
        persistEssayTimer(actor, id, snapshot);
      } catch {
        addToast({
          title: 'Cronômetro não persistido',
          message: 'O tempo continua nesta tela, mas não foi gravado no rascunho.',
          type: 'warning',
        });
      }
    },
  });
  const [hydrated, setHydrated] = useState(!routeId);
  const [savedSnapshot, setSavedSnapshot] = useState<EssaySnapshot | null>(null);
  const [editorRevision, setEditorRevision] = useState(0);
  const lastSavedAt = useRef<string | null>(null);

  const { data: themes } = useQuery({
    queryKey: ['themes'],
    queryFn: () => fakeApi.themes.getAll(),
  });

  const {
    data: existingEssay,
    isLoading: isLoadingEssay,
    isFetched: isEssayFetched,
  } = useQuery({
    queryKey: ['essay', routeId],
    queryFn: () => fakeApi.essays.getById(routeId!),
    enabled: Boolean(routeId),
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
    onUpdate: () => setEditorRevision((value) => value + 1),
  });

  useEffect(() => {
    if (!existingEssay || !editor || hydrated) return;

    setSelectedTheme(existingEssay.themeId);
    setCategory(existingEssay.category);
    setNotes(existingEssay.notes || '');
    editor.commands.setContent(existingEssay.content || '');
    setEssayId(existingEssay.id);
    const snapshot = {
      themeId: existingEssay.themeId,
      category: existingEssay.category,
      notes: existingEssay.notes || '',
      content: existingEssay.content || '',
    };
    setSavedSnapshot(snapshot);
    lastSavedAt.current = existingEssay.updatedAt || existingEssay.createdAt;
    timer.hydrate(snapshotFromEssay(existingEssay));
    setHydrated(true);
  }, [existingEssay, editor, hydrated, timer]);

  useEffect(() => {
    setEssayId(routeId);
    if (!routeId) {
      setHydrated(true);
    }
  }, [routeId]);

  const wordCount = editor?.storage.characterCount.words() || 0;
  const characterCount = editor?.storage.characterCount.characters() || 0;
  const currentContent = editor?.getHTML() ?? '';

  const isDirty =
    hydrated &&
    Boolean(savedSnapshot) &&
    (selectedTheme !== savedSnapshot?.themeId ||
      category !== savedSnapshot?.category ||
      notes !== savedSnapshot?.notes ||
      currentContent !== savedSnapshot?.content);

  const hasUnsavedNewContent =
    !savedSnapshot &&
    Boolean(selectedTheme || notes || (editorRevision > 0 && wordCount > 0));

  const showUnsaved = isDirty || hasUnsavedNewContent;

  useEffect(() => {
    if (!showUnsaved) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [showUnsaved]);

  const rememberSnapshot = (essay: { themeId: string; category: string; notes?: string; content?: string; updatedAt?: string }) => {
    setSavedSnapshot({
      themeId: essay.themeId,
      category: essay.category,
      notes: essay.notes || '',
      content: essay.content || '',
    });
    lastSavedAt.current = essay.updatedAt ?? new Date().toISOString();
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new EssayDomainError('forbidden', 'Entre como aluno para salvar o rascunho.');
      }
      return fakeApi.essays.saveDraft({
        actorId: userId,
        id: essayId,
        themeId: selectedTheme,
        category: category as 'enem' | 'unesp' | 'concursos',
        content: editor?.getHTML() ?? '',
        notes,
        wordCount,
        timer: timer.snapshot,
      });
    },
    onSuccess: (saved) => {
      setEssayId(saved.id);
      rememberSnapshot(saved);
      invalidateEssayRelatedQueries(queryClient, saved.id);
      addToast({
        title: 'Rascunho salvo',
        message: 'Você pode sair e continuar depois neste mesmo perfil.',
        type: 'success',
      });
      if (!isEditRoute) {
        navigate(`/app/redacoes/${saved.id}/editar`, { replace: true });
      }
    },
    onError: (error) => {
      addToast({
        title: 'Não foi possível salvar',
        message: errorMessage(error, 'Tente novamente. Nada foi marcado como salvo.'),
        type: 'error',
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (type: 'texto' | 'imagem') => {
      if (!userId) {
        throw new EssayDomainError('forbidden', 'Entre como aluno para enviar a redação.');
      }
      if (type === 'imagem') {
        return fakeApi.essays.create({
          userId,
          themeId: selectedTheme,
          type: 'imagem',
          imageUrl: imagePreview || undefined,
          category: category as 'enem' | 'unesp' | 'concursos',
          notes,
        });
      }
      return fakeApi.essays.submit({
        actorId: userId,
        id: essayId,
        themeId: selectedTheme,
        category: category as 'enem' | 'unesp' | 'concursos',
        content: editor?.getHTML() ?? '',
        notes,
        wordCount,
        timer: {
          ...timer.snapshot,
          running: false,
          startedAt: null,
        },
      });
    },
    onSuccess: (submitted) => {
      if (submitted.type === 'imagem') {
        keepObjectUrlRef.current = true;
      }
      invalidateEssayRelatedQueries(queryClient, submitted.id);
      triggerConfetti();
      addToast({
        title: submitted.type === 'imagem' ? 'Foto enviada nesta sessão' : 'Redação enviada!',
        message:
          submitted.type === 'imagem'
            ? 'A imagem fica só nesta sessão e some ao recarregar. Não é armazenamento definitivo.'
            : 'Você receberá a correção em breve.',
        type: 'success',
      });
      navigate('/app/redacoes');
    },
    onError: (error) => {
      addToast({
        title: 'Erro ao enviar',
        message: errorMessage(error, 'Tente novamente mais tarde.'),
        type: 'error',
      });
    },
  });

  const revokePreview = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const applyValidImage = useCallback((file: File) => {
    revokePreview();
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setImagePreview(url);
    setImageError(null);
  }, [revokePreview]);

  const processImageFile = useCallback(async (file: File | undefined) => {
    const generation = ++validationGenRef.current;
    setIsValidatingImage(true);
    setImageError(null);
    const result = await validateEssayImage(file);
    if (generation !== validationGenRef.current) return;
    setIsValidatingImage(false);
    if (!result.ok) {
      setImageError(result.message);
      addToast({
        title: 'Imagem rejeitada',
        message: result.message,
        type: 'error',
      });
      return;
    }
    applyValidImage(result.file);
  }, [addToast, applyValidImage]);

  useEffect(() => {
    return () => {
      if (!keepObjectUrlRef.current) {
        revokePreview();
      }
    };
  }, [revokePreview]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    void processImageFile(file);
  }, [processImageFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    void processImageFile(file);
  }, [processImageFile]);

  const handleRemoveImage = useCallback(() => {
    validationGenRef.current += 1;
    setIsValidatingImage(false);
    setImageError(null);
    revokePreview();
    setImagePreview(null);
  }, [revokePreview]);

  const isBusy = saveMutation.isPending || submitMutation.isPending;

  const handleSaveDraft = () => {
    if (isBusy || activeTab !== 'write' || !selectedTheme) return;
    saveMutation.mutate();
  };

  const handleSubmit = () => {
    if (isBusy) return;
    if (activeTab === 'write') {
      submitMutation.mutate('texto');
    } else {
      submitMutation.mutate('imagem');
    }
  };

  const canSave = Boolean(selectedTheme) && activeTab === 'write' && !isBusy;
  const canSubmit = selectedTheme && !isValidatingImage && (
    (activeTab === 'write' && wordCount >= 100) ||
    (activeTab === 'photo' && Boolean(imagePreview) && !imageError && !isEditRoute)
  );

  const themeOptions = themes?.map((t) => ({ value: t.id, label: t.title })) || [];

  if (isEditRoute && isLoadingEssay) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton height={80} className="rounded-2xl" />
        <Skeleton height={400} className="rounded-2xl" />
      </div>
    );
  }

  if (isEditRoute && isEssayFetched && !existingEssay) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-neutral-800">Redação não encontrada</h2>
        <p className="text-neutral-500 mt-2">Este identificador não corresponde a um rascunho disponível.</p>
        <Link to="/app/redacoes" className="text-primary-600 mt-4 inline-block">
          Voltar às redações
        </Link>
      </div>
    );
  }

  if (isEditRoute && existingEssay && !canEditDraft(userId, existingEssay)) {
    const isOwner = existingEssay.userId === userId;
    return (
      <ForbiddenPage
        title={isOwner ? 'Esta redação não pode ser editada' : 'Redação de outro perfil'}
        description={
          isOwner
            ? 'Somente rascunhos digitados do próprio aluno podem ser retomados. Redações enviadas ou corrigidas permanecem somente leitura.'
            : 'Nesta demonstração, o aluno só edita as próprias redações. O backend deverá validar a propriedade do recurso.'
        }
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/app/redacoes" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-800">
          {isEditRoute ? 'Continuar redação' : 'Nova Redação'}
        </h1>
        <p className="text-neutral-500">
          {isEditRoute
            ? 'Retome o rascunho salvo. O salvamento é explícito — não há autosave nesta fase.'
            : 'Escreva ou envie uma foto da sua redação'}
        </p>
      </div>

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

      <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="write">
            <FileText className="w-4 h-4 mr-2" />
            Escrever aqui
          </TabsTrigger>
          {!isEditRoute && (
            <TabsTrigger value="photo">
              <Image className="w-4 h-4 mr-2" />
              Enviar foto
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="write">
          <Card padding="none">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span>{wordCount} palavras</span>
                <span>{characterCount} caracteres</span>
              </div>
              <EssayTimerControls
                elapsedMs={timer.elapsedMs}
                running={timer.running}
                onStart={timer.start}
                onPause={timer.pause}
                onResetRequest={() => setConfirmResetTimer(true)}
              />
            </div>

            <EditorContent editor={editor} className="min-h-[400px]" />

            {wordCount < 100 && wordCount > 0 && (
              <div className="px-4 py-2 bg-highlight-50 border-t border-highlight-200 flex items-center gap-2 text-sm text-highlight-700">
                <AlertCircle className="w-4 h-4" />
                Mínimo de 100 palavras para enviar ({100 - wordCount} restantes)
              </div>
            )}
          </Card>
        </TabsContent>

        {!isEditRoute && (
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
                      accept="image/jpeg,image/png"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-neutral-400 mt-4">
                    JPEG ou PNG até 10 MiB. A validação usa o tipo e a assinatura do arquivo.
                  </p>
                  {isValidatingImage && (
                    <p className="text-sm text-neutral-500 mt-3" role="status">
                      Validando imagem…
                    </p>
                  )}
                  {imageError && (
                    <p className="text-sm text-danger-600 mt-3" role="alert">
                      {imageError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Pré-visualização da redação fotografada"
                    className="w-full rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    aria-label="Remover imagem"
                    className="absolute top-2 right-2 w-8 h-8 bg-danger-500 text-white rounded-full flex items-center justify-center hover:bg-danger-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="mt-4 p-4 bg-highlight-50 rounded-xl border border-highlight-200">
                <p className="text-sm text-highlight-800">
                  Nesta demonstração a foto fica só nesta sessão e some ao recarregar o navegador.
                  Não é armazenamento definitivo nem envio para um servidor.
                </p>
              </div>

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
        )}
      </Tabs>

      <Card>
        <Textarea
          label="Observações para o professor (opcional)"
          placeholder="Alguma dúvida específica ou contexto sobre sua redação..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </Card>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="ghost"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSaveDraft}
            disabled={!canSave}
            isLoading={saveMutation.isPending}
          >
            Salvar rascunho
          </Button>
          {showUnsaved && (
            <p className="text-sm text-highlight-700 px-1" role="status">
              Alterações não salvas
            </p>
          )}
          {!showUnsaved && lastSavedAt.current && (
            <p className="text-sm text-neutral-500 px-1" role="status">
              Rascunho salvo neste navegador
            </p>
          )}
        </div>
        <Button
          variant="gradient"
          rightIcon={<Send className="w-4 h-4" />}
          onClick={handleSubmit}
          disabled={!canSubmit || isBusy}
          isLoading={submitMutation.isPending}
        >
          Enviar para correção
        </Button>
      </div>

      <ConfirmModal
        isOpen={confirmResetTimer}
        onClose={() => setConfirmResetTimer(false)}
        onConfirm={() => {
          timer.reset();
          setConfirmResetTimer(false);
        }}
        title="Reiniciar cronômetro?"
        description="O tempo acumulado desta redação voltará a zero. Esta ação não apaga o texto."
        confirmText="Reiniciar"
        cancelText="Cancelar"
      />
    </div>
  );
}
