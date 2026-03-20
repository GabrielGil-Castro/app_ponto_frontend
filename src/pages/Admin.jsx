// src/pages/Admin.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from './styles/Admin.module.css';

export default function Admin() {
  const { user, logout } = useAuth();

  const [users, setUsers]     = useState([]);
  const [records, setRecords] = useState([]);
  const [tab, setTab]         = useState('records');
  const [loading, setLoading] = useState(false);

  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'employee' });
  const [formMsg, setFormMsg] = useState({ text: '', success: false });

  useEffect(() => {
    fetchUsers();
    fetchRecords();
  }, []);

  async function fetchUsers() {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch {
      console.error('Erro ao carregar usuarios.');
    }
  }

  async function fetchRecords() {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/records');
      setRecords(data);
    } catch {
      console.error('Erro ao carregar registros.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser() {
    setFormMsg({ text: '', success: false });
    try {
      await api.post('/admin/users', form);
      setFormMsg({ text: 'Usuário criado com sucesso!', success: true });
      setForm({ name: '', email: '', password: '', role: 'employee' });
      fetchUsers();
    } catch (err) {
      setFormMsg({ text: err.response?.data?.message || 'Erro ao criar usuário.', success: false });
    }
  }

  async function handleDeleteUser(id) {
    if (!confirm('Deseja realmente excluir este usuário?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao excluir usuário.');
    }
  }

  async function handleDeleteRecord(id) {
    if (!confirm('Deseja realmente excluir este registro?')) return;
    try {
      await api.delete(`/admin/records/${id}`);
      fetchRecords();
    } catch {
      alert('Erro ao excluir registro.');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Painel Admin</h1>
          <p className={styles.subtitle}>Olá, {user.name}</p>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>Sair</button>
      </div>

      <div className={styles.tabs}>
        {['records', 'users', 'create'].map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {{ records: 'Registros', users: 'Usuários', create: 'Novo Usuário' }[t]}
          </button>
        ))}
      </div>

      {tab === 'records' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Todos os Registros</h2>
          {loading ? <p className={styles.empty}>Carregando...</p> : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Funcionário</th>
                  <th className={styles.th}>Data</th>
                  <th className={styles.th}>Hora</th>
                  <th className={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r.id} className={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td className={styles.td}>{r.User?.name}</td>
                    <td className={styles.td}>{format(new Date(r.punchedAt), 'dd/MM/yyyy', { locale: ptBR })}</td>
                    <td className={styles.td}>{format(new Date(r.punchedAt), 'HH:mm:ss', { locale: ptBR })}</td>
                    <td className={styles.td}>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteRecord(r.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Usuários Cadastrados</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Nome</th>
                <th className={styles.th}>Email</th>
                <th className={styles.th}>Perfil</th>
                <th className={styles.th}>Criado em</th>
                <th className={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td className={styles.td}>{u.name}</td>
                  <td className={styles.td}>{u.email}</td>
                  <td className={styles.td}>{u.role}</td>
                  <td className={styles.td}>{format(new Date(u.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</td>
                  <td className={styles.td}>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteUser(u.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'create' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Novo Usuário</h2>
          <div className={styles.form}>
            {['name', 'email', 'password'].map((field) => (
              <div key={field} className={styles.field}>
                <label className={styles.label}>
                  {{ name: 'Nome', email: 'Email', password: 'Senha' }[field]}
                </label>
                <input
                  className={styles.input}
                  type={field === 'password' ? 'password' : 'text'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}
            <div className={styles.field}>
              <label className={styles.label}>Perfil</label>
              <select
                className={styles.input}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className={styles.button} onClick={handleCreateUser}>
              Criar Usuário
            </button>
            {formMsg.text && (
              <p className={formMsg.success ? styles.messageSuccess : styles.messageError}>
                {formMsg.text}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}