'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export default function RecuperarAcesso() {
  const [identificador, setIdentificador] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [tokenGerado, setTokenGerado] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')
    setSucesso('')
    setTokenGerado('')

    try {
      const valorBusca = identificador.trim()
      const senhaInformada = novaSenha.trim()

      // 1. Procurar o profissional na tabela Profissionais
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
        setErro('A tabela Profissionais está vazia.')
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

      // 2. Gerar um token aleatório de 10 dígitos
      const tokenAleatorio = Math.floor(1000000000 + Math.random() * 9000000000).toString()

      // 3. Atualizar o registo no Supabase (guarda a senha temporária, o token e altera o status para 'recuperacao')
      const { error: updateError } = await supabase
        .from('Profissionais')
        .update({
          senha_temporaria: senhaInformada,
          token: tokenAleatorio,
          status: 'recuperacao'
        })
        .eq('id', profissional.id)

      if (updateError) {
        console.error('Erro ao atualizar:', updateError)
        setErro('Erro ao solicitar recuperação. Verifica se as colunas "token" e "senha_temporaria" existem na base de dados.')
        setCarregando(false)
        return
      }

      setTokenGerado(tokenAleatorio)
      setSucesso('Pedido de recuperação gerado com sucesso! A tua conta foi temporariamente suspensa até validação.')
      setCarregando(false)

    } catch (err) {
      console.error(err)
      setErro('Ocorreu um erro inesperado.')
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
        maxWidth: '420px', 
        background: 'rgba(15, 23, 42, 0.9)', 
        backdropFilter: 'blur(10px)',
        padding: '35px', 
        borderRadius: '12px', 
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>🔄 Recuperar Acesso</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '25px', lineHeight: '1.5' }}>
          Insere os teus dados e a nova palavra-passe. Um token de 10 dígitos será gerado para validação da secretaria.
        </p>

        {tokenGerado ? (
          <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80', padding: '20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#4ade80', marginBottom: '10px', fontWeight: 'bold' }}>
              {sucesso}
            </p>
            <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '5px' }}>O teu Token de Segurança (10 dígitos):</p>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#facc15', letterSpacing: '2px', background: 'rgba(15, 23, 42, 0.8)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(250, 204, 21, 0.3)' }}>
              {tokenGerado}
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>
              Guarda este token e apresenta-o à secretaria juntamente com o teu pedido.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRecuperar} style={{ textAlign: 'left' }}>
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
                placeholder="Ex: Carlos Souza"
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
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '500', color: '#cbd5e1' }}>
                Nova Palavra-passe
              </label>
              <input 
                type="password" 
                value={novaSenha} 
                onChange={(e) => setNovaSenha(e.target.value)} 
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
              {carregando ? 'A gerar token...' : 'Solicitar Recuperação'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
          <Link 
            href="/login" 
            style={{ 
              display: 'inline-block',
              fontSize: '13px', 
              color: '#93c5fd', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            ← Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  )
}