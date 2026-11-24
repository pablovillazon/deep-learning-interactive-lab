import { describe, it, expect } from 'vitest'
import { relu, sigmoid, activate } from '../src/core/activations'
import { dense } from '../src/core/neural-network'
import { INITIAL_ENERGY, INITIAL_FLOOD, predictEnergy, predictFlood, updateFloodWeight } from '../src/modules/class-02/models'
describe('funciones de activación', () => {
  it('ReLU produce cero para negativos', () => { expect(relu(-3)).toBe(0); expect(relu(2)).toBe(2) })
  it('sigmoide está acotada y es estable', () => { expect(sigmoid(0)).toBe(.5); expect(sigmoid(-1e3)).toBe(0); expect(sigmoid(1e3)).toBe(1) })
  it('tanh y LeakyReLU', () => { expect(activate('tanh',0)).toBe(0); expect(activate('leakyRelu',-2)).toBeCloseTo(-.2) })
})
describe('motor matricial', () => {
  it('calcula Wx+b',()=>expect(dense([[1,-1],[2,0],[.5,1]],[0,1,-1],[2,1])).toEqual([1,5,1]))
  it('valida dimensiones',()=>expect(()=>dense([[1,2]],[0],[1])).toThrow())
})
describe('red shallow de consumo', () => {
  it.each([[5,15.4],[10,11.4],[18,5],[21,5],[24,5],[30,12.2],[35,18.2]])('temperatura %d produce %d', (x,y)=>expect(predictEnergy(x,INITIAL_ENERGY).output).toBeCloseTo(y))
  it('cambiar el sesgo de salida desplaza la curva',()=>expect(predictEnergy(30,{...INITIAL_ENERGY,base:8}).output).toBeCloseTo(15.2))
})
describe('red deep de riesgo',()=>{
  it('propaga la salida esperada por ambas capas',()=>{
    const r=predictFlood([.9,.3],INITIAL_FLOOD)
    expect(r.first).toEqual([.6000000000000001,.30000000000000004,.2])
    expect(r.second[0]).toBeCloseTo(1.3)
    expect(r.second[1]).toBeCloseTo(.9)
    expect(r.output).toBeCloseTo(1.14)
  })
  it('permite modificar sin mutar pesos previos',()=>{
    const n=updateFloodWeight(INITIAL_FLOOD,'w1',0,1,1)
    expect(n.w1[0][1]).toBe(1)
    expect(INITIAL_FLOOD.w1[0][1]).toBe(-1)
    expect(predictFlood([.9,.3],n).output).toBeCloseTo(2.1)
  })
})
