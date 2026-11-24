import { useId } from 'react'
export function SliderField({label,value,min,max,step=0.1,onChange,precision=2}: {
  label:string;value:number;min:number;max:number;step?:number;onChange:(n:number)=>void;precision?:number
}) {
  const id=useId()
  return <div className="slider-field"><div className="slider-label"><label htmlFor={id}>{label}</label><output htmlFor={id}>{value.toFixed(precision)}</output></div>
    <input id={id} type="range" value={value} min={min} max={max} step={step} onChange={e=>onChange(Number(e.currentTarget.value))}/></div>
}
