import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
export function MathFormula({ latex, block=false }: { latex: string, block?: boolean }) {
  const html = useMemo(() => katex.renderToString(latex, { throwOnError: false, displayMode: block, strict: 'ignore' }), [latex, block])
  return <span className={block ? 'formula-block' : 'formula'} dangerouslySetInnerHTML={{__html: html}} />
}
