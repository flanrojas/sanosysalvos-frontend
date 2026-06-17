import { useEffect, useState } from 'react';
import { listarMascotas, eliminarMascota } from '../api/mascotas';
import { getErrorMessage } from '../api/client';
import type { MascotaResponse } from '../api/types';
import { Badge, toneForTipo } from '../components/Badge';
import { Button } from '../components/Button';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { useToast } from '../components/Toast';
import { PawIcon, TrashIcon } from '../components/icons';
import { formatFechaCorta, iniciales } from '../utils/format';
import './MascotasPage.css';

const filtros = [
  { id: '', label: 'Todas' },
  { id: 'LOST', label: 'Perdidas' },
  { id: 'FOUND', label: 'Encontradas' },
  { id: 'SAFE', label: 'A salvo' },
];

export function MascotasPage() {
  const { notifySuccess, notifyError } = useToast();
  const [data, setData] = useState<MascotaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  function cargar(estado: string) {
    setLoading(true);
    setError(null);
    listarMascotas(estado ? { status: estado } : undefined)
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    cargar(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`¿Eliminar el registro de "${name}"?`)) return;
    try {
      await eliminarMascota(id);
      setData((prev) => prev.filter((m) => m.id !== id));
      notifySuccess('Mascota eliminada.');
    } catch (err) {
      notifyError(getErrorMessage(err));
    }
  }

  return (
    <div className="container page">
      <div className="page__head">
        <div>
          <p className="page__eyebrow">Registro</p>
          <h1 className="page__title">Mascotas</h1>
          <p className="page__subtitle">
            Directorio de mascotas registradas en la plataforma.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="chips">
          {filtros.map((f) => (
            <button
              key={f.id || 'all'}
              className={status === f.id ? 'chip chip--active' : 'chip'}
              onClick={() => setStatus(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingState text="Cargando mascotas…" />}

      {!loading && error && (
        <ErrorState
          text={error}
          action={
            <Button variant="ghost" onClick={() => cargar(status)}>
              Reintentar
            </Button>
          }
        />
      )}

      {!loading && !error && data.length === 0 && (
        <EmptyState
          icon={<PawIcon size={26} />}
          title="Sin mascotas registradas"
          text="Cuando se cree un reporte completo, las mascotas aparecerán aquí."
        />
      )}

      {!loading && !error && data.length > 0 && (
        <div className="mascota-grid">
          {data.map((m) => (
            <article className="mascota-card" key={m.id}>
              <div className="mascota-card__head">
                <span className="mascota-card__avatar">{iniciales(m.name)}</span>
                <div>
                  <div className="mascota-card__name">{m.name}</div>
                  <div className="mascota-card__species">{m.species || 'Especie N/D'}</div>
                </div>
              </div>

              <div className="mascota-card__tags">
                {m.status && <Badge tone={toneForTipo(m.status)}>{m.status}</Badge>}
                {m.color && <span className="mascota-card__tag">{m.color}</span>}
                {m.size != null && (
                  <span className="mascota-card__tag">{m.size} kg</span>
                )}
              </div>

              {m.description && <p className="mascota-card__desc">{m.description}</p>}

              <div className="mascota-card__foot">
                <span className="mascota-card__date">
                  Registrada {formatFechaCorta(m.createdAt)}
                </span>
                <button
                  className="icon-btn"
                  onClick={() => handleDelete(m.id, m.name)}
                  aria-label={`Eliminar ${m.name}`}
                >
                  <TrashIcon size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
