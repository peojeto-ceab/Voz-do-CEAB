'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Função auxiliar para definir a cor correspondente de cada categoria com um toque mais vibrante e elegante
const getCategoriaStyle = (tipo: string) => {
  const tipoLower = (tipo || '').toLowerCase()
  if (tipoLower.includes('bullying')) {
    return { background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.5)', color: '#fde047' }
  }
  if (tipoLower.includes('ensino') || tipoLower.includes('pedagógica')) {
    return { background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.5)', color: '#93c5fd' }
  }
  if (tipoLower.includes('discriminação') || tipoLower.includes('preconceito')) {
    return { background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.5)', color: '#86efac' }
  }
  if (tipoLower.includes('psicológico') || tipoLower.includes('emocional')) {
    return { background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.5)', color: '#d8b4fe' }
  }
  if (tipoLower.includes('infraestrutura')) {
    return { background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.5)', color: '#fdba74' }
  }
  return { background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.5)', color: '#38bdf8' }
}

export default function Dashboard() {
  const [denuncias, setDenuncias] = useState<any[]>([])
  const [profissionaisPendentes, setProfissionaisPendentes] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [nomeSecretaria, setNomeSecretaria] = useState('Secretaria')
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  
  // Estados para controlar o Modal de Token
  const [modalAberto, setModalAberto] = useState(false)
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<any>(null)
  const [tokenDigitado, setTokenDigitado] = useState('')

  // Estados para controlar o Modal de Alerta / Mensagem Personalizada
  const [modalAlertaAberto, setModalAlertaAberto] = useState(false)
  const [mensagemAlerta, setMensagemAlerta] = useState({ titulo: '', texto: '', tipo: 'sucesso' })

  // Estados para controlar o Modal de Confirmação de Exclusão
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false)
  const [dadosExclusao, setDadosExclusao] = useState({ id: '', nome: '', status: '' })

  const router = useRouter()

  useEffect(() => {
    const logada = localStorage.getItem('secretaria_logada')
    const nomeSalvo = localStorage.getItem('secretaria_nome')

    if (!logada) {
      router.push('/login')
      return
    }

    if (nomeSalvo) {
      setNomeSecretaria(nomeSalvo)
    }

    async function carregarDados() {
      const { data: dadosDenuncias } = await supabase
        .from('denuncias')
        .select('*')
        .order('created_at', { ascending: false })

      if (dadosDenuncias) {
        setDenuncias(dadosDenuncias)
      }

      const { data: dadosPendentes } = await supabase
        .from('Profissionais')
        .select('*')
        .or('status.eq.pendente,status.eq.recuperacao')
        .order('nome', { ascending: true })

      if (dadosPendentes) {
        setProfissionaisPendentes(dadosPendentes)
      }

      setCarregando(false)
    }

    carregarDados()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('secretaria_logada')
    localStorage.removeItem('secretaria_nome')
    window.location.href = '/login'
  }

  const mostrarMensagem = (titulo: string, texto: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setMensagemAlerta({ titulo, texto, tipo })
    setModalAlertaAberto(true)
  }

  const alternarEstado = async (id: string, statusAtual: string) => {
    const novoStatus = statusAtual === 'Visto' ? 'Pendente' : 'Visto'

    const { error } = await supabase
      .from('denuncias')
      .update({ status: novoStatus })
      .eq('id', id)

    if (error) {
      mostrarMensagem('Erro', 'Não foi possível atualizar o estado.', 'erro')
      return
    }

    setDenuncias(denuncias.map(item => 
      item.id === id ? { ...item, status: novoStatus } : item
    ))
  }

  const abrirModalAprovacao = (prof: any) => {
    setProfissionalSelecionado(prof)
    setTokenDigitado('')
    setModalAberto(true)
  }

  const confirmarAprovacao = async () => {
    if (!profissionalSelecionado) return

    const isRecuperacao = profissionalSelecionado.status === 'recuperacao'
    const tamanhoEsperado = isRecuperacao ? 10 : 7

    if (tokenDigitado.trim().length !== tamanhoEsperado) {
      mostrarMensagem('Atenção', `O token deve conter exatamente ${tamanhoEsperado} dígitos.`, 'erro')
      return
    }

    if (tokenDigitado.trim() !== String(profissionalSelecionado.token).trim()) {
      mostrarMensagem('Token Incorreto', 'O token digitado não confere. A aprovação foi cancelada.', 'erro')
      return
    }

    const dadosAtualizacao: any = { status: 'aprovado', token: null }

    if (isRecuperacao && profissionalSelecionado.senha_temporaria) {
      dadosAtualizacao.senha = profissionalSelecionado.senha_temporaria
      dadosAtualizacao.senha_temporaria = null
    }

    const { error } = await supabase
      .from('Profissionais')
      .update(dadosAtualizacao)
      .eq('id', profissionalSelecionado.id)

    if (error) {
      mostrarMensagem('Erro no Servidor', 'Erro ao aprovar o profissional: ' + error.message, 'erro')
    } else {
      const acaoMsg = isRecuperacao ? 'Recuperação de acesso aprovada com sucesso!' : `Profissional aprovado para ${profissionalSelecionado.nome} com sucesso!`
      setProfissionaisPendentes(profissionaisPendentes.filter((item) => item.id !== profissionalSelecionado.id))
      setModalAberto(false)
      setProfissionalSelecionado(null)
      mostrarMensagem('Sucesso! 🎉', acaoMsg, 'sucesso')
    }
  }

  const solicitarRejeicao = (id: string, nome: string, status: string) => {
    setDadosExclusao({ id, nome, status })
    setModalConfirmacaoAberto(true)
  }

  const confirmarRejeicao = async () => {
    const { id, nome, status } = dadosExclusao
    const { error } = await supabase
      .from('Profissionais')
      .delete()
      .eq('id', id)

    setModalConfirmacaoAberto(false)

    if (error) {
      mostrarMensagem('Erro', 'Erro ao remover solicitação: ' + error.message, 'erro')
    } else {
      setProfissionaisPendentes(profissionaisPendentes.filter((item) => item.id !== id))
      const acaoTexto = status === 'recuperacao' ? 'Pedido de recuperação cancelado' : 'Cadastro rejeitado e removido'
      mostrarMensagem('Concluído', `${acaoTexto} para ${nome}.`, 'sucesso')
    }
  }

  const totalGeral = denuncias.length
  const totalPendentes = denuncias.filter(item => (item.status || 'Pendente') === 'Pendente').length
  const totalVistos = denuncias.filter(item => item.status === 'Visto').length

  const denunciasFiltradas = denuncias.filter(item => {
    const nomeAluno = (item.nome || '').toLowerCase()
    const termoBusca = busca.toLowerCase()
    const atendeBusca = nomeAluno.includes(termoBusca)

    const statusAtual = item.status || 'Pendente'
    const atendeFiltro = 
      filtroStatus === 'Todos' ? true : statusAtual === filtroStatus

    return atendeBusca && atendeFiltro
  })

  const isRecuperacaoModal = profissionalSelecionado?.status === 'recuperacao'
  const digitosModal = isRecuperacaoModal ? 10 : 7

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', 
      color: '#fff', 
      fontFamily: 'sans-serif',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <header style={{ 
        width: '100%', 
        maxWidth: '820px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        paddingBottom: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>🛡️ Painel da Secretaria</h1>
          <p style={{ fontSize: '13px', color: '#38bdf8', margin: '6px 0 0 0', fontWeight: '600' }}>
            Olá, {nomeSecretaria}! 👋 Bem-vindo(a) de volta.
          </p>
        </div>

        <button 
          onClick={handleLogout}
          style={{ 
            fontSize: '12px', 
            background: 'rgba(239, 68, 68, 0.15)', 
            color: '#fca5a5', 
            padding: '9px 16px', 
            borderRadius: '10px', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Terminar Sessão
        </button>
      </header>

      <main style={{ width: '100%', maxWidth: '820px' }}>
        
        {/* SECÇÃO DE APROVAÇÃO DE NOVOS PROFISSIONAIS E RECUPERAÇÕES */}
        {profissionaisPendentes.length > 0 && (
          <div style={{ 
            background: 'rgba(30, 41, 59, 0.75)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 248, 0.3)', 
            borderRadius: '20px', 
            padding: '24px', 
            marginBottom: '30px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            <h2 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
              🔑 Solicitações de Acesso e Recuperação ({profissionaisPendentes.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profissionaisPendentes.map((prof) => {
                const isRecuperacao = prof.status === 'recuperacao'
                return (
                  <div key={prof.id} style={{ 
                    background: 'rgba(15, 23, 42, 0.85)', 
                    border: isRecuperacao ? '1px solid rgba(250, 204, 21, 0.4)' : '1px solid rgba(255,255,255,0.08)', 
                    borderRadius: '14px', 
                    padding: '16px 18px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '15px', color: '#fff', fontWeight: '700' }}>{prof.nome}</h3>
                        <span style={{ 
                          fontSize: '10px', 
                          padding: '3px 8px', 
                          borderRadius: '6px', 
                          fontWeight: '800',
                          background: isRecuperacao ? 'rgba(250, 204, 21, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                          color: isRecuperacao ? '#facc15' : '#38bdf8'
                        }}>
                          {isRecuperacao ? '🔄 Recuperação de Senha' : '✨ Novo Registo'}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#94a3b8' }}>E-mail: <strong style={{ color: '#cbd5e1' }}>{prof.email}</strong></p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>SIGEDUC: <strong style={{ color: '#cbd5e1' }}>{prof.sigeduc}</strong></p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => abrirModalAprovacao(prof)}
                          style={{ background: '#4ade80', color: '#0f172a', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '800', fontSize: '12px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(74, 222, 128, 0.2)' }}
                        >
                          Aprovar
                        </button>
                        <button 
                          onClick={() => solicitarRejeicao(prof.id, prof.nome, prof.status)}
                          style={{ background: 'transparent', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                        >
                          Rejeitar
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Cartões de Contadores */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '25px' }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', padding: '18px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</span>
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>{totalGeral}</span>
          </div>
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(250, 204, 21, 0.3)', padding: '18px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#facc15', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pendentes</span>
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#facc15' }}>{totalPendentes}</span>
          </div>
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '18px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#4ade80', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vistos</span>
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#4ade80' }}>{totalVistos}</span>
          </div>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
          <input 
            type="text" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="🔍 Pesquisar pelo nome do aluno..."
            style={{
              width: '100%',
              padding: '14px 18px',
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '14px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
            }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            {['Todos', 'Pendente', 'Visto'].map((status) => {
              const ativo = filtroStatus === status
              return (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    border: ativo ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                    background: ativo ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                    color: ativo ? '#38bdf8' : '#94a3b8',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {status}
                </button>
              )
            })}
          </div>
        </div>

        <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#38bdf8', fontWeight: '700' }}>Ocorrências Registadas</h2>

        {carregando ? (
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>A carregar dados...</p>
        ) : denunciasFiltradas.length === 0 ? (
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Nenhuma ocorrência encontrada com esses critérios.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {denunciasFiltradas.map((item) => {
              const statusAtual = item.status || 'Pendente'
              const isVisto = statusAtual === 'Visto'
              const estiloTag = getCategoriaStyle(item.tipo)

              return (
                <div 
                  key={item.id} 
                  style={{ 
                    background: 'rgba(30, 41, 59, 0.75)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)', 
                    borderRadius: '20px', 
                    padding: '22px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '6px 14px', 
                      borderRadius: '10px', 
                      fontWeight: '800',
                      ...estiloTag 
                    }}>
                      {item.tipo || 'Geral'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                      {new Date(item.created_at).toLocaleDateString('pt-BR')} às {new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '3px', fontWeight: '700', textTransform: 'uppercase' }}>Nome do Aluno</span>
                      <span style={{ fontSize: '14px', color: '#fff', fontWeight: '700' }}>{item.nome || 'Não informado'}</span>
                    </div>

                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '3px', fontWeight: '700', textTransform: 'uppercase' }}>E-mail / Contato</span>
                      <span style={{ fontSize: '14px', color: '#fff', fontWeight: '700' }}>{item.contacto || 'Não informado'}</span>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', fontWeight: '700', textTransform: 'uppercase' }}>Descrição dos Fatos</span>
                    <p style={{ fontSize: '14px', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0 }}>
                      {item.descricao}
                    </p>
                  </div>

                  <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => alternarEstado(item.id, statusAtual)}
                      style={{ 
                        fontSize: '12px', 
                        cursor: 'pointer',
                        padding: '6px 14px', 
                        borderRadius: '10px', 
                        fontWeight: '800',
                        border: isVisto ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(250, 204, 21, 0.4)',
                        color: isVisto ? '#4ade80' : '#facc15', 
                        background: isVisto ? 'rgba(74, 222, 128, 0.12)' : 'rgba(250, 204, 21, 0.12)',
                        transition: 'all 0.2s'
                      }}
                      title="Clique para alternar o estado"
                    >
                      Estado: {statusAtual} {isVisto ? '✅' : '⏳'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* MODAL DE VALIDAÇÃO DE TOKEN */}
      {modalAberto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.95)', border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '440px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.7)', textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '18px', color: '#38bdf8', marginBottom: '10px', fontWeight: '800' }}>
              🔑 Confirmação do Token de {digitosModal} Dígitos
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>
              Insere o token de {digitosModal} números fornecido por <strong style={{ color: '#fff' }}>{profissionalSelecionado?.nome}</strong> para autorizar a operação:
            </p>

            <input 
              type="text"
              maxLength={digitosModal}
              autoFocus
              value={tokenDigitado}
              onChange={(e) => setTokenDigitado(e.target.value)}
              placeholder={digitosModal === 10 ? "0000000000" : "0000000"}
              style={{
                width: '100%', padding: '14px', background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(56, 189, 248, 0.5)', borderRadius: '12px', color: '#fff',
                fontSize: '18px', textAlign: 'center', letterSpacing: '4px', outline: 'none',
                marginBottom: '20px', fontWeight: 'bold'
              }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setModalAberto(false)}
                style={{
                  flex: 1, padding: '12px', background: 'transparent', color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px',
                  fontWeight: '700', fontSize: '13px', cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAprovacao}
                style={{
                  flex: 1, padding: '12px', background: '#4ade80', color: '#0f172a',
                  border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)'
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ALERTA PERSONALIZADO */}
      {modalAlertaAberto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px'
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.95)', 
            border: mensagemAlerta.tipo === 'erro' ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(74, 222, 128, 0.5)',
            borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '380px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.7)', textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              color: mensagemAlerta.tipo === 'erro' ? '#f87171' : '#4ade80', 
              marginBottom: '10px',
              fontWeight: '800' 
            }}>
              {mensagemAlerta.titulo}
            </h3>
            <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.5' }}>
              {mensagemAlerta.texto}
            </p>
            <button
              onClick={() => setModalAlertaAberto(false)}
              style={{
                width: '100%', padding: '12px', 
                background: mensagemAlerta.tipo === 'erro' ? '#f87171' : '#4ade80', 
                color: '#0f172a', border: 'none', borderRadius: '12px',
                fontWeight: '800', fontSize: '13px', cursor: 'pointer',
                boxShadow: mensagemAlerta.tipo === 'erro' ? '0 4px 12px rgba(248, 113, 113, 0.3)' : '0 4px 12px rgba(74, 222, 128, 0.3)'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO/REJEIÇÃO */}
      {modalConfirmacaoAberto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px'
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.95)', border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '400px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.7)', textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '18px', color: '#f87171', marginBottom: '10px', fontWeight: '800' }}>
              ⚠️ Confirmar Rejeição
            </h3>
            <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.5' }}>
              Tens a certeza que pretendes {dadosExclusao.status === 'recuperacao' ? 'cancelar o pedido de recuperação' : 'rejeitar/apagar o cadastro'} de <strong style={{ color: '#fff' }}>{dadosExclusao.nome}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setModalConfirmacaoAberto(false)}
                style={{
                  flex: 1, padding: '12px', background: 'transparent', color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px',
                  fontWeight: '700', fontSize: '13px', cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarRejeicao}
                style={{
                  flex: 1, padding: '12px', background: '#f87171', color: '#fff',
                  border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(248, 113, 113, 0.3)'
                }}
              >
                Sim, Rejeitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}