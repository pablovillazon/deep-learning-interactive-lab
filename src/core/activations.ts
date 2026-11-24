export type ActivationName = 'relu' | 'leakyRelu' | 'sigmoid' | 'tanh'
export function relu(x: number): number { return Math.max(0, x) }
export function leakyRelu(x: number, slope = 0.1): number { return x >= 0 ? x : slope * x }
export function sigmoid(x: number): number {
  if (x >= 0) return 1 / (1 + Math.exp(-x))
  const e = Math.exp(x)
  return e / (1 + e)
}
export function activate(name: ActivationName, x: number): number {
  switch (name) {
    case 'relu': return relu(x)
    case 'leakyRelu': return leakyRelu(x)
    case 'sigmoid': return sigmoid(x)
    case 'tanh': return Math.tanh(x)
  }
}
export const activationLatex: Record<ActivationName, string> = {
  relu: String.raw`\operatorname{ReLU}(z)=\max(0,z)`,
  leakyRelu: String.raw`f(z)=\max(0.1z,z)`,
  sigmoid: String.raw`\sigma(z)=\frac{1}{1+e^{-z}}`,
  tanh: String.raw`\tanh(z)=\frac{e^z-e^{-z}}{e^z+e^{-z}}`,
}
