import { MathFormula } from '../../components/MathFormula'
import { NetworkDiagram } from '../../components/NetworkDiagram'
import { INITIAL_FLOOD, predictFlood, type FloodParameters } from './models'

const snapshot = predictFlood([0.9,0.3],INITIAL_FLOOD)
const scenarioRows: {label:string;rain:number;drain:number;modify?:(p:FloodParameters)=>FloodParameters}[] = [
 {label:'Escenario original',rain:.9,drain:.3},
 {label:'Mayor capacidad de drenaje',rain:.9,drain:.8},
 {label:'Mayor influencia de h₁ en g₁',rain:.9,drain:.3,modify:p=>({...p,w2:p.w2.map((row,i)=>i===0?[4,...row.slice(1)]:[...row])})},
 {label:'Sin contribución de g₁ a la salida',rain:.9,drain:.3,modify:p=>({...p,w3:[[0,.4]]})},
 {label:'Signo de W₁[1,2] invertido',rain:.9,drain:.3,modify:p=>({...p,w1:[[1,1],...p.w1.slice(1).map(row=>[...row])]})},
]
const scenarios=scenarioRows.map(s=>({label:s.label,output:predictFlood([s.rain,s.drain],s.modify?s.modify(INITIAL_FLOOD):INITIAL_FLOOD).output}))

export function FloodLearningTheory(){
 return <>
   <section className="panel theory-section"><h2>1. Planteamiento del problema</h2>
     <p>Un municipio desea analizar cómo la <strong>intensidad de precipitación</strong> y la <strong>capacidad de drenaje urbano</strong> se relacionan con un indicador de vulnerabilidad ante inundaciones. Una precipitación elevada puede generar problemas distintos según la capacidad de drenaje disponible: las variables deben analizarse conjuntamente.</p>
     <div className="concept-grid"><div className="concept-card"><span>Entrada x₁ ∈ [0,1]</span><strong>Intensidad de precipitación normalizada</strong></div><div className="concept-card"><span>Entrada x₂ ∈ [0,1]</span><strong>Capacidad de drenaje normalizada</strong></div><div className="concept-card"><span>Salida ŷ ∈ ℝ</span><strong>Indicador numérico ilustrativo</strong></div></div>
     <p className="note important">Este ejemplo NO es un modelo hidráulico validado. Las normalizaciones no representan unidades físicas calibradas. La salida puede superar 1, no es una probabilidad y no sirve para decisiones reales de seguridad.</p>
   </section>
   <section className="panel theory-section"><h2>2. Arquitectura propuesta: red deep 2–3–2–1</h2>
     <p>La red tiene <strong>dos entradas, dos capas ocultas y una salida lineal</strong>. La primera capa crea tres características intermedias: exceso de lluvia, intensidad alta de lluvia y déficit de drenaje. La segunda combina estas características y la salida produce el indicador final.</p>
     <NetworkDiagram layers={[2,3,2,1]} values={[[.9,.3],snapshot.first,snapshot.second,[snapshot.output]]}/>
     <div className="concept-grid"><div className="concept-card"><span>Capa oculta 1</span><strong>3 neuronas ReLU</strong><small>Características iniciales</small></div><div className="concept-card"><span>Capa oculta 2</span><strong>2 neuronas ReLU</strong><small>Composición de características</small></div><div className="concept-card"><span>Salida</span><strong>1 neurona lineal</strong><small>Indicador continuo</small></div></div>
     <p>Cuenta de parámetros entrenables: <strong>3 × (2 + 1) = 9</strong> en la primera capa; <strong>2 × (3 + 1) = 8</strong> en la segunda; <strong>1 × (2 + 1) = 3</strong> en la salida. Total: <strong>20 parámetros</strong>.</p>
   </section>
   <section className="panel theory-section"><h2>3. Fundamentación matemática y significado de las capas</h2>
     <p>La composición utiliza multiplicaciones matriciales, sesgos y activaciones ReLU. Una transformación afín precede a cada ReLU y la salida permanece lineal, por lo que su valor no está restringido al intervalo [0,1].</p>
     <MathFormula block latex={String.raw`\mathbf h=\operatorname{ReLU}(W_1\mathbf x+\mathbf b_1)`}/>
     <MathFormula block latex={String.raw`\mathbf g=\operatorname{ReLU}(W_2\mathbf h+\mathbf b_2)`}/>
     <MathFormula block latex={String.raw`\hat y=W_3\mathbf g+b_3`}/>
     <h3>Primera capa: identificar patrones</h3>
     <MathFormula block latex={String.raw`h_1=\max(0,x_1-x_2)`}/>
     <MathFormula block latex={String.raw`h_2=\max(0,x_1-0.6)`}/>
     <MathFormula block latex={String.raw`h_3=\max(0,0.5-x_2)`}/>
     <p>Con los coeficientes originales, h₁ se activa cuando la lluvia supera el drenaje; h₂, cuando la lluvia supera 0.6; h₃, cuando el drenaje es inferior a 0.5. Son <em>interpretaciones intencionadas</em> de esta construcción, no propiedades garantizadas para redes entrenadas.</p>
     <MathFormula block latex={String.raw`W_1=\begin{bmatrix}1&-1\\1&0\\0&-1\end{bmatrix},\qquad \mathbf b_1=\begin{bmatrix}0\\-0.6\\0.5\end{bmatrix}`}/>
     <h3>Segunda capa: combinar los patrones</h3>
     <MathFormula block latex={String.raw`g_1=\max(0,2h_1+h_2-0.2)`}/>
     <MathFormula block latex={String.raw`g_2=\max(0,h_1+2h_3-0.1)`}/>
     <p>g₁ combina exceso y lluvia intensa; g₂ combina exceso y déficit de drenaje. Esto ilustra la <strong>composición jerárquica</strong> de características que permiten las redes profundas.</p>
     <MathFormula block latex={String.raw`W_2=\begin{bmatrix}2&1&0\\1&0&2\end{bmatrix},\qquad \mathbf b_2=\begin{bmatrix}-0.2\\-0.1\end{bmatrix}`}/>
     <h3>Salida: agregación lineal</h3>
     <MathFormula block latex={String.raw`\hat y=0.6g_1+0.4g_2`}/>
     <MathFormula block latex={String.raw`W_3=\begin{bmatrix}0.6&0.4\end{bmatrix},\qquad b_3=0`}/>
     <p>Un peso positivo aumenta la contribución de su entrada cuando la neurona correspondiente está activa; un sesgo modifica el punto en el que una neurona ReLU comienza a activarse. El resultado de cambiar un peso depende de las demás activaciones y del lugar que ocupa en la red.</p>
   </section>
   <section className="panel theory-section"><h2>4. Ejemplo guiado: lluvia intensa y drenaje limitado</h2>
     <p>Evaluamos la configuración original con <strong>x₁ = 0.9</strong> y <strong>x₂ = 0.3</strong>. Calculamos todas las neuronas antes de consultar el simulador.</p>
     <div className="worked-grid"><div className="worked-step"><span>Paso 1 · Primera capa</span><MathFormula block latex={String.raw`h_1=\max(0,0.9-0.3)=0.6`}/><MathFormula block latex={String.raw`h_2=\max(0,0.9-0.6)=0.3`}/><MathFormula block latex={String.raw`h_3=\max(0,0.5-0.3)=0.2`}/></div>
       <div className="worked-step"><span>Paso 2 · Segunda capa</span><MathFormula block latex={String.raw`g_1=\max(0,2(0.6)+0.3-0.2)=1.3`}/><MathFormula block latex={String.raw`g_2=\max(0,0.6+2(0.2)-0.1)=0.9`}/></div>
       <div className="worked-step"><span>Paso 3 · Salida</span><MathFormula block latex={String.raw`\hat y=0.6(1.3)+0.4(0.9)`}/><MathFormula block latex={String.raw`\boxed{\hat y=1.14}`}/></div></div>
     <p>Obsérvese que un indicador de 1.14 <strong>no equivale a un 114 % de probabilidad</strong>. Simplemente es la salida lineal de una función diseñada para mostrar el flujo de información.</p>
   </section>
 </>
}

function describeFloodChanges(p:FloodParameters):string[] {
 const messages:string[]=[]
 for(const layer of ['w1','w2','w3'] as const){
   const changed=p[layer].flatMap((row,i)=>row.flatMap((v,j)=>v!==INITIAL_FLOOD[layer][i][j]?[`${layer.toUpperCase()}[${i+1},${j+1}] cambió de ${INITIAL_FLOOD[layer][i][j]} a ${v.toFixed(1)}. ${layer==='w1'?'Puede cambiar qué patrones activan la primera capa y, por propagación, todas las capas siguientes.':layer==='w2'?'Altera cómo se combinan las características de la primera capa.':'Modifica cuánto contribuye la activación de la segunda capa a la salida.'}`]:[]))
   messages.push(...changed)
 }
 for(const layer of ['b1','b2','b3'] as const){
   messages.push(...p[layer].flatMap((v,i)=>v!==INITIAL_FLOOD[layer][i]?[`${layer}[${i+1}] pasó de ${INITIAL_FLOOD[layer][i]} a ${v.toFixed(1)}: ${layer==='b3'?'desplaza la salida en todas las observaciones.':'modifica la preactivación y el umbral de activación de esta neurona.'}`]:[]))
 }
 return messages
}
export function FloodLearningInterpretation({parameters:p, rain, drain}:{parameters:FloodParameters;rain:number;drain:number}){
 const changes=describeFloodChanges(p)
 const baseline=predictFlood([rain,drain],INITIAL_FLOOD).output
 const updated=predictFlood([rain,drain],p).output
 return <section className="panel theory-section"><h2>7. Interpretación de los cambios</h2>
   <p>Modifica los pesos de <strong>una neurona por vez</strong>. Observa cómo la variación se transmite por las dos capas ocultas y llega a la salida. No todas las variaciones producen un cambio: cuando una ReLU está inactiva, ciertas modificaciones pueden quedar enmascaradas.</p>
   <div className="math-table-wrap"><table className="learning-table"><thead><tr><th>Experimento (desde los valores originales)</th><th>Indicador resultante</th></tr></thead><tbody>{scenarios.map(s=><tr key={s.label}><td>{s.label}</td><td><strong>{s.output.toFixed(2)}</strong></td></tr>)}</tbody></table></div>
   <p className="note">Valores ilustrativos: cada fila se calcula independientemente, restaurando los demás parámetros originales. No representan riesgo medido.</p>
   <div className="concept-grid"><div className="concept-card"><span>Mismas entradas · pesos iniciales</span><strong>{baseline.toFixed(3)}</strong></div><div className="concept-card"><span>Mismas entradas · pesos actuales</span><strong>{updated.toFixed(3)}</strong></div><div className="concept-card"><span>Variación de la salida</span><strong>{(updated-baseline).toFixed(3)}</strong></div></div>
   <h3>Lectura de los parámetros modificados</h3>
   {changes.length===0?<p className="note">No hay parámetros modificados. Prueba invertir W₁[1,2] de −1 a +1: la primera característica pasa de x₁ − x₂ a x₁ + x₂, perdiendo la interpretación original de exceso sobre drenaje.</p>:<ul className="interpretation-list">{changes.map((s,i)=><li key={i}>{s}</li>)}</ul>}
   <h3>Preguntas de reflexión</h3><ol className="questions"><li>¿Por qué mejorar la capacidad de drenaje puede disminuir el indicador original?</li><li>¿Qué ocurre al invertir el signo de W₁[1,2]? ¿El cambio respeta la interpretación física?</li><li>¿Qué sucede si todos los pesos de salida W₃ son cero, pero b₃ no?</li><li>¿Se garantiza que agregar capas mejore la predicción de datos reales?</li></ol>
   <p className="note important">Una red entrenada no asegura que cada neurona conserve una interpretación física. Para aplicaciones de ingeniería se requieren datos, calibración y validación rigurosa.</p>
 </section>
}
