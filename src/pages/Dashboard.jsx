// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from './styles/Dashboard.module.css';

export default function Dashboard() {
  const { user, logout }        = useAuth();
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [punching, setPunching] = useState(false);
  const [message, setMessage]   = useState({ text: '', success: false });

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    setLoading(true);
    try {
      const { data } = await api.get('/punch/my');
      setRecords(data);
    } catch {
      setMessage({ text: 'Erro ao carregar registros.', success: false });
    } finally {
      setLoading(false);
    }
  }

  async function handlePunch() {
    setPunching(true);
    setMessage({ text: '', success: false });
    try {
      await api.post('/punch');
      setMessage({ text: 'Ponto registrado com sucesso!', success: true });
      fetchRecords();
    } catch {
      setMessage({ text: 'Erro ao registrar ponto.', success: false });
    } finally {
      setPunching(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Olá, {user.name}</h1>
          <p className={styles.subtitle}>
            {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>Sair</button>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Registrar Ponto</h2>
        <button
          className={styles.punchBtn}
          onClick={handlePunch}
          disabled={punching}
        >
          {punching ? 'Registrando...' : 'Bater Ponto'}
        </button>
        {message.text && (
          <p className={message.success ? styles.messageSuccess : styles.messageError}>
            {message.text}
          </p>
        )}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Meus Registros</h2>
        {loading ? (
          <p className={styles.empty}>Carregando...</p>
        ) : records.length === 0 ? (
          <p className={styles.empty}>Nenhum registro encontrado.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Data</th>
                <th className={styles.th}>Hora</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td className={styles.td}>{i + 1}</td>
                  <td className={styles.td}>
                    {format(new Date(r.punchedAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className={styles.td}>
                    {format(new Date(r.punchedAt), 'HH:mm:ss', { locale: ptBR })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}