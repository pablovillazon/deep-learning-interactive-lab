import { useState } from 'react'
import { MathFormula } from '../../components/MathFormula'
import { NetworkDiagram } from '../../components/NetworkDiagram'
import { SliderField } from '../../components/SliderField'
import { INITIAL_FLOOD, predictFlood, updateFloodBias, updateFloodWeight, type FloodParameters } from './models'
const clone=():FloodParameters=>({w1:INITIAL_FLOOD.w1.map(r=>[...r]),b1:[...INITIAL_FLOOD.b1],w2:INITIAL_FLOOD.w2.map(r=>[...r]),b2:[...INITIAL_FLOOD.b2],w3:INITIAL_FLOOD.w3.map(r=>[...r]),b3:[...INITIAL_FLOOD.b3]})
export function FloodRiskLab() {
  const [rain,setRain]=useState(.9), [drain,setDrain]=useState(.3)
  const [p,setP]=useState<FloodParameters>(clone)
  const result=predictFlood([rain,drain],p)
  return <div className="lab-stack"><div className="hero-text"><span className="eyebrow">CLASE 02 · REDES DEEP</span><h1>Riesgo de inundación urbana</h1><p>Una red 2–3–2–1 que combina indicadores intermedios, permitiendo ver cómo un cambio en las primeras capas afecta a las posteriores.</p></div>
    <section className="panel"><h2>1. Arquitectura y formulación</h2><p>Las entradas normalizadas son intensidad de lluvia (x₁) y capacidad disponible de drenaje (x₂). Las dos capas ocultas aplican ReLU; la salida es lineal.</p><NetworkDiagram layers={[2,3,2,1]} values={[[rain,drain],result.first,result.second,[result.output]]}/><MathFormula block latex={String.raw`\mathbf h=\operatorname{ReLU}(W_1\mathbf x+\mathbf b_1)`}/><MathFormula block latex={String.raw`\mathbf g=\operatorname{ReLU}(W_2\mathbf h+\mathbf b_2)`}/><MathFormula block latex={String.raw`\hat y=W_3\mathbf g+b_3`}/><p className="note important">Advertencia: indicador didáctico sin calibración hidráulica. La salida no representa una probabilidad y puede exceder 1. No se debe utilizar para tomar decisiones reales de seguridad.</p></section>
    <section className="panel"><h2>2. Entradas y activaciones</h2><div className="metric-row"><div className="metric"><span>Lluvia normalizada</span><strong>{rain.toFixed(2)}</strong></div><div className="metric"><span>Drenaje normalizado</span><strong>{drain.toFixed(2)}</strong></div><div className="metric accent"><span>Índice estimado</span><strong>{result.output.toFixed(3)}</strong></div></div>
      <div className="control-grid"><SliderField label="Intensidad de lluvia (x₁)" min={0} max={1} step={.05} value={rain} onChange={setRain}/><SliderField label="Capacidad de drenaje (x₂)" min={0} max={1} step={.05} value={drain} onChange={setDrain}/></div>
      <div className="activation-table"><div><h3>Primera capa</h3>{result.first.map((v,i)=><p key={i}>h{i+1} = <strong>{v.toFixed(3)}</strong></p>)}</div><div><h3>Segunda capa</h3>{result.second.map((v,i)=><p key={i}>g{i+1} = <strong>{v.toFixed(3)}</strong></p>)}</div><div><h3>Salida</h3><p>ŷ = <strong>{result.output.toFixed(3)}</strong></p></div></div>
    </section>
    <section className="panel"><h2>3. Los 20 parámetros entrenables</h2><p>Modifica cualquier elemento de las matrices de pesos o de los vectores de sesgos. Cada cambio se propaga inmediatamente a las activaciones y al resultado.</p>
      {(['w1','w2','w3'] as const).map((key,ix)=><div className="weights-section" key={key}><h3>Pesos W{ix+1} <small>{p[key].length} × {p[key][0].length}</small></h3><div className="weight-grid">{p[key].map((row,i)=>row.map((v,j)=><SliderField key={`${i}-${j}`} label={`w${ix+1}[${i+1},${j+1}]`} min={-4} max={4} step={.1} value={v} onChange={n=>setP(q=>updateFloodWeight(q,key,i,j,n))}/>))}</div><h3>Sesgos b{ix+1}</h3><div className="weight-grid">{p[`b${ix+1}` as 'b1'|'b2'|'b3'].map((v,i)=><SliderField key={i} label={`b${ix+1}[${i+1}]`} min={-3} max={3} step={.1} value={v} onChange={n=>setP(q=>updateFloodBias(q,`b${ix+1}` as 'b1'|'b2'|'b3',i,n))}/>)}</div></div>)}
      <button className="button-secondary" onClick={()=>{setRain(.9);setDrain(.3);setP(clone())}}>Restablecer parámetros</button>
    </section>
    <section className="panel"><h2>4. Discusión y experimentos</h2><ol className="questions"><li>Fija x₁ = 0.9 y aumenta x₂. ¿El indicador disminuye siempre?</li><li>Transforma el peso W₁[1,2] de −1 a +1. ¿Qué significado físico adquiere la primera neurona?</li><li>Fija todos los pesos W₃ en cero. ¿Qué papel cumple b₃?</li><li>¿Por qué es incorrecto interpretar la salida 1.14 como una probabilidad del 114 %?</li></ol><details><summary>Ver implementación equivalente en Python</summary><pre>{`import numpy as np
def relu(z): return np.maximum(0,z)
W1=np.array([[1,-1],[1,0],[0,-1]])
b1=np.array([0,-.6,.5])
W2=np.array([[2,1,0],[1,0,2]])
b2=np.array([-.2,-.1])
W3=np.array([[.6,.4]])
b3=np.array([0.])
x=np.array([.9,.3])
h=relu(W1@x+b1)
g=relu(W2@h+b2)
print(W3@g+b3) # [1.14]`}</pre></details></section>
  </div>
}
