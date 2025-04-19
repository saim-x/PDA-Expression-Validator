"use client";
import React, { useState } from "react";

// --- Helper function for Operator Precedence ---
function precedence(op: string): number {
  switch (op) {
    case '+':
    case '-':
      return 1;
    case '*':
    case '/':
      return 2;
    default:
      return 0; // For parentheses or invalid ops
  }
}

// --- Helper function to apply an operator ---
type Node = { id: number; type: string; value: string; left?: Node; right?: Node };
let nodeId = 0; // Keep track of unique node IDs
function applyOp(op: string, operandStack: Node[]): boolean {
  nodeId++;
  const right = operandStack.pop();
  const left = operandStack.pop();
  if (!left || !right) {
    return false; // Indicate failure (missing operands)
  }
  operandStack.push({ id: nodeId, type: "operator", value: op, left, right });
  return true; // Indicate success
}

// --- Main PDA Validation and Parse Tree Generation ---
function validateExpression(expr: string) {
  const pdaStack: string[] = []; // For parenthesis matching (PDA part)
  const trace: { char: string | null; action: string; pdaStack: string[]; opStack: string[]; nodeStackSnapshot: string[]; error?: boolean }[] = [];
  const operators = new Set(["+", "-", "*", "/"]);
  let lastType: "none" | "operand" | "operator" | "open" | "close" = "none";
  let error = "";

  const nodeStack: Node[] = [];
  const opStack: string[] = [];
  nodeId = 0; // Reset node ID for each validation

  const recordTrace = (char: string | null, action: string, isError = false) => {
    trace.push({
      char,
      action,
      pdaStack: [...pdaStack],
      opStack: [...opStack],
      nodeStackSnapshot: nodeStack.map(n => n.value), // Snapshot node values
      error: isError
    });
  };

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    if (char === " ") continue;

    if (/[a-z]/i.test(char)) { // Operand
      if (lastType === "operand" || lastType === "close") {
         error = `Unexpected operand '${char}' at position ${i}. Expected operator or ')'.`;
         recordTrace(char, `Error: Unexpected operand`, true);
         break;
      }
      nodeId++;
      nodeStack.push({ id: nodeId, type: "operand", value: char });
      recordTrace(char, `Push operand '${char}'`, false);
      lastType = "operand";
    } else if (char === "(") { // Open parenthesis
       if (lastType === "operand" || lastType === "close") {
          // IMPLICIT MULTIPLICATION: Insert '*' operator

          // Apply operators with higher or equal precedence than implicit '*'
          while (
            opStack.length > 0 &&
            opStack[opStack.length - 1] !== "(" &&
            precedence(opStack[opStack.length - 1]) >= precedence('*')
          ) {
            const op = opStack.pop()!;
            if (!applyOp(op, nodeStack)) {
              error = `Operator '${op}' is missing operands during implicit multiplication setup.`;
              recordTrace(char, `Error: Missing operands for '${op}' (implicit *)`, true);
              break;
            }
            recordTrace(char, `Apply op '${op}' due to precedence before implicit '*'`, false);
          }
          if (error) break;

          opStack.push('*');
          recordTrace(char, "Push implicit '*' operator", false);
          lastType = "operator"; // Treat implicit '*' like an explicit one for type checking
       }
       pdaStack.push("(");
       opStack.push("(");
       recordTrace(char, "Push '(' to PDA & Op stacks", false);
       lastType = "open";
    } else if (char === ")") { // Close parenthesis
      if (lastType === "operator" || lastType === "open") {
          error = `Unexpected ')' at position ${i}. Operand or '(' expected before ')'.`;
          recordTrace(char, `Error: Unexpected ')'`, true);
          break;
      }
      if (pdaStack.length === 0 || pdaStack[pdaStack.length - 1] !== "(") {
        error = `Unmatched ')' at position ${i}`;
        recordTrace(char, "Error: Unmatched ')'", true);
        break;
      }
      pdaStack.pop(); // PDA check successful for this pair

      while (opStack.length > 0 && opStack[opStack.length - 1] !== "(") {
        const op = opStack.pop()!;
        if (!applyOp(op, nodeStack)) {
          error = `Operator '${op}' inside parentheses is missing operands.`;
          recordTrace(char, `Error: Missing operands for '${op}'`, true);
          break;
        }
        recordTrace(char, `Apply op '${op}' due to ')'`, false);
      }
      if (error) break;

      if (opStack.length === 0 || opStack[opStack.length - 1] !== "(") {
         error = `Mismatched parentheses - closing ')' did not find matching '('.`; // Should be caught by PDA stack check earlier, but good failsafe
         recordTrace(char, `Error: Mismatched '('`, true);
         break;
      }
      opStack.pop(); // Pop the '(' from op stack
      recordTrace(char, "Pop '(' from PDA & Op stacks", false);
      lastType = "close";

    } else if (operators.has(char)) { // Operator
      if (lastType !== "operand" && lastType !== "close") {
        error = `Operator '${char}' at position ${i} is not preceded by a valid operand or ')'.`;
        recordTrace(char, `Error: Misplaced operator '${char}'`, true);
        break;
      }

      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1] !== "(" &&
        precedence(opStack[opStack.length - 1]) >= precedence(char)
      ) {
        const op = opStack.pop()!;
        if (!applyOp(op, nodeStack)) {
          error = `Operator '${op}' is missing operands during precedence application.`;
          recordTrace(char, `Error: Missing operands for '${op}'`, true);
          break;
        }
        recordTrace(char, `Apply op '${op}' due to precedence`, false);
      }
       if (error) break;

      opStack.push(char);
      recordTrace(char, `Push operator '${char}'`, false);
      lastType = "operator";
    } else {
      error = `Invalid character '${char}' at position ${i}`;
      recordTrace(char, `Error: Invalid character`, true);
      break;
    }
  }

  // After loop, process remaining operators
  if (!error) {
    while (opStack.length > 0) {
      const op = opStack.pop()!;
      if (op === "(") { // Should not happen if parentheses are balanced
        error = "Mismatched '(' found at end of expression processing.";
        recordTrace(null, "Error: Unmatched '(' at end", true);
        break;
      }
      if (!applyOp(op, nodeStack)) {
        error = `Operator '${op}' at end of expression is missing operands.`;
        recordTrace(null, `Error: Missing operands for '${op}' at end`, true);
        break;
      }
      recordTrace(null, `Apply remaining op '${op}'`, false);
    }
  }

  // Final PDA check for unmatched open parentheses
  if (!error && pdaStack.length > 0) {
    error = "Unmatched '(' in expression.";
    recordTrace(null, "Error: Unmatched '(' detected by PDA", true);
  }

  // Final check for validity: no error and exactly one node in the stack
  const finalValid = !error && nodeStack.length === 1;
  if (!error && nodeStack.length !== 1) {
      if (nodeStack.length === 0 && expr.replace(/\s/g,'').length > 0 && !trace.some(t=>t.error)){
          error = "Expression parsed, but resulted in empty node stack (likely operator issue)."
      } else if (nodeStack.length > 1) {
        error = "Malformed expression: Parsed result has too many root nodes.";
      }
      // record final error state if validity check failed
      if (!trace.some(t=>t.error)) {
           recordTrace(null, error, true)
      }
  }

  return {
    valid: finalValid,
    error,
    trace,
    parseTree: finalValid ? nodeStack[0] : null,
  };
}

// Recursively render the parse tree
function RenderTree({ node }: { node: Node | null }) {
  if (!node) return null;
  return (
    <div className="flex flex-col items-center">
      <div className="rounded px-2 py-1 bg-blue-100 text-blue-900 font-mono mb-1 border border-blue-400">
        {node.value}
      </div>
      {(node.left || node.right) && (
        <div className="flex gap-4">
          {node.left && <RenderTree node={node.left} />}
          {node.right && <RenderTree node={node.right} />}
        </div>
      )}
    </div>
  );
}

const GlobalStyles = () => (
  <style jsx global>{`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.5s ease-out;
    }
  `}</style>
);

export default function Home() {
  const [input, setInput] = useState("");
  const [touched, setTouched] = useState(false);
  const { valid, error, trace, parseTree } = validateExpression(input);

  return (
    <>
      <GlobalStyles /> 
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-blue-800 mb-2 text-center" style={{fontFamily: 'var(--font-main)'}}>PDA Arithmetic Expression Validator</h1>
          <p className="text-gray-600 text-center mb-4" style={{fontFamily: 'var(--font-main)'}}>Enter an arithmetic expression with variables (a-z), operators (+, -, *, /), and parentheses. The PDA will validate the syntax and show the stack trace and parse tree.</p>
          <input
            className={`w-full px-4 py-2 rounded border-2 transition focus:outline-none text-lg font-mono mb-2 ${!touched ? "border-gray-300" : valid ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"}`}
            placeholder="e.g. ((a+b)*c)/(d-e)"
            value={input}
            onChange={e => { setInput(e.target.value); setTouched(true); }}
            aria-label="Expression input"
          />
          <div className="flex flex-col gap-2">
            {touched && (
              valid ? (
                <div className="text-green-700 font-semibold flex items-center gap-2"><span>✔</span> Expression is valid!</div>
              ) : (
                <div className="text-red-700 font-semibold flex items-center gap-2"><span>✖</span> {error || "Invalid expression"}</div> 
              )
            )}
          </div>
          <div>
            <h2 className="font-bold text-blue-700 mb-2" style={{fontFamily: 'var(--font-main)'}}>Trace Log (PDA Stack | Operator Stack | Node Stack)</h2>
            <div className="overflow-x-auto bg-gray-50 rounded p-2 border border-gray-200 max-h-60">
              <table className="min-w-full text-xs font-mono">
                <thead>
                  <tr className="text-gray-600">
                    <th className="px-2 py-1 text-left">Char</th>
                    <th className="px-2 py-1 text-left">Action</th>
                    <th className="px-2 py-1 text-left">PDA Stack</th>
                    <th className="px-2 py-1 text-left">Op Stack</th>
                    <th className="px-2 py-1 text-left">Node Stack (Values)</th>
                  </tr>
                </thead>
                <tbody>
                  {trace.map((step, i) => (
                    <tr key={i} className={`transition-all hover:bg-blue-50 ${step.error ? 'bg-red-100 text-red-800' : ''}`}>
                      <td className="px-2 py-1 text-center">{step.char ?? 'End'}</td>
                      <td className="px-2 py-1">{step.action}</td>
                      <td className="px-2 py-1">[{step.pdaStack.join(', ')}]</td>
                      <td className="px-2 py-1">[{step.opStack.join(', ')}]</td>
                      <td className="px-2 py-1">[{step.nodeStackSnapshot.join(', ')}]</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-blue-700 mb-2" style={{fontFamily: 'var(--font-main)'}}>Parse Tree</h2>
            <div className="flex justify-center">
              {parseTree ? <RenderTree node={parseTree} /> : <span className="text-gray-400">(Invalid or empty expression)</span>}
            </div>
          </div>
        </div>

        {/* === Credits Section === */}
        <section className="w-full max-w-2xl mt-12 mb-8 px-4 group">
          <h2 className="text-center text-2xl font-bold uppercase tracking-widest text-gray-500 mb-6">Project Credits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Saim", email: "k230708@nu.edu.pk" },
              { name: "Fatimah", email: "k230687@nu.edu.pk" },
              { name: "Meghna", email: "k230507@nu.edu.pk" },
            ].map((member, index) => (
              <div
                key={member.email}
                className="relative group flex flex-col items-center justify-center text-center p-7 rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0_0_#000] hover:shadow-[0_0_0_0_#000] transition-all duration-300 cursor-pointer scale-95 hover:scale-105"
                style={{
                  fontFamily: 'var(--font-main)',
                  animation: `brutalistFadeIn 0.7s cubic-bezier(.55,1.4,.38,.95) both`,
                  animationDelay: `${index * 180}ms`,
                }}
              >
                <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-300 text-black font-black text-xs rounded rotate-2 shadow brutalist-badge" style={{letterSpacing: '0.05em'}}>TOA</span>
                <h3 className="text-2xl font-extrabold mb-2 tracking-tight uppercase" style={{letterSpacing: '-0.04em', color: '#0f172a', textShadow: '1px 2px 0 #facc15'}}> {member.name} </h3>
                <a
                  href={`mailto:${member.email}`}
                  className="text-base font-bold text-blue-700 hover:text-blue-900 hover:underline break-all transition-colors duration-150"
                  style={{background: 'rgba(236, 72, 153, 0.07)', borderRadius: '0.4em', padding: '0.2em 0.5em'}}
                >
                  {member.email}
                </a>
                <span className="mt-4 px-3 py-1 bg-black text-white font-mono text-xs rounded shadow brutalist-tag" style={{letterSpacing: '0.04em'}}>core member</span>
                <div className="absolute -z-10 left-3 top-3 w-4/5 h-4/5 bg-pink-300 opacity-40 blur-[8px] rounded-2xl brutalist-bg-blob animate-pulse" />
              </div>
            ))}
          </div>
          <style jsx>{`
            @keyframes brutalistFadeIn {
              0% { opacity: 0; transform: scale(0.8) rotate(-6deg); filter: blur(6px); }
              70% { opacity: 1; transform: scale(1.04) rotate(1deg); filter: blur(0px); }
              100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0px); }
            }
          `}</style>
        </section>
        {/* === End Credits Section === */}

        <footer className="mt-8 text-gray-400 text-xs">Real-world use: compiler frontend syntax validation.</footer>
      </div>
    </>
  );
}
