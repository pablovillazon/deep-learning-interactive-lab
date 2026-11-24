import { useState } from 'react'
import { activate, activationLatex, type ActivationName } from '../../core/activations'
import { LinePlot } from '../../components/LinePlot'
import { MathFormula } from '../../components/MathFormula'
import { SliderField } from '../../components/SliderField'
const names: Record<ActivationName,string> = { relu:'ReLU',leakyRelu:'Leaky ReLU',sigmoid:'Sigmoide',tanh:'Tangente hiperbólica' }
const colors:Record<ActivationName,string> = {relu:'#0f766e',leakyRelu:'#d97706',sigmoid:'#2563eb',tanh:'#9333ea'}
export function ActivationLab() {
  const [selected,setSelected]=useState<ActivationName>('relu'), [input,setInput]=useState(-1)
  const samples=Array.from({length:121},(_,i)=>-6+i*.1)
  const result=activate(selected,input)
  return <div className="lab-stack">
    <div className="hero-text"><span className="eyebrow">CLASE 01 · FUNDAMENTOS</span><h1>Funciones de activación</h1><p>Una transformación no lineal permite a la red representar funciones más complejas que una transformación afín.</p></div>
    <section className="panel"><h2>1. Modelo matemático</h2><p>Selecciona una función y modifica la preactivación z.</p>
      <div className="tabrow" role="group" aria-label="Seleccionar activación">{(Object.keys(names) as ActivationName[]).map(k=><button key={k} type="button" className={`pill ${selected===k?'active':''}`} onClick={()=>setSelected(k)} aria-pressed={selected===k}>{names[k]}</button>)}</div>
      <MathFormula block latex={activationLatex[selected]}/><LinePlot series={[{label:names[selected],color:colors[selected],values:samples.map(z=>[z,activate(selected,z)])}]} xRange={[-6,6]} yRange={[-6,6]} xLabel="Preactivación z" yLabel="Activación f(z)" marker={[input,result]}/>
      <SliderField label="Preactivación z" min={-6} max={6} step={.1} value={input} onChange={setInput}/><div className="metric-row"><div className="metric"><span>Entrada z</span><strong>{input.toFixed(2)}</strong></div><div className="metric"><span>Salida f(z)</span><strong>{result.toFixed(4)}</strong></div></div>
    </section>
    <section className="panel"><h2>2. Preguntas para investigar</h2><ol className="questions"><li>¿En qué intervalo la salida de ReLU vale cero?</li><li>¿Qué sucede si z es muy negativo en la sigmoide?</li><li>¿Qué relación existe entre la no linealidad y la profundidad de una red?</li></ol><p className="note">Estas visualizaciones muestran transformaciones matemáticas, no un proceso de entrenamiento.</p></section>
  </div>
}
