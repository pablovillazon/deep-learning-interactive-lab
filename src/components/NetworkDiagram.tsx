export function NetworkDiagram({layers,values}: {layers: number[]; values?: number[][]}) {
  const W=640,H=245
  const positions=layers.map((num,i)=>Array.from({length:num},(_,j)=>({x:60+i*(W-120)/(layers.length-1),y:H/2+(j-(num-1)/2)*Math.min(65,185/Math.max(1,num-1))})))
  return <div className="network-diagram" role="img" aria-label={`Red neuronal de arquitectura ${layers.join('–')}`}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true">
      {positions.slice(1).map((nodes,i)=>positions[i].flatMap((a,j)=>nodes.map((b,k)=><line key={`${i}-${j}-${k}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="currentColor" opacity=".22"/>)))}
      {positions.map((nodes,i)=>nodes.map((node,j)=><g key={`${i}-${j}`}><circle cx={node.x} cy={node.y} r="23" fill={i===0?'#bfdbfe':i===layers.length-1?'#a7f3d0':'#ccfbf1'} stroke="#0f766e" strokeWidth="2"/><text x={node.x} y={node.y-2} fill="#123047" fontWeight="bold" textAnchor="middle" fontSize="13">{i===0?`x${j+1}`:i===layers.length-1?'ŷ':`h${i}.${j+1}`}</text>{values?.[i] && <text x={node.x} y={node.y+13} textAnchor="middle" fill="#123047" fontSize="11">{values[i][j]?.toFixed(2)}</text>}</g>))}
      {layers.map((_,i)=><text key={i} x={positions[i][0].x} y={H-4} textAnchor="middle" fill="currentColor" fontSize="12">{i===0?'Entrada':i===layers.length-1?'Salida':`Oculta ${i}`}</text>)}
    </svg>
  </div>
}
