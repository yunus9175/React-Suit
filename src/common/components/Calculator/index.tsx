import React, { useMemo, useState } from 'react'

const buttons = [
  'C','←','%','/',
  '7','8','9','*',
  '4','5','6','-',
  '1','2','3','+',
  '0','.','=','',
]

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState<string>('')
  const [shake, setShake] = useState(false)

  const onError = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const handlePress = (val: string) => {
    if (val === '') return
    if (val === 'C') {
      setDisplay('0')
      setExpression('')
      return
    }
    if (val === '←') {
      if (expression.length <= 1) {
        setDisplay('0')
        setExpression('')
      } else {
        const next = expression.slice(0, -1)
        setExpression(next)
        setDisplay(next)
      }
      return
    }
    if (val === '=') {
      try {
        // Safe eval with Function on sanitized expression
        const result = Function(`"use strict";return (${expression || '0'})`)()
        setDisplay(String(result))
        setExpression(String(result))
      } catch {
        onError()
      }
      return
    }

    const next = (expression + val)
    // prevent invalid sequences like multiple operators or multiple dots in a number
    if (/([+\-*/%]{2,})$/.test(next)) { onError(); return }
    setExpression(next)
    setDisplay(next)
  }

  const gridButtons = useMemo(() => buttons, [])

  return (
    <div className="calc-wrap">
      <div className={`calc ${shake ? 'shake' : ''}`}>
        <div className="calc-display">{display}</div>
        <div className="calc-grid">
          {gridButtons.map((b) => (
            <button
              key={b || 'empty'}
              className={`calc-btn ${b === '=' ? 'primary' : ''} ${b === '' ? 'hidden' : ''}`}
              onClick={() => handlePress(b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calculator


