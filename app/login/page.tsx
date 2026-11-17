'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export default function Login() {
  const [identificador, setIdentificador] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  const handleAceder = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    try {
      const valorBusca = identificador.trim()
      const senhaInformada = senha.trim()

      const { data, error } = await supabase
        .from('Profissionais')
        .select('*')

      if (error) {
        console.error('Erro no Supabase:', error)
        setErro('Erro de ligação à base de dados.')
        setCarregando(false)
        return
      }

      if (!data || data.length === 0) {
        setErro('A tabela Profissionais está vazia no Supabase.')
        setCarregando(false)
        return
      }

      const profissional = data.find((p: any) => {
        const matchIdentificador = 
          (p.email && p.email.toLowerCase() === valorBusca.toLowerCase()) ||
          (p.nome && p.nome.toLowerCase() === valorBusca.toLowerCase()) ||
          (p.sigeduc && String(p.sigeduc).trim() === valorBusca)

        return matchIdentificador
      })

      if (!profissional) {
        setErro('Utilizador não encontrado com este E-mail, Nome ou SIGEDUC.')
        setCarregando(false)
        return
      }

      if (String(profissional.senha).trim() !== senhaInformada) {
        setErro('Palavra-passe incorreta.')
        setCarregando(false)
        return
      }

      // Verificação se a conta já foi aprovada pela secretaria
      if (profissional.status !== 'aprovado') {
        setErro('A sua conta aguarda aprovação da secretaria.')
        setCarregando(false)
        return
      }

      localStorage.setItem('secretaria_logada', 'true')
      localStorage.setItem('secretaria_nome', profissional.nome || 'Secretaria')
      router.push('/dashboard')

    } catch (err) {
      console.error(err)
      setErro('Ocorreu um erro inesperado ao tentar entrar.')
      setCarregando(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', 
      color: '#fff', 
      fontFamily: 'sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        background: 'rgba(15, 23, 42, 0.9)', 
        backdropFilter: 'blur(10px)',
        padding: '35px', 
        borderRadius: '12px', 
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>🔐 Área da Secretaria</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '25px', lineHeight: '1.5' }}>
          Entre com o seu E-mail, Nome ou SIGEDUC e a palavra-passe.
        </p>

        <form onSubmit={handleAceder} style={{ textAlign: 'left' }}>
          {erro && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', color: '#fca5a5', textAlign: 'center' }}>
              {erro}
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '500', color: '#cbd5e1' }}>
              E-mail, Nome ou SIGEDUC
            </label>
            <input 
              type="text" 
              value={identificador} 
              onChange={(e) => setIdentificador(e.target.value)} 
              placeholder="Ex: 202645067958 ou Silas"
              style={{ 
                width: '100%', 
                padding: '12px 15px', 
                background: 'rgba(30, 41, 59, 0.8)', 
                border: '1px solid #475569', 
                color: '#fff', 
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '500', color: '#cbd5e1' }}>Palavra-passe</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              placeholder="••••••••"
              style={{ 
                width: '100%', 
                padding: '12px 15px', 
                background: 'rgba(30, 41, 59, 0.8)', 
                border: '1px solid #475569', 
                color: '#fff', 
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={carregando}
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: '#3b82f6', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              fontSize: '15px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            {carregando ? 'A verificar...' : 'Entrar no Panel'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <Link 
            href="/registrar-secretaria" 
            style={{ 
              fontSize: '13px', 
              color: '#38bdf8', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Novo funcionário? Registar-te aqui
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <Link 
            href="/recuperar" 
            style={{ 
              fontSize: '13px', 
              color: '#facc15', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Esqueceste-te da palavra-passe? Recuperar acesso
          </Link>
        </div>

        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
          <Link 
            href="/" 
            style={{ 
              display: 'inline-block',
              fontSize: '13px', 
              color: '#93c5fd', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}