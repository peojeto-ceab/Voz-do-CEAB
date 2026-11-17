'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ConscientizacaoPage() {
  const [mostrandoContatos, setMostrandoContatos] = useState(false)

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
      {/* Cabeçalho */}
      <header style={{ 
        width: '100%', 
        maxWidth: '700px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '25px',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        paddingBottom: '20px'
      }}>
        <div>
          <Link 
            href="/" 
            style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none', display: 'inline-block', marginBottom: '6px' }}
          >
            ← Voltar à Página Inicial
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>{mostrandoContatos ? '📞' : '📖'}</span>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
              {mostrandoContatos ? 'Contatos Úteis & Apoio' : 'Guia de Conscientização'}
            </h1>
          </div>
        </div>

        {/* Botão Dinâmico de Topo */}
        <button 
          onClick={() => setMostrandoContatos(!mostrandoContatos)}
          style={{ 
            fontSize: '12px', 
            background: mostrandoContatos ? 'rgba(56, 189, 248, 0.15)' : 'rgba(239, 68, 68, 0.2)', 
            color: mostrandoContatos ? '#38bdf8' : '#fca5a5', 
            padding: '9px 16px', 
            borderRadius: '8px', 
            border: mostrandoContatos ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(239, 68, 68, 0.5)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
            boxShadow: mostrandoContatos ? '0 0 10px rgba(56, 189, 248, 0.15)' : '0 0 12px rgba(239, 68, 68, 0.25)'
          }}
        >
          <span>{mostrandoContatos ? '📖' : '📞'}</span>
          {mostrandoContatos ? 'Ver Guia' : 'Contatos Úteis'}
        </button>
      </header>

      {/* Conteúdo dinâmico */}
      <main style={{ width: '100%', maxWidth: '700px' }}>
        
        {mostrandoContatos ? (
          /* SECÇÃO DE CONTATOS ÚTEIS COM FUNDO VERMELHO ELEGANTE */
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px', 
            background: 'linear-gradient(135deg, rgba(136, 19, 55, 0.35) 0%, rgba(15, 23, 42, 0.9) 100%)', 
            border: '1px solid rgba(244, 63, 94, 0.35)', 
            padding: '24px', 
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}>
            <div>
              <h2 style={{ fontSize: '18px', color: '#fb7185', margin: '0 0 6px 0' }}>Canais de Apoio Oficial</h2>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
                Contatos oficiais e de emergência para apoio imediato e proteção segura.
              </p>
            </div>

            {/* 190 */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', padding: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <h3 style={{ fontSize: '16px', color: '#38bdf8', margin: '0 0 6px 0' }}>📞 190 — Polícia Militar</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>Para denúncias graves, crimes em andamento ou situações de perigo imediato e urgência policial.</p>
            </div>

            {/* 180 */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', padding: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <h3 style={{ fontSize: '16px', color: '#f472b6', margin: '0 0 6px 0' }}>📞 180 — Central de Atendimento à Mulher</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>Serviço essencial para registar denúncias, reclamações, orientações e apoio sobre violência contra a mulher.</p>
            </div>

            {/* 100 */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', padding: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <h3 style={{ fontSize: '16px', color: '#4ade80', margin: '0 0 6px 0' }}>📞 100 — Direitos Humanos</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>Recebe e encaminha denúncias de violações de direitos humanos, incluindo proteção infantojuvenil e bullying.</p>
            </div>

            {/* SAMU 192 */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', padding: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <h3 style={{ fontSize: '16px', color: '#f87171', margin: '0 0 6px 0' }}>🚑 192 — SAMU (Urgência Médica)</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>Para atendimento de urgências e emergências em saúde que necessitem de socorro imediato.</p>
            </div>

            {/* Conselho Tutelar */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', padding: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <h3 style={{ fontSize: '16px', color: '#a78bfa', margin: '0 0 6px 0' }}>🛡️ Conselho Tutelar</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>Órgão encarregado de zelar pelos direitos da criança e do adolescente no município.</p>
            </div>

            {/* E-mail da Escola */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', padding: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <h3 style={{ fontSize: '16px', color: '#fbbf24', margin: '0 0 6px 0' }}>✉️ E-mail Institucional da Escola</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 4px 0' }}>Canal interno direto com a gestão escolar para relatos e orientações sigilosas.</p>
              <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#94a3b8' }}>[E-mail da escola será adicionado em breve]</span>
            </div>
          </div>
        ) : (
          /* SECÇÃO DO GUIA DE CONSCIENTIZAÇÃO COMPLETO COM BARRINHAS NAS LATERAIS */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '10px', lineHeight: '1.5' }}>
              Identificar o problema é o primeiro passo para o resolver. Conheca abaixo os diferentes tipos de abusos e comportamentos inadequados que podes estar sendo observados ou a vivenciados. Se reconhecer alguma destas situações, não hesite em procurar apoio.
            </p>

            {/* 1. Abuso Psicológico / Emocional */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '22px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <h2 style={{ fontSize: '18px', color: '#38bdf8', marginBottom: '8px' }}>Abuso Psicológico / Emocional</h2>
              <p style={{ fontSize: '14px', color: '#cbd5e1', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                Envolve humilhações constantes, ameaças, isolamento, xingamentos, ridicularização ou quasquer atos que causem danos à autoestima, saúde mental e estabilidade emocional da pessoa.
              </p>
              
              <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', borderLeft: '5px solid #38bdf8', borderRight: '5px solid #38bdf8', padding: '14px 18px', borderRadius: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#38bdf8', display: 'block', marginBottom: '6px' }}>
                  SINAIS COMUNS A OBSERVAR:
                </span>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Críticas destrutivas frequentes</li>
                  <li>Tentativa de isolar a pessoa de amigos e colegas</li>
                  <li>Controlar o que veste, faz ou diz</li>
                </ul>
              </div>
            </div>

            {/* 2. Abuso Físico */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '22px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <h2 style={{ fontSize: '18px', color: '#f87171', marginBottom: '8px' }}>Abuso Físico</h2>
              <p style={{ fontSize: '14px', color: '#cbd5e1', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                Qualquer uso de força física não acidental que resulte em lesões, marcas, dores ou risco à integridade física da vítima, seja através de agressões diretas ou castigos corporais.
              </p>
              
              <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(248, 113, 113, 0.3)', borderLeft: '5px solid #f87171', borderRight: '5px solid #f87171', padding: '14px 18px', borderRadius: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#f87171', display: 'block', marginBottom: '6px' }}>
                  SINAIS COMUNS A OBSERVAR:
                </span>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Marcas de agressão, lesões ou hematumes frequentes e injustificados</li>
                  <li>Mudança drástica de comportamento perante contacto físico</li>
                  <li>Uso excessivo de roupas para esconder o corpo</li>
                </ul>
              </div>
            </div>

            {/* 3. Discriminação e Preconceito */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '22px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <h2 style={{ fontSize: '18px', color: '#4ade80', marginBottom: '8px' }}>Discriminação e Preconceito</h2>
              <p style={{ fontSize: '14px', color: '#cbd5e1', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                Qualquer tratamento diferenciado, ofensivo ou excludente baseado em raça, cor, etnia, religião, orientação sexual, género, origem ou condição social.
              </p>
              
              <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(74, 222, 128, 0.3)', borderLeft: '5px solid #4ade80', borderRight: '5px solid #4ade80', padding: '14px 18px', borderRadius: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#4ade80', display: 'block', marginBottom: '6px' }}>
                  SINAIS COMUNS A OBSERVAR:
                </span>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Piadas de teor preconceituoso ou pejorativo disfarçadas de "brincadeira"</li>
                  <li>Exclusão sistemática de grupos ou atividades académicas</li>
                  <li>Uso de expressões depreciativas direcionadas à identidade da pessoa</li>
                </ul>
              </div>
            </div>

            {/* 4. Bullying e Ciberbullying */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '22px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <h2 style={{ fontSize: '18px', color: '#facc15', marginBottom: '8px' }}>Bullying e Ciberbullying</h2>
              <p style={{ fontSize: '14px', color: '#cbd5e1', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                Agressões verbais, físicas ou psicológicas intencionais e repetitivas praticadas presencialmente (bullying) ou através de redes sociais, mensagens e plataformas digitais (ciberbullying).
              </p>
              
              <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(250, 204, 21, 0.3)', borderLeft: '5px solid #facc15', borderRight: '5px solid #facc15', padding: '14px 18px', borderRadius: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#facc15', display: 'block', marginBottom: '6px' }}>
                  SINAIS COMUNS A OBSERVAR:
                </span>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Perseguição contínua, apelidos pejorativos e intimidação</li>
                  <li>Exposição vexatória de fotos ou mensagens em redes sociais</li>
                  <li>Isolamento repentino e queda acentuada no rendimento escolar</li>
                </ul>
              </div>
            </div>

            {/* 5. Assédio Moral */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '22px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <h2 style={{ fontSize: '18px', color: '#c084fc', marginBottom: '8px' }}>Assédio Moral</h2>
              <p style={{ fontSize: '14px', color: '#cbd5e1', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                Condutas abusivas frequentes, gestos ou palavras que humilham, constrangem ou desestabilizam a pessoa no ambiente escolar ou profissional de forma continuada.
              </p>
              
              <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(192, 132, 252, 0.3)', borderLeft: '5px solid #c084fc', borderRight: '5px solid #c084fc', padding: '14px 18px', borderRadius: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#c084fc', display: 'block', marginBottom: '6px' }}>
                  SINAIS COMUNS A OBSERVAR:
                </span>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Sobrecarga intencional de tarefas ou imposição de prazos impossíveis</li>
                  <li>Isolamento profissional ou exclusão de tomadas de decisão</li>
                  <li>Críticas públicas constantes com o intuito de desmoralizar</li>
                </ul>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  )
}