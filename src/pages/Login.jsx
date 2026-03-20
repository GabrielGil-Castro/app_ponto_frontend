// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Ponto App</h1>
        <p style={styles.subtitle}>Faça seu login</p>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: '#fff', padding: '2.5rem', borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px',
  },
  title: {
    fontSize: '1.8rem', fontWeight: 'bold', color: '#2e4057', marginBottom: '0.25rem',
  },
  subtitle: {
    color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.9rem', fontWeight: '600', color: '#374151' },
  input: {
    padding: '0.65rem 0.9rem', borderRadius: '8px', fontSize: '0.95rem',
    border: '1px solid #d1d5db', outline: 'none', color: '#2e4057',
  },
  button: {
    padding: '0.75rem', backgroundColor: '#048A81', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '1rem',
    fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem',
  },
  error: {
    backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.65rem 0.9rem',
    borderRadius: '8px', fontSize: '0.9rem', marginBottom: '0.5rem',
  },
};