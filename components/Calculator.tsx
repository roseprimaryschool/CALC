
import React, { useState, useEffect, useRef } from 'react';

interface CalculatorProps {
  onUnlock: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onUnlock }) => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');
  const sequenceRef = useRef('');

  const handlePress = (val: string) => {
    // Hidden logic
    if (val === '9') {
      sequenceRef.current += '9';
      if (sequenceRef.current === '99999') {
        onUnlock();
        return;
      }
    } else {
      sequenceRef.current = '';
    }

    if (val === 'AC') {
      setDisplay('0');
      setHistory('');
    } else if (val === '=') {
      try {
        // Simple safety: replace visual ops with JS ops
        const expr = display
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/log/g, 'Math.log10')
          .replace(/π/g, 'Math.PI');
        
        // eslint-disable-next-line no-eval
        const result = eval(expr);
        setHistory(display + ' =');
        setDisplay(String(Number(result).toFixed(4)).replace(/\.?0+$/, ''));
      } catch {
        setDisplay('Error');
      }
    } else {
      setDisplay(prev => prev === '0' || prev === 'Error' ? val : prev + val);
    }
  };

  const buttons = [
    ['sin', 'cos', 'tan', 'log'],
    ['π', '(', ')', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['AC', '0', '.', '=']
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950 p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        {/* Display */}
        <div className="p-8 text-right flex flex-col justify-end min-h-[160px] bg-slate-800/50">
          <div className="text-slate-500 text-sm h-6 mb-1">{history}</div>
          <div className="text-white text-5xl font-light tracking-wider truncate">
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="p-6 grid grid-cols-4 gap-3 bg-slate-900">
          {buttons.flat().map((btn) => {
            const isOperator = ['÷', '×', '-', '+', '='].includes(btn);
            const isFunc = ['sin', 'cos', 'tan', 'log', 'π', '(', ')', 'AC'].includes(btn);
            
            return (
              <button
                key={btn}
                onClick={() => handlePress(btn)}
                className={`
                  h-16 rounded-2xl text-xl font-medium transition-all active:scale-95
                  ${isOperator ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 
                    isFunc ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 
                    'bg-slate-700/50 text-white hover:bg-slate-700'}
                  ${btn === '=' ? 'bg-indigo-700 shadow-lg shadow-indigo-500/20' : ''}
                `}
              >
                {btn}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-8 text-slate-600 text-xs uppercase tracking-widest">Scientific Core v4.2.0</p>
    </div>
  );
};

export default Calculator;
