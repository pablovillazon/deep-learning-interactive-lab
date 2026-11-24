import { dense, forwardReLU, type Matrix, type Vector } from '../../core/neural-network'

// y = base + heatingWeight * ReLU(w1 * T + b1)
//          + coolingWeight * ReLU(w2 * T + b2)
export interface EnergyParameters {
  w1: number
  b1: number
  w2: number
  b2: number
  heatingWeight: number
  coolingWeight: number
  base: number
}
export const INITIAL_ENERGY: EnergyParameters = {
  w1: -1, b1: 18, w2: 1, b2: -24,
  heatingWeight: 0.8, coolingWeight: 1.2, base: 5,
}
export function predictEnergy(x: number, p: EnergyParameters): { hidden: Vector, output: number } {
  const hidden = [Math.max(0, p.w1 * x + p.b1), Math.max(0, p.w2 * x + p.b2)]
  return { hidden, output: p.base + p.heatingWeight * hidden[0] + p.coolingWeight * hidden[1] }
}

export interface FloodParameters { w1: Matrix; b1: Vector; w2: Matrix; b2: Vector; w3: Matrix; b3: Vector }
export const INITIAL_FLOOD: FloodParameters = {
  w1: [[1,-1],[1,0],[0,-1]], b1: [0,-0.6,0.5],
  w2: [[2,1,0],[1,0,2]], b2: [-0.2,-0.1],
  w3: [[0.6,0.4]], b3: [0],
}
export function predictFlood(input: Vector, p: FloodParameters): { first: Vector; second: Vector; output: number } {
  if (input.length !== 2) throw new Error('Se requieren lluvia y capacidad de drenaje')
  const first = forwardReLU(p.w1, p.b1, input)
  const second = forwardReLU(p.w2, p.b2, first)
  const output = dense(p.w3, p.b3, second)[0]
  return { first, second, output }
}
export function updateFloodWeight(p: FloodParameters, layer: 'w1'|'w2'|'w3', row: number, col: number, value: number): FloodParameters {
  return { ...p, [layer]: p[layer].map((r, i) => i === row ? r.map((v, j) => j === col ? value : v) : [...r]) }
}
export function updateFloodBias(p: FloodParameters, layer: 'b1'|'b2'|'b3', index: number, value: number): FloodParameters {
  return { ...p, [layer]: p[layer].map((v,i) => i === index ? value : v) }
}
