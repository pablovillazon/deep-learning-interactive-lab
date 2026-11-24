import { useState } from 'react'
import { LinePlot } from '../../components/LinePlot'
import { MathFormula } from '../../components/MathFormula'
import { NetworkDiagram } from '../../components/NetworkDiagram'
import { SliderField } from '../../components/SliderField'
import { INITIAL_ENERGY, predictEnergy, type EnergyParameters } from './models'
const fields: {key:keyof EnergyParameters;label:string;min:number;max:number;step:number}[] = [
  {key:'w1',label:'Peso entrada → neurona 1 (w₁)',min:-2,max:2,step:0.1},
  {key:'b1',label:'Sesgo de neurona 1 (b₁)',min:0,max:30,step:1},
  {key:'w2',label:'Peso entrada → neurona 2 (w₂)',min:-2,max:2,step:0.1},
  {key:'b2',label:'Sesgo de neurona 2 (b₂)',min:-36,max:0,step:1},
  {key:'heatingWeight',label:'Peso de salida φ₁',min:-2,max:2,step:0.1},
  {key:'coolingWeight',label:'Peso de salida φ₂',min:-2,max:2,step:0.1},
  {key:'base',label:'Sesgo de salida φ₀',min:-2,max:12,step:0.5},
]
export function EnergyConsumptionLab() {
  const [temp,setTemp]=useState(30)
  const [p,setP]=useState<EnergyParameters>({...INITIAL_ENERGY})
  const [showOriginal,setShowOriginal]=useState(true)
  const result=predictEnergy(temp,p)
  const samples=Array.from({length:81},(_,i)=>i*.5)
  const curves = samples.flatMap(x=>[predictEnergy(x,INITIAL_ENERGY).output,predictEnergy(x,p).output])
  const minY=Math.min(0,...curves)-4, maxY=Math.max(0,...curves)+4
  return <div className="lab-stack"><div className="hero-text"><span className="eyebrow">CLASE 02 · REDES SHALLOW</span><h1>Consumo eléctrico de una vivienda</h1><p>Explora cómo los pesos y sesgos transforman una entrada —temperatura— en una predicción de consumo eléctrico.</p></div>
    <section className="panel"><h2>1. Contexto y arquitectura</h2><p>Una vivienda puede requerir energía adicional cuando hace frío o cuando hace calor. Este modelo ilustrativo utiliza dos neuronas ReLU y una salida lineal.</p><NetworkDiagram layers={[1,2,1]} values={[[temp],result.hidden,[result.output]]}/><MathFormula block latex={String.raw`\hat{y}=\phi_0+\phi_1\max(0,w_1x+b_1)+\phi_2\max(0,w_2x+b_2)`}/>
    <p className="note">Sus parámetros se eligieron manualmente para enseñar; las predicciones no provienen de datos medidos ni de un modelo validado.</p></section>
    <section className="panel"><h2>2. Simulador</h2><div className="metric-row"><div className="metric"><span>Temperatura</span><strong>{temp.toFixed(1)} °C</strong></div><div className="metric accent"><span>Consumo estimado</span><strong>{result.output.toFixed(2)} kWh</strong></div></div>
      <LinePlot series={[...(showOriginal?[{label:'Parámetros originales',color:'#94a3b8',dashed:true,values:samples.map(x=>[x,predictEnergy(x,INITIAL_ENERGY).output] as [number,number])}]:[]),{label:'Modelo actual',color:'#0f766e',values:samples.map(x=>[x,predictEnergy(x,p).output] as [number,number])}]} xRange={[0,40]} yRange={[minY,maxY]} xLabel="Temperatura (°C)" yLabel="Consumo estimado (kWh)" marker={[temp,result.output]}/>
      <label className="checkbox"><input type="checkbox" checked={showOriginal} onChange={e=>setShowOriginal(e.target.checked)}/> Mostrar curva original</label>
      <SliderField label="Temperatura de entrada (°C)" min={0} max={40} step={.5} value={temp} onChange={setTemp} precision={1}/>
      <div className="control-grid">{fields.map(f=><SliderField key={f.key} label={f.label} min={f.min} max={f.max} step={f.step} value={p[f.key]} onChange={n=>setP(v=>({...v,[f.key]:n}))}/>)}</div>
      <button className="button-secondary" onClick={()=>{setTemp(30);setP({...INITIAL_ENERGY})}}>Restablecer valores originales</button>
    </section>
    <section className="panel"><h2>3. Propagación hacia delante</h2><div className="steps"><div><span>Neurona 1 (frío)</span><MathFormula block latex={String.raw`h_1=\max(0,(${p.w1.toFixed(1)})(${temp.toFixed(1)})+(${p.b1.toFixed(1)}))=${result.hidden[0].toFixed(2)}`}/></div><div><span>Neurona 2 (calor)</span><MathFormula block latex={String.raw`h_2=\max(0,(${p.w2.toFixed(1)})(${temp.toFixed(1)})+(${p.b2.toFixed(1)}))=${result.hidden[1].toFixed(2)}`}/></div><div><span>Predicción</span><MathFormula block latex={String.raw`\hat y=${p.base.toFixed(1)}+(${p.heatingWeight.toFixed(1)})(${result.hidden[0].toFixed(2)})+(${p.coolingWeight.toFixed(1)})(${result.hidden[1].toFixed(2)})=${result.output.toFixed(2)}`}/></div></div></section>
    <section className="panel"><h2>4. Interpretación y experimentos</h2><p>Puedes modificar <strong>los siete parámetros</strong>: dos pesos de entrada, dos sesgos ocultos, dos pesos de salida y un sesgo de salida. En el estado original, w₁ = −1, b₁ = 18 definen el umbral de calefacción; w₂ = 1, b₂ = −24 definen el umbral de refrigeración. En otros ajustes, las neuronas ya no tienen necesariamente esa interpretación.</p><ol className="questions"><li>Eleva φ₀. ¿Cómo se transforma la curva?</li><li>Haz φ₂ = 0. ¿Qué ocurre con el tramo de alta temperatura?</li><li>Haz negativo φ₁. ¿Qué interpretación física tendría el nuevo modelo?</li></ol><details><summary>Ver implementación equivalente en Python</summary><pre>{`import numpy as np
def energy(x, heat=18, cool=24, wh=0.8, wc=1.2, base=5):
    return base + wh*np.maximum(0,heat-x) + wc*np.maximum(0,x-cool)
print(energy(30)) # 12.2`}</pre></details></section></div>
}
