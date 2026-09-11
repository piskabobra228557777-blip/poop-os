import React, { useState, useEffect } from 'react';
import { sound } from '../utils/sound';
import { Delete, RotateCcw } from 'lucide-react';

export const CalculatorWindow: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [historyText, setHistoryText] = useState('');

  const inputDigit = (digit: string) => {
    sound.playCalcButton();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    sound.playCalcButton();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    sound.playCalcButton();
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setHistoryText('');
  };

  const toggleSign = () => {
    sound.playCalcButton();
    const val = parseFloat(display);
    setDisplay(String(-val));
  };

  const inputPercent = () => {
    sound.playCalcButton();
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const squareRoot = () => {
    sound.playCalcResult();
    const val = parseFloat(display);
    if (val < 0) {
      setDisplay('Ошибка');
      return;
    }
    setDisplay(String(Math.sqrt(val)));
  };

  const square = () => {
    sound.playCalcResult();
    const val = parseFloat(display);
    setDisplay(String(val * val));
  };

  const performOperation = (nextOp: string) => {
    sound.playCalcButton();
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
      setHistoryText(`${display} ${nextOp}`);
    } else if (operation) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      if (operation === '+') newValue = currentValue + inputValue;
      else if (operation === '-') newValue = currentValue - inputValue;
      else if (operation === '×') newValue = currentValue * inputValue;
      else if (operation === '÷') newValue = inputValue !== 0 ? currentValue / inputValue : 0;

      setPrevValue(newValue);
      setDisplay(String(newValue));
      setHistoryText(`${newValue} ${nextOp}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const calculateResult = () => {
    if (!operation || prevValue === null) return;
    sound.playCalcResult();
    const inputValue = parseFloat(display);
    const currentValue = prevValue;
    let newValue = currentValue;

    if (operation === '+') newValue = currentValue + inputValue;
    else if (operation === '-') newValue = currentValue - inputValue;
    else if (operation === '×') newValue = currentValue * inputValue;
    else if (operation === '÷') newValue = inputValue !== 0 ? currentValue / inputValue : 0;

    setDisplay(String(newValue));
    setHistoryText(`${currentValue} ${operation} ${inputValue} =`);
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
      else if (e.key === '.') inputDecimal();
      else if (e.key === '=' || e.key === 'Enter') calculateResult();
      else if (e.key === '+') performOperation('+');
      else if (e.key === '-') performOperation('-');
      else if (e.key === '*') performOperation('×');
      else if (e.key === '/') performOperation('÷');
      else if (e.key === 'Escape') clearAll();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="h-full bg-slate-950/80 backdrop-blur-2xl p-4 flex flex-col select-none text-white justify-between">
      {/* LCD Display */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/10 shadow-inner flex flex-col justify-end items-end h-24 mb-3">
        <span className="text-[11px] font-mono text-slate-400 h-4 overflow-hidden">
          {historyText}
        </span>
        <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white line-clamp-1 break-all">
          {display}
        </span>
      </div>

      {/* Button Keypad */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {/* Row 1 */}
        <button
          onClick={clearAll}
          className="rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-red-400 font-bold text-sm transition-all border border-white/5 py-3 cursor-pointer"
        >
          AC
        </button>
        <button
          onClick={toggleSign}
          className="rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-sm transition-all border border-white/5 py-3 cursor-pointer"
        >
          ±
        </button>
        <button
          onClick={inputPercent}
          className="rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-sm transition-all border border-white/5 py-3 cursor-pointer"
        >
          %
        </button>
        <button
          onClick={() => performOperation('÷')}
          className={`rounded-xl font-bold text-lg transition-all active:scale-95 py-3 border border-white/10 cursor-pointer ${
            operation === '÷' ? 'bg-amber-400 text-slate-950' : 'bg-amber-600 hover:bg-amber-500 text-white'
          }`}
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => inputDigit('7')}
          className="rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-white border border-white/5 py-3 cursor-pointer"
        >
          7
        </button>
        <button
          onClick={() => inputDigit('8')}
          className="rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-white border border-white/5 py-3 cursor-pointer"
        >
          8
        </button>
        <button
          onClick={() => inputDigit('9')}
          className="rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-white border border-white/5 py-3 cursor-pointer"
        >
          9
        </button>
        <button
          onClick={() => performOperation('×')}
          className={`rounded-xl font-bold text-lg transition-all active:scale-95 py-3 border border-white/10 cursor-pointer ${
            operation === '×' ? 'bg-amber-400 text-slate-950' : 'bg-amber-600 hover:bg-amber-500 text-white'
          }`}
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => inputDigit('4')}
          className="rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-white border border-white/5 py-3 cursor-pointer"
        >
          4
        </button>
        <button
          onClick={() => inputDigit('5')}
          className="rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-white border border-white/5 py-3 cursor-pointer"
        >
          5
        </button>
        <button
          onClick={() => inputDigit('6')}
          className="rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-white border border-white/5 py-3 cursor-pointer"
        >
          6
        </button>
        <button
          onClick={() => performOperation('-')}
          className={`rounded-xl font-bold text-lg transition-all active:scale-95 py-3 border border-white/10 cursor-pointer ${
            operation === '-' ? 'bg-amber-400 text-slate-950' : 'bg-amber-600 hover:bg-amber-500 text-white'
          }`}
        >
          −
        </button>

        {/* Row 4 */}
        <button
          onClick={() => inputDigit('1')}
          className="rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-white border border-white/5 py-3 cursor-pointer"
        >
          1
        </button>
        <button
          onClick={() => inputDigit('2')}
          className="rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-white border border-white/5 py-3 cursor-pointer"
        >
          2
        </button>
        <button
          onClick={() => inputDigit('3')}
          className="rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-white border border-white/5 py-3 cursor-pointer"
        >
          3
        </button>
        <button
          onClick={() => performOperation('+')}
          className={`rounded-xl font-bold text-lg transition-all active:scale-95 py-3 border border-white/10 cursor-pointer ${
            operation === '+' ? 'bg-amber-400 text-slate-950' : 'bg-amber-600 hover:bg-amber-500 text-white'
          }`}
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={squareRoot}
          className="rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-mono font-bold text-slate-300 border border-white/5 py-3 cursor-pointer"
        >
          √x
        </button>
        <button
          onClick={() => inputDigit('0')}
          className="rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 font-semibold text-lg text-white border border-white/5 py-3 cursor-pointer"
        >
          0
        </button>
        <button
          onClick={inputDecimal}
          className="rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 font-bold text-lg text-white border border-white/5 py-3 cursor-pointer"
        >
          .
        </button>
        <button
          onClick={calculateResult}
          className="rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-white font-bold text-xl transition-all shadow-lg border border-emerald-300/40 py-3 cursor-pointer"
        >
          =
        </button>
      </div>
    </div>
  );
};
