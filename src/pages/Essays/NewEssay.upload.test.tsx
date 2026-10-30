import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ESSAY_STORE_KEY } from '../../lib/essayPersistence';
import { fakeApi } from '../../services/fakeApi';
import { useAuthStore } from '../../stores/authStore';
import { NewEssay } from './NewEssay';

function jpegFile() {
  return new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])], 'redacao.jpg', {
    type: 'image/jpeg',
  });
}

function renderNewEssay() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/app/redacoes/nova']}>
        <Routes>
          <Route path="/app/redacoes/nova" element={<NewEssay />} />
          <Route path="/app/redacoes" element={<div>lista</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('NewEssay — upload demonstrativo', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('mostra preview de JPEG válido, permite remover e rejeita arquivo inválido', async () => {
    useAuthStore.getState().enterDemo('aluno');
    vi.spyOn(fakeApi.themes, 'getAll').mockResolvedValue([]);
    const user = userEvent.setup();
    renderNewEssay();

    await user.click(screen.getByRole('button', { name: /enviar foto/i }));
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeTruthy();

    await user.upload(input, jpegFile());
    expect(await screen.findByAltText('Pré-visualização da redação fotografada')).toBeInTheDocument();
    expect(screen.getByText(/fica só nesta sessão/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remover imagem' }));
    expect(screen.queryByAltText('Pré-visualização da redação fotografada')).not.toBeInTheDocument();

    await user.upload(input, new File([new Uint8Array([0x25, 0x50, 0x44, 0x46])], 'doc.pdf', { type: 'application/pdf' }));
    expect(await screen.findByText(/JPEG ou PNG/i)).toBeInTheDocument();
    expect(localStorage.getItem(ESSAY_STORE_KEY)).toBeNull();
  });
});
