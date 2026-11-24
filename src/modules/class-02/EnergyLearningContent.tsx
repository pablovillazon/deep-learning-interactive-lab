import { MathFormula } from '../../components/MathFormula'
import { NetworkDiagram } from '../../components/NetworkDiagram'
import { INITIAL_ENERGY, predictEnergy, type EnergyParameters } from './models'

const parameterDescriptions: [string, string, string][] = [
  ['w₁', '−1', 'Asocia temperaturas menores con activación de la neurona de frío.'],
  ['b₁', '18', 'Con w₁ = −1, fija el umbral de calefacción en 18 °C.'],
  ['w₂', '1', 'Asocia temperaturas mayores con activación de la neurona de calor.'],
  ['b₂', '−24', 'Con w₂ = 1, fija el umbral de refrigeración en 24 °C.'],
  ['φ₁', '0.8', 'Aporta 0.8 kWh por unidad de activación de frío.'],
  ['φ₂', '1.2', 'Aporta 1.2 kWh por unidad de activación de calor.'],
  ['φ₀', '5', 'Consumo base de la vivienda, en kWh/día.'],
]

const rows = [5, 10, 18, 21, 24, 30, 35].map(temp => {
  const r = predictEnergy(temp, INITIAL_ENERGY)
  return { temp, h1: r.hidden[0], h2: r.hidden[1], output: r.output }
})

export function EnergyLearningTheory() {
  return <>
    <section className="panel theory-section"><h2>1. Planteamiento del problema</h2>
      <p>Una empresa distribuidora desea estimar el <strong>consumo eléctrico diario de una vivienda</strong> a partir de la temperatura ambiente. Durante los días fríos aumenta el consumo de calefacción; durante los días calurosos, el de aire acondicionado. En temperaturas intermedias predomina el consumo habitual de iluminación y electrodomésticos.</p>
      <div className="concept-grid"><div className="concept-card"><span>Entrada</span><strong>x — temperatura (°C)</strong></div><div className="concept-card"><span>Salida</span><strong>ŷ — consumo estimado (kWh/día)</strong></div></div>
      <p>¿Por qué una sola recta es insuficiente? Una recta presenta una única pendiente: no puede describir a la vez el aumento del consumo cuando la temperatura <em>disminuye</em> y cuando <em>aumenta</em>. Buscamos una función con diferentes pendientes y una zona de consumo estable.</p>
      <p className="note">Problema y valores sintéticos para fines docentes: no corresponden a mediciones reales ni constituyen un predictor calibrado.</p>
    </section>
    <section className="panel theory-section"><h2>2. Arquitectura propuesta: red shallow 1–2–1</h2>
      <p><strong>Una entrada → una capa oculta de dos neuronas ReLU → una salida lineal.</strong> La neurona h₁ responde al frío y h₂ responde al calor, con los parámetros originales. La capa de salida combina ambas contribuciones con el consumo base.</p>
      <NetworkDiagram layers={[1,2,1]} values={[[21],[0,0],[5]]}/>
      <p>La red contiene <strong>7 parámetros</strong>: dos pesos y dos sesgos de la capa oculta, dos pesos de salida y un sesgo final. Son los valores que el simulador permite modificar.</p>
      <MathFormula block latex={String.raw`h_1=\operatorname{ReLU}(w_1x+b_1),\qquad h_2=\operatorname{ReLU}(w_2x+b_2)`}/>
      <MathFormula block latex={String.raw`\hat y=\phi_0+\phi_1h_1+\phi_2h_2`}/>
    </section>
    <section className="panel theory-section"><h2>3. Fundamentación matemática e interpretación de parámetros</h2>
      <p>Una neurona calcula una <strong>preactivación</strong> z = wx + b y aplica ReLU(z) = max(0,z). ReLU convierte las preactivaciones negativas en cero, generando cambios de pendiente en la salida. La función concreta de nuestro ejemplo, con parámetros originales, es:</p>
      <MathFormula block latex={String.raw`\hat y=5+0.8\max(0,18-x)+1.2\max(0,x-24)`}/>
      <div className="math-table-wrap"><table className="learning-table"><thead><tr><th>Parámetro</th><th>Valor inicial</th><th>Interpretación en este ejemplo</th></tr></thead><tbody>{parameterDescriptions.map(([symbol,value,meaning])=><tr key={symbol}><td><strong>{symbol}</strong></td><td>{value}</td><td>{meaning}</td></tr>)}</tbody></table></div>
      <h3>Representación por tramos</h3>
      <MathFormula block latex={String.raw`\hat y(x)=\begin{cases}5+0.8(18-x), & x<18\\5,&18\le x\le24\\5+1.2(x-24),&x>24\end{cases}`}/>
      <p>Así, en la región de frío la pendiente es −0.8 kWh/(día·°C); en la zona templada es 0; y en la región cálida es +1.2. Los umbrales en general satisfacen <strong>wx + b = 0</strong>, es decir, x = −b/w cuando w ≠ 0. Al alterar pesos o sesgos, los umbrales y sus interpretaciones pueden cambiar.</p>
    </section>
    <section className="panel theory-section"><h2>4. Ejemplo guiado: temperatura de 10 °C</h2>
      <p>Antes de mover los controles, resolvamos manualmente el modelo original para <strong>x = 10 °C</strong>. Podemos verificar el cálculo en el simulador seleccionando esa temperatura y usando los parámetros iniciales.</p>
      <div className="worked-grid"><div className="worked-step"><span>Paso 1 · Preactivaciones</span><MathFormula block latex={String.raw`z_1=-1(10)+18=8`}/><MathFormula block latex={String.raw`z_2=1(10)-24=-14`}/></div><div className="worked-step"><span>Paso 2 · Activación ReLU</span><MathFormula block latex={String.raw`h_1=\max(0,8)=8`}/><MathFormula block latex={String.raw`h_2=\max(0,-14)=0`}/></div><div className="worked-step"><span>Paso 3 · Predicción</span><MathFormula block latex={String.raw`\hat y=5+0.8(8)+1.2(0)`}/><MathFormula block latex={String.raw`\boxed{\hat y=11.4\ \text{kWh/día}}`}/></div></div>
      <h3>¿Qué ocurre con otras temperaturas?</h3>
      <div className="math-table-wrap"><table className="learning-table"><thead><tr><th>x (°C)</th><th>h₁</th><th>h₂</th><th>ŷ (kWh/día)</th></tr></thead><tbody>{rows.map(r=><tr key={r.temp}><td>{r.temp}</td><td>{r.h1}</td><td>{r.h2}</td><td><strong>{r.output.toFixed(1)}</strong></td></tr>)}</tbody></table></div>
      <p className="note">Los cálculos de esta sección usan siempre los parámetros originales; los valores experimentales del simulador son independientes.</p>
    </section>
  </>
}

function describeEnergyChange(p: EnergyParameters): string[] {
  const messages:string[]=[]
  if(p.base!==INITIAL_ENERGY.base) messages.push(`El sesgo de salida cambió de 5 a ${p.base.toFixed(1)}: desplaza toda la curva ${(p.base>5?'hacia arriba':'hacia abajo')} ${Math.abs(p.base-5).toFixed(1)} kWh/día, sin cambiar sus pendientes.`)
  if(p.heatingWeight!==.8) messages.push(`φ₁ cambió de 0.8 a ${p.heatingWeight.toFixed(1)}: cambia la contribución de la primera neurona; si vale cero, esa neurona deja de afectar a la salida.`)
  if(p.coolingWeight!==1.2) messages.push(`φ₂ cambió de 1.2 a ${p.coolingWeight.toFixed(1)}: altera la contribución de la segunda neurona al consumo estimado.`)
  if(p.w1!==-1 || p.b1!==18) messages.push(`La primera neurona ahora usa z₁ = ${p.w1.toFixed(1)}x + (${p.b1.toFixed(1)}). ${p.w1!==0?`Su umbral es x = ${(-p.b1/p.w1).toFixed(2)} °C, cuando se encuentra en el dominio analizado.`:'Con w₁ = 0, su activación ya no depende de la temperatura.'} El significado de «calefacción» puede dejar de ser válido.`)
  if(p.w2!==1 || p.b2!==-24) messages.push(`La segunda neurona ahora usa z₂ = ${p.w2.toFixed(1)}x + (${p.b2.toFixed(1)}). ${p.w2!==0?`Su umbral es x = ${(-p.b2/p.w2).toFixed(2)} °C, cuando se encuentra en el dominio analizado.`:'Con w₂ = 0, su activación ya no depende de la temperatura.'} El significado de «refrigeración» puede dejar de ser válido.`)
  return messages
}
export function EnergyLearningInterpretation({parameters:p}:{parameters:EnergyParameters}) {
  const changes=describeEnergyChange(p)
  return <section className="panel theory-section"><h2>7. Interpretación de los cambios</h2>
    <p>En el simulador, modifica <strong>un parámetro a la vez</strong> y compara la curva actual con la original. Después restaura los valores y prueba otra modificación. Este procedimiento aísla el efecto de cada parámetro.</p>
    <div className="math-table-wrap"><table className="learning-table"><thead><tr><th>Experimento</th><th>Consecuencia esperada</th></tr></thead><tbody>
      <tr><td>φ₀: de 5 a 8</td><td>La función completa sube 3 kWh/día.</td></tr>
      <tr><td>φ₁: de 0.8 a 1.6</td><td>Se duplica la contribución de la neurona de frío y la magnitud de la pendiente fría.</td></tr>
      <tr><td>b₁: de 18 a 20</td><td>Con w₁ = −1, la activación por frío comienza por debajo de 20 °C.</td></tr>
      <tr><td>b₂: de −24 a −28</td><td>Con w₂ = 1, el umbral cálido se desplaza de 24 a 28 °C.</td></tr>
      <tr><td>φ₂: de 1.2 a 0</td><td>La segunda neurona deja de contribuir al consumo estimado.</td></tr>
      <tr><td>φ₁ = φ₂ = 0</td><td>La salida se vuelve constante e igual al sesgo φ₀.</td></tr>
    </tbody></table></div>
    <h3>Lectura de los ajustes actuales</h3>
    {changes.length===0?<p className="note">Estás utilizando los parámetros originales. Cambia un control para observar aquí la interpretación específica.</p>:<ul className="interpretation-list">{changes.map(s=><li key={s}>{s}</li>)}</ul>}
    <h3>Preguntas para debatir</h3><ol className="questions"><li>¿Por qué una sola función lineal no es suficiente para describir las tres regiones?</li><li>¿Qué pasaría si el peso de salida de la neurona de calor fuera negativo?</li><li>¿Cómo podríamos utilizar datos medidos para elegir mejores pesos y sesgos?</li></ol>
    <p className="note">Idea puente hacia la Clase 3: una función de pérdida cuantifica el desacuerdo entre las predicciones y los consumos observados.</p>
  </section>
}
