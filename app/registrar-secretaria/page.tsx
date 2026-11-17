'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function RegistarSecretaria() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [sigeduc, setSigeduc] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })
  const [carregando, setCarregando] = useState(false)
  const [tokenGerado, setTokenGerado] = useState('')
  const router = useRouter()

  const handleRegistar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setMensagem({ texto: '', tipo: '' })
    setTokenGerado('')

    if (!nome || !email || !sigeduc || !senha) {
      setMensagem({ texto: 'Por favor, preenche todos os campos.', tipo: 'erro' })
      setCarregando(false)
      return
    }

    // 1. Gera um token aleatório de 7 dígitos
    const tokenAleatorio = Math.floor(1000000 + Math.random() * 9000000).toString()

    // 2. Insere os dados juntamente com o token e o status 'pendente' na tabela Profissionais
    const { error } = await supabase
      .from('Profissionais')
      .insert([
        { 
          nome, 
          email, 
          sigeduc, 
          senha, 
          token: tokenAleatorio, 
          status: 'pendente' 
        }
      ])

    if (error) {
      setMensagem({ texto: 'Erro ao registar. O e-mail ou SIGEDUC já podem existir.', tipo: 'erro' })
      setCarregando(false)
    } else {
      setTokenGerado(tokenAleatorio)
      setMensagem({ 
        texto: `Registo efetuado com sucesso! O teu token de confirmação de 7 dígitos foi gerado abaixo. Apresenta-o a um secretário para validação.`, 
        tipo: 'sucesso' 
      })
      setCarregando(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <form onSubmit={handleRegistar} style={{ 
        background: 'rgba(15, 23, 42, 0.85)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        padding: '35px', 
        borderRadius: '16px', 
        width: '100%', 
        maxWidth: '420px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        color: '#fff'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>📝 Novo Profissional</h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', marginBottom: '25px' }}>Registo de acesso para a secretaria</p>

        {mensagem.texto && (
          <div style={{ 
            padding: '12px', 
            borderRadius: '8px', 
            fontSize: '13px', 
            marginBottom: '15px', 
            textAlign: 'center',
            background: mensagem.tipo === 'erro' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(74, 222, 128, 0.2)',
            color: mensagem.tipo === 'erro' ? '#fca5a5' : '#4ade80',
            border: mensagem.tipo === 'erro' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(74, 222, 128, 0.4)'
          }}>
            {mensagem.texto}
          </div>
        )}

        {tokenGerado && (
          <div style={{ 
            background: 'rgba(56, 189, 248, 0.1)', 
            border: '1px dashed #38bdf8', 
            padding: '15px', 
            borderRadius: '8px', 
            textAlign: 'center', 
            marginBottom: '20px' 
          }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>O TEU TOKEN DE 7 DÍGITOS:</span>
            <strong style={{ fontSize: '26px', color: '#38bdf8', letterSpacing: '3px' }}>{tokenGerado}</strong>
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Nome Completo</label>
          <input 
            type="text" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Maria Silva"
            style={{ width: '100%', padding: '10px 12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>E-mail institucional</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@ceab.edu.br"
            style={{ width: '100%', padding: '10px 12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>SIGEDUC</label>
          <input 
            type="text" 
            value={sigeduc}
            onChange={(e) => setSigeduc(e.target.value)}
            placeholder="O seu ID SIGEDUC"
            style={{ width: '100%', padding: '10px 12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Palavra-passe (Senha)</label>
          <input 
            type="password" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Crie uma senha segura"
            style={{ width: '100%', padding: '10px 12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={carregando}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#38bdf8', 
            color: '#0f172a', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            fontSize: '14px', 
            cursor: 'pointer',
            marginBottom: '15px'
          }}
        >
          {carregando ? 'A registar...' : 'Criar Conta e Gerar Token'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <a href="/login" style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none' }}>
            Já tens conta aprovada? <span style={{ color: '#38bdf8' }}>Entrar</span>
          </a>
        </div>
      </form>
    </div>
  )
}