"use client"

import { useEffect, useState } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react';

import BetterWebSocket from "partysocket/ws";
import YPartyKitProvider from "y-partykit/provider";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import * as ts from "typescript";

export default function EditorPage() {
    const monaco = useMonaco();
    const [consoleOutput, setConsoleOutput] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (monaco) {
                // create a yew yjs doc
                const ydoc = new Y.Doc();
                // establish partykit as your websocket provider
                const provider = new YPartyKitProvider("https://partykit-nextjs-monaco-editor-example-party.samzorik.partykit.dev", "nextjs-monaco-demo", ydoc, {
                    // @ts-expect-error TODO: fix this
                    WebSocketPolyfill: BetterWebSocket,
                });
                // send a readiness check to partykit
                provider.ws?.send("it's happening!");
                // get the text from the monaco editor
                const yDocTextMonaco = ydoc.getText("monaco");
                // get the monaco editor
                const editor = monaco.editor.getEditors()[0];
                editor.setModel(monaco.editor.createModel("", "typescript"));
                // create the monaco binding to the yjs doc
                new MonacoBinding(
                    yDocTextMonaco,
                    editor.getModel()!,
                    // @ts-expect-error TODO: fix this
                    new Set([editor]),
                    provider.awareness
                );
                // enable a button to connect and disconnect from partykit
                const connectButton = document.getElementById("y-connect-button")!;
                connectButton.addEventListener("click", () => {
                    if (provider.shouldConnect) {
                        provider.disconnect();
                        connectButton.textContent = "🎈 Connect";
                    } else {
                        provider.connect();
                        connectButton.textContent = "👋 Disconnect";
                    }
                });
                const runButton = document.getElementById("y-run-button")!;
                runButton.addEventListener("click", () => {
                  const tsCode = editor.getValue();
                  const jsCode = ts.transpile(tsCode);
                  let capturedOutput = '';
                  const originalConsoleLog = console.log;

                  console.log = (...args) => {
                    capturedOutput += args.join(' ') + '\n';
                    originalConsoleLog(...args); // Optionally log to browser console as well
                  };

                  try {
                    // Execute the transpiled JavaScript
                    new Function(jsCode)();
                  } catch (error) {
                    capturedOutput += `Error: ${error}\n`;
                  } finally {
                    console.log = originalConsoleLog; // Restore original console.log
                    setConsoleOutput(capturedOutput);
                  }
                  try {
                    eval(jsCode);
                  } catch (error) {
                    console.error("Error during execution:", error);
                  }

                });
            }
        }
    }, [monaco]);

    return (
        <section className="min-h-screen items-center justify-center mx-auto max-w-2xl space-y-2 m-5">
            <Editor
                theme="vs-dark"
                defaultLanguage="javascript"
                defaultValue="// what good shall we do this day?"
                className="bg-background h-[720px] shadow-lg"
            />
            <textarea value={consoleOutput} readOnly={true} name="result" id="result" rows={10} cols={30} style={{ backgroundColor: '#1e1e1e'}}
                      className="bg-background h-[720px] shadow-lg"></textarea>
            <button id="y-run-button" className="px-4 py-3 bg-neutral-200 rounded font-medium hover:bg-neutral-300 transition duration-300 dark:bg-neutral-500 dark:hover:bg-neutral-600">Run</button>
            <button id="y-connect-button" className="px-4 py-3 bg-neutral-200 rounded font-medium hover:bg-neutral-300 transition duration-300 dark:bg-neutral-500 dark:hover:bg-neutral-600">👋 Disconnect</button>
        </section>
    )
}
