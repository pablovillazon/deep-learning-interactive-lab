import { relu } from './activations'
export type Vector = number[]
export type Matrix = number[][]
export function dense(weights: Matrix, bias: Vector, input: Vector): Vector {
  if (!weights.length || weights.length !== bias.length || weights.some(row => row.length !== input.length)) {
    throw new Error('Las dimensiones de W, b y x deben ser compatibles')
  }
  return weights.map((row, i) => row.reduce((total, w, j) => total + w * input[j], bias[i]))
}
export function forwardReLU(weights: Matrix, bias: Vector, input: Vector): Vector {
  return dense(weights, bias, input).map(relu)
}
