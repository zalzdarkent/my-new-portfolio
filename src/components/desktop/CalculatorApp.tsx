import { useState } from 'react'

type Op = '+' | '-' | '×' | '÷' | null

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState<number | null>(null)
  const [op, setOp] = useState<Op>(null)
  const [fresh, setFresh] = useState(true)

  const compute = (a: number, b: number, operator: Op): number => {
    if (operator === '+') return a + b
    if (operator === '-') return a - b
    if (operator === '×') return a * b
    if (operator === '÷') return b === 0 ? NaN : a / b
    return b
  }

  const formatNum = (n: number) => {
    if (Number.isNaN(n) || !Number.isFinite(n)) return 'Error'
    return String(Number(n.toPrecision(10)))
  }

  const pressDigit = (d: string) => {
    if (display === 'Error' || fresh) {
      setDisplay(d === '.' ? '0.' : d)
      setFresh(false)
      return
    }
    if (d === '.' && display.includes('.')) return
    setDisplay(display === '0' && d !== '.' ? d : display + d)
  }

  const pressOp = (nextOp: Op) => {
    const cur = parseFloat(display)
    if (Number.isNaN(cur)) return
    if (prev !== null && op && !fresh) {
      const res = compute(prev, cur, op)
      setDisplay(formatNum(res))
      setPrev(res)
    } else {
      setPrev(cur)
    }
    setOp(nextOp)
    setFresh(true)
  }

  const pressEqual = () => {
    if (prev === null || !op) return
    const cur = parseFloat(display)
    const res = compute(prev, cur, op)
    setDisplay(formatNum(res))
    setPrev(null)
    setOp(null)
    setFresh(true)
  }

  const pressClear = () => {
    setDisplay('0')
    setPrev(null)
    setOp(null)
    setFresh(true)
  }

  const pressBackspace = () => {
    if (fresh || display === 'Error') {
      setDisplay('0')
      setFresh(true)
      return
    }
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0')
  }

  const pressPercent = () => {
    const cur = parseFloat(display)
    if (!Number.isNaN(cur)) setDisplay(formatNum(cur / 100))
  }

  const pressSign = () => {
    const cur = parseFloat(display)
    if (!Number.isNaN(cur) && cur !== 0) setDisplay(formatNum(-cur))
  }

  const BTN = 'h-12 rounded-lg text-[16px] font-medium transition active:scale-95 cursor-pointer flex items-center justify-center'

  return (
    <div className="w-full h-full bg-[#242424] p-4! flex flex-col gap-3 select-none">
      {/* Display */}
      <div className="bg-[#181818] rounded-xl p-4! text-right border border-white/10">
        <div className="text-[12px] text-[#888] h-4">
          {prev !== null && op ? `${formatNum(prev)} ${op}` : ''}
        </div>
        <div className="text-[32px] font-semibold text-white tracking-tight truncate">{display}</div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        <button className={`${BTN} bg-[#3a3a3a] hover:bg-[#484848] text-[#ff8b5e]`} onClick={pressClear}>C</button>
        <button className={`${BTN} bg-[#3a3a3a] hover:bg-[#484848] text-white`} onClick={pressSign}>±</button>
        <button className={`${BTN} bg-[#3a3a3a] hover:bg-[#484848] text-white`} onClick={pressPercent}>%</button>
        <button className={`${BTN} bg-[#3a3a3a] hover:bg-[#484848] text-[#ff8b5e]`} onClick={() => pressOp('÷')}>÷</button>

        {['7', '8', '9'].map((d) => (
          <button key={d} className={`${BTN} bg-[#303030] hover:bg-[#3d3d3d] text-white`} onClick={() => pressDigit(d)}>{d}</button>
        ))}
        <button className={`${BTN} bg-[#3a3a3a] hover:bg-[#484848] text-[#ff8b5e]`} onClick={() => pressOp('×')}>×</button>

        {['4', '5', '6'].map((d) => (
          <button key={d} className={`${BTN} bg-[#303030] hover:bg-[#3d3d3d] text-white`} onClick={() => pressDigit(d)}>{d}</button>
        ))}
        <button className={`${BTN} bg-[#3a3a3a] hover:bg-[#484848] text-[#ff8b5e]`} onClick={() => pressOp('-')}>−</button>

        {['1', '2', '3'].map((d) => (
          <button key={d} className={`${BTN} bg-[#303030] hover:bg-[#3d3d3d] text-white`} onClick={() => pressDigit(d)}>{d}</button>
        ))}
        <button className={`${BTN} bg-[#3a3a3a] hover:bg-[#484848] text-[#ff8b5e]`} onClick={() => pressOp('+')}>+</button>

        <button className={`${BTN} bg-[#303030] hover:bg-[#3d3d3d] text-white`} onClick={() => pressDigit('0')}>0</button>
        <button className={`${BTN} bg-[#303030] hover:bg-[#3d3d3d] text-white`} onClick={() => pressDigit('.')}>.</button>
        <button className={`${BTN} bg-[#303030] hover:bg-[#3d3d3d] text-[#ccc]`} onClick={pressBackspace}>⌫</button>
        <button className={`${BTN} bg-ub-orange hover:brightness-110 text-white font-bold`} onClick={pressEqual}>=</button>
      </div>
    </div>
  )
}
