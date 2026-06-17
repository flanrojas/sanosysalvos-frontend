import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MascotasPage } from './MascotasPage';
import { eliminarMascota, listarMascotas } from '../api/mascotas';
import { useToast } from '../components/Toast';
import type { MascotaResponse } from '../api/types';

vi.mock('../api/mascotas', () => ({
  listarMascotas: vi.fn(),
  eliminarMascota: vi.fn(),
}));

vi.mock('../components/Toast', () => ({
  useToast: vi.fn(),
}));

const listarMascotasMock = vi.mocked(listarMascotas);
const eliminarMascotaMock = vi.mocked(eliminarMascota);
const useToastMock = vi.mocked(useToast);

const mascotas: MascotaResponse[] = [
  {
    id: 'pet-1',
    name: 'Toby',
    status: 'LOST',
    species: 'Perro',
    color: 'Café',
    size: 12,
    foundLocation: null,
    lostLocation: 'Ñuñoa',
    description: 'Usa collar azul',
    ownerId: null,
    createdAt: '2026-06-17T12:00:00',
  },
];

describe('MascotasPage', () => {
  const notifySuccess = vi.fn();
  const notifyError = vi.fn();

  beforeEach(() => {
    listarMascotasMock.mockReset();
    eliminarMascotaMock.mockReset();
    notifySuccess.mockReset();
    notifyError.mockReset();
    vi.restoreAllMocks();
    useToastMock.mockReturnValue({ notifySuccess, notifyError });
  });

  it('carga mascotas, filtra por estado y elimina una mascota', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    listarMascotasMock.mockResolvedValue(mascotas);
    eliminarMascotaMock.mockResolvedValueOnce();

    render(<MascotasPage />);

    await waitFor(() => {
      expect(screen.getByText('Toby')).toBeInTheDocument();
    });
    expect(listarMascotasMock).toHaveBeenCalledWith(undefined);

    await user.click(screen.getByRole('button', { name: 'Perdidas' }));
    await waitFor(() => {
      expect(listarMascotasMock).toHaveBeenLastCalledWith({ status: 'LOST' });
    });

    await user.click(screen.getByRole('button', { name: 'Eliminar Toby' }));
    expect(eliminarMascotaMock).toHaveBeenCalledWith('pet-1');
    expect(notifySuccess).toHaveBeenCalledWith('Mascota eliminada.');

    await waitFor(() => {
      expect(screen.getByText('Sin mascotas registradas')).toBeInTheDocument();
    });
  });

  it('muestra error de carga y notifica error al eliminar', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    listarMascotasMock
      .mockRejectedValueOnce(new Error('Fallo mascotas'))
      .mockResolvedValueOnce(mascotas);
    eliminarMascotaMock.mockRejectedValueOnce(new Error('No eliminado'));

    render(<MascotasPage />);

    await waitFor(() => {
      expect(screen.getByText('Fallo mascotas')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    await waitFor(() => {
      expect(screen.getByText('Toby')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Eliminar Toby' }));
    expect(notifyError).toHaveBeenCalledWith('No eliminado');
  });
});
