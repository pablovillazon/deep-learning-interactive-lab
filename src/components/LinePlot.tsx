import { useId } from 'react'
interface PlotSeries { label: string; color: string; values: [number,number][]; dashed?: boolean }
export function LinePlot({series,xRange,yRange,xLabel,yLabel,marker}: {
  series:PlotSeries[];xRange:[number,number];yRange:[number,number];xLabel:string;yLabel:string;marker?:[number,number]
}) {
  const id=useId().replace(/:/g,'')
  const width=640, height=300, left=58, right=22, top=22, bottom=42
  const px=(x:number)=>left+(x-xRange[0])/(xRange[1]-xRange[0])*(width-left-right)
  const py=(y:number)=>top+(yRange[1]-y)/(yRange[1]-yRange[0])*(height-top-bottom)
  const ticks=Array.from({length:5},(_,i)=>i/4)
  return <div className="plot" role="img" aria-label={`${yLabel} en función de ${xLabel}`}>
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" aria-hidden="true">
      <defs><clipPath id={id}><rect x={left} y={top} width={width-left-right} height={height-top-bottom}/></clipPath></defs>
      {ticks.map(t=><g key={`y${t}`}><line x1={left} y1={py(yRange[0]+t*(yRange[1]-yRange[0]))} x2={width-right} y2={py(yRange[0]+t*(yRange[1]-yRange[0]))} stroke="currentColor" opacity=".12"/><text x={left-9} y={py(yRange[0]+t*(yRange[1]-yRange[0]))+4} textAnchor="end" fill="currentColor" fontSize="12">{(yRange[0]+t*(yRange[1]-yRange[0])).toFixed(1)}</text></g>)}
      {ticks.map(t=><g key={`x${t}`}><line x1={px(xRange[0]+t*(xRange[1]-xRange[0]))} x2={px(xRange[0]+t*(xRange[1]-xRange[0]))} y1={top} y2={height-bottom} stroke="currentColor" opacity=".08"/><text x={px(xRange[0]+t*(xRange[1]-xRange[0]))} y={height-bottom+19} fill="currentColor" textAnchor="middle" fontSize="12">{(xRange[0]+t*(xRange[1]-xRange[0])).toFixed(1)}</text></g>)}
      <g clipPath={`url(#${id})`}>{series.map(s=><polyline key={s.label} fill="none" stroke={s.color} strokeWidth="3" strokeDasharray={s.dashed?'7 5':undefined} points={s.values.map(([x,y])=>`${px(x)},${py(y)}`).join(' ')}/>)}{marker && <><line x1={px(marker[0])} x2={px(marker[0])} y1={top} y2={height-bottom} stroke="#0d9488" strokeDasharray="4 4"/><circle cx={px(marker[0])} cy={py(marker[1])} r="6" fill="#0d9488" stroke="white" strokeWidth="2"/></>}</g>
      <text x={width/2} y={height-4} textAnchor="middle" fill="currentColor" fontSize="13">{xLabel}</text><text x={left+1} y={14} fill="currentColor" fontSize="12">{yLabel}</text>
    </svg><div className="legend">{series.map(s=><span key={s.label}><i style={{background:s.color}}/>{s.label}</span>)}</div></div>
}
