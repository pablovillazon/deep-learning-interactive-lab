import { useState } from 'react'
import { ActivationLab } from './modules/class-01/ActivationLab'
import { EnergyConsumptionLab } from './modules/class-02/EnergyConsumptionLab'
import { FloodRiskLab } from './modules/class-02/FloodRiskLab'
import './index.css'
type Page = 'home'|'activations'|'energy'|'flood'
const modules:[Page,string,string,string][]=[['activations','01 · Activación','Fundamentos de funciones no lineales','∿'],['energy','02 · Red shallow','Consumo eléctrico residencial','⌁'],['flood','02 · Red deep','Índice de inundación urbana','◎']]
function Home({go}:{go:(p:Page)=>void}) {
 return <div className="home"><span className="eyebrow">LABORATORIOS EDUCATIVOS · 2026</span><h1>Aprender Deep Learning<br/><em>experimentando.</em></h1><p className="intro">Conecta teoría, formulación matemática, simulación y programación. Cambia los parámetros y observa cómo las redes neuronales transforman sus entradas en predicciones.</p>
  <div className="hero-stats"><span><b>03</b> laboratorios iniciales</span><span><b>10</b> clases previstas</span><span><b>100 %</b> en el navegador</span></div>
  <h2>Laboratorios disponibles</h2><div className="cards">{modules.map(([key,title,description,icon])=><button type="button" className="module-card" key={key} onClick={()=>go(key)}><span className="module-icon">{icon}</span><span className="eyebrow">{title}</span><strong>{description}</strong><span className="module-link">Abrir simulador →</span></button>)}</div>
  <section className="panel roadmap"><h2>Próximas clases</h2><div className="roadmap-grid">{['03 · Funciones de pérdida','04 · Optimización','05 · Backpropagation','06 · Generalización','07 · Redes convolucionales','08 · Redes residuales','09 · Transformers','10 · Modelos generativos'].map(t=><div key={t} className="roadmap-item">{t}<span>Próximamente</span></div>)}</div></section>
  <p className="note">Proyecto docente independiente basado en conceptos de <cite>Understanding Deep Learning</cite> de Simon J. D. Prince. No es un producto oficial del libro.</p></div>
}
export default function App(){
 const [page,setPage]=useState<Page>('home'),[dark,setDark]=useState(false)
 const navigate=(p:Page)=>{setPage(p);window.scrollTo?.({top:0,behavior:'smooth'})}
 return <div className={`app ${dark?'theme-dark':''}`}>
   <header className="site-header"><div className="header-content"><button type="button" className="brand" onClick={()=>navigate('home')} aria-label="Ir al inicio"><span className="brand-symbol">◇</span><span>Deep Learning <b>Interactive Lab</b></span></button><nav aria-label="Navegación"><button className={page==='home'?'nav-active':''} onClick={()=>navigate('home')}>Inicio</button><button className={page!=='home'?'nav-active':''} onClick={()=>navigate('activations')}>Laboratorios</button><a href="https://github.com/pablovillazon/deep-learning-interactive-lab" target="_blank" rel="noreferrer">GitHub ↗</a></nav><button className="theme-toggle" onClick={()=>setDark(v=>!v)} aria-label={dark?'Activar tema claro':'Activar tema oscuro'}>{dark?'☀':'☾'}</button></div></header>
   <div className="workspace">{page!=='home' && <aside className="sidebar"><p className="eyebrow">EXPERIMENTOS</p>{modules.map(([key,title])=><button key={key} className={page===key?'selected':''} onClick={()=>navigate(key)}>{title}</button>)}<p className="sidebar-footnote">Todos los ejemplos incluyen parámetros ajustables y ecuaciones.</p></aside>}<main id="main-content" className="main-content">{page==='home'?<Home go={navigate}/>:page==='activations'?<ActivationLab/>:page==='energy'?<EnergyConsumptionLab/>:<FloodRiskLab/>}</main></div>
   <footer className="site-footer">Deep Learning Interactive Lab · v0.1.1 · Recurso educativo sin validación para decisiones de ingeniería.</footer>
 </div>
}
