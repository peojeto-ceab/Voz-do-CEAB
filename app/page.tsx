'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export default function Home() {
  const [categoria, setCategoria] = useState('Geral')
  const [descricao, setDescricao] = useState('')
  const [nome, setNome] = useState('')
  const [contato, setContato] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!descricao.trim() || !nome.trim() || !contato.trim()) return

    setEnviando(true)
    setErro('')

    // Enviando cada campo separado para as suas colunas corretas no Supabase
    const { error: dbError } = await supabase
      .from('denuncias')
      .insert([
        {
          tipo: categoria,
          nome: nome.trim(),
          contacto: contato.trim(),
          descricao: descricao.trim(),
          status: 'Pendente'
        }
      ])

    if (dbError) {
      setErro('Erro ao enviar denúncia. Tenta novamente.')
      setEnviando(false)
    } else {
      setSucesso(true)
      setDescricao('')
      setNome('')
      setContato('')
      setEnviando(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', 
      color: '#fff', 
      fontFamily: 'sans-serif',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <header style={{ 
        width: '100%', 
        maxWidth: '700px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        paddingBottom: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>📢 Voz do CEAB</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>Canal seguro de escuta e relato da comunidade escolar</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link 
            href="/conscientizacao" 
            style={{ 
              fontSize: '12px', 
              background: 'rgba(30, 41, 59, 0.9)', 
              color: '#cbd5e1', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              textDecoration: 'none', 
              border: '1px solid rgba(255,255,255,0.2)',
              fontWeight: '500'
            }}
          >
            Conscientização
          </Link>

          <Link 
            href="/login" 
            style={{ 
              fontSize: '12px', 
              background: 'rgba(30, 41, 59, 0.9)', 
              color: '#cbd5e1', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              textDecoration: 'none', 
              border: '1px solid rgba(255,255,255,0.2)',
              fontWeight: '500'
            }}
          >
            Secretaria
          </Link>
        </div>
      </header>

      <main style={{ 
        width: '100%', 
        maxWidth: '700px', 
        background: 'rgba(15, 23, 42, 0.85)', 
        backdropFilter: 'blur(10px)',
        padding: '35px', 
        borderRadius: '12px', 
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Registar Ocorrência ou Denúncia</h2>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '15px', lineHeight: '1.5' }}>
          Preencha os seus dados de identificação e os detalhes da ocorrência para envio à administração.
        </p>

        {/* Frase de garantia de segurança, sigilo e prevenção contra trotes */}
        <div style={{ 
          background: 'rgba(59, 130, 246, 0.1)', 
          border: '1px solid rgba(59, 130, 246, 0.3)', 
          padding: '12px 15px', 
          borderRadius: '8px', 
          marginBottom: '25px',
          fontSize: '13px',
          color: '#93c5fd',
          lineHeight: '1.4'
        }}>
          A sua identidade e os seus dados são tratados com total sigilo, respeito e discrição. Solicitamos estas informações estritamente por medida de segurança para validar a veracidade e evitar trotes.
        </div>

        {sucesso ? (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '16px', color: '#34d399', marginBottom: '8px' }}>Relato enviado com sucesso!</h3>
            <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '20px' }}>Obrigado por ajudar a manter a nossa comunidade escolar segura e transparente.</p>
            <button 
              onClick={() => setSucesso(false)}
              style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Enviar Novo Relato
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {erro && (
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', color: '#fca5a5' }}>
                {erro}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '500', color: '#cbd5e1' }}>Nome Completo (Obrigatório)</label>
              <input 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                placeholder="Insira o seu nome..."
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
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '500', color: '#cbd5e1' }}>Contacto / E-mail (Obrigatório)</label>
              <input 
                type="text" 
                value={contato} 
                onChange={(e) => setContato(e.target.value)} 
                placeholder="Insira o seu e-mail ou telefone..."
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
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '500', color: '#cbd5e1' }}>Categoria</label>
              <select 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)}
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
              >
                <option value="Geral">Geral / Outros</option>
                <option value="Bullying">Bullying ou Assédio</option>
                <option value="Infraestrutura">Problema na Infraestrutura</option>
                <option value="Ensino">Questão Pedagógica</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '500', color: '#cbd5e1' }}>Descrição dos Factos</label>
              <textarea 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                placeholder="Descreve detalhadamente o que aconteceu..."
                rows={5}
                style={{ 
                  width: '100%', 
                  padding: '12px 15px', 
                  background: 'rgba(30, 41, 59, 0.8)', 
                  border: '1px solid #475569', 
                  color: '#fff', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={enviando}
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
                transition: 'background 0.2s'
              }}
            >
              {enviando ? 'A enviar...' : 'Submeter Denúncia'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}