import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';
import * as monaco from 'monaco-editor';
import { useSnippetStore, Snippet } from './store/snippetStore';

// Define the type for the window.api object
declare global {
  interface Window {
    api: {
      executeCode: (code: string, language: string) => Promise<{
        success: boolean;
        stdout?: string;
        stderr?: string;
        error?: string;
      }>;
    };
  }
}

// Define the supported languages
const LANGUAGES = [
  { id: 'php', name: 'PHP' },
  { id: 'javascript', name: 'JavaScript' }
];

const App: React.FC = () => {
  const [code, setCode] = useState<string>('<?php\n\necho "Hello, Tinkers!";\n');
  const [language, setLanguage] = useState<string>('php');
  const [output, setOutput] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [showSnippets, setShowSnippets] = useState<boolean>(false);
  const [newSnippetName, setNewSnippetName] = useState<string>('');
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  
  // Access snippet store
  const { 
    snippets, 
    activeSnippetId, 
    addSnippet, 
    updateSnippet, 
    deleteSnippet, 
    setActiveSnippet, 
    getActiveSnippet 
  } = useSnippetStore();

  // Handle editor mounting
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // Update default code based on language if no snippet is active
    if (!activeSnippetId) {
      if (newLanguage === 'php') {
        setCode('<?php\n\necho "Hello, Tinkers!";\n');
      } else if (newLanguage === 'javascript') {
        setCode('console.log("Hello, Tinkers!");\n');
      }
    } else {
      // Update the active snippet's language
      updateSnippet(activeSnippetId, { language: newLanguage });
    }
  };

  // Execute the code
  const executeCode = async () => {
    if (!code.trim()) return;
    
    setIsExecuting(true);
    setOutput('Executing...');
    
    try {
      const result = await window.api.executeCode(code, language);
      
      if (result.success) {
        setIsError(false);
        setOutput(result.stdout || 'Code executed successfully with no output.');
      } else {
        setIsError(true);
        setOutput(`Error: ${result.error}\n${result.stderr || ''}`);
      }
    } catch (error) {
      setIsError(true);
      setOutput(`Execution failed: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Save current code as a snippet
  const saveSnippet = () => {
    if (!newSnippetName.trim()) {
      alert('Please enter a name for your snippet');
      return;
    }

    if (activeSnippetId) {
      // Update existing snippet
      updateSnippet(activeSnippetId, {
        name: newSnippetName,
        code,
        language
      });
    } else {
      // Create new snippet
      addSnippet(newSnippetName, language, code);
    }

    setNewSnippetName('');
    setShowSnippets(false);
  };

  // Load a snippet
  const loadSnippet = (snippet: Snippet) => {
    setLanguage(snippet.language);
    setCode(snippet.code);
    setActiveSnippet(snippet.id);
    setNewSnippetName(snippet.name);
    setShowSnippets(false);
  };

  // Create a new snippet (clear current one)
  const createNewSnippet = () => {
    setActiveSnippet(null);
    setNewSnippetName('');
    
    // Set default code for the selected language
    if (language === 'php') {
      setCode('<?php\n\necho "Hello, Tinkers!";\n');
    } else if (language === 'javascript') {
      setCode('console.log("Hello, Tinkers!");\n');
    }
  };

  // Update active snippet when code changes
  useEffect(() => {
    if (activeSnippetId) {
      updateSnippet(activeSnippetId, { code });
    }
  }, [code, activeSnippetId]);

  // Load active snippet when component mounts
  useEffect(() => {
    const activeSnippet = getActiveSnippet();
    if (activeSnippet) {
      setLanguage(activeSnippet.language);
      setCode(activeSnippet.code);
      setNewSnippetName(activeSnippet.name);
    }
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Execute on Cmd+Enter or Ctrl+Enter
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        executeCode();
      }
      
      // Save on Cmd+S or Ctrl+S
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowSnippets(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-dark-darker p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary mr-4">Tinkers</h1>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          
          <div className="ml-4 flex items-center">
            <button
              onClick={() => setShowSnippets(!showSnippets)}
              className="px-3 py-1 rounded text-white bg-dark hover:bg-dark-lighter text-sm"
            >
              {activeSnippetId ? 'Snippets' : 'Save'}
            </button>
            
            {activeSnippetId && (
              <span className="ml-2 text-sm text-gray-400">
                {getActiveSnippet()?.name}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={executeCode}
          disabled={isExecuting}
          className={`px-4 py-1 rounded text-white ${
            isExecuting ? 'bg-gray-600' : 'bg-primary hover:bg-primary-dark'
          }`}
        >
          {isExecuting ? 'Executing...' : 'Run'} (⌘+Enter)
        </button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Snippets sidebar */}
        {showSnippets && (
          <div className="w-64 bg-dark-darker border-r border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold mb-2">Snippets</h2>
              <div className="flex flex-col mb-2">
                <input
                  type="text"
                  value={newSnippetName}
                  onChange={(e) => setNewSnippetName(e.target.value)}
                  placeholder="Snippet name"
                  className="bg-dark border border-gray-700 rounded px-2 py-1 text-sm mb-2"
                />
                <div className="flex">
                  <button
                    onClick={saveSnippet}
                    className="px-3 py-1 rounded text-white bg-primary hover:bg-primary-dark text-sm flex-1 mr-1"
                  >
                    {activeSnippetId ? 'Update' : 'Save'}
                  </button>
                  <button
                    onClick={createNewSnippet}
                    className="px-3 py-1 rounded text-white bg-secondary hover:bg-secondary-dark text-sm flex-1 ml-1"
                  >
                    New
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              {snippets.length === 0 ? (
                <p className="text-gray-500 p-4 text-sm">No snippets saved yet</p>
              ) : (
                <ul>
                  {snippets.map(snippet => (
                    <li 
                      key={snippet.id}
                      className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-dark-lighter flex justify-between items-center ${
                        activeSnippetId === snippet.id ? 'bg-dark-lighter' : ''
                      }`}
                    >
                      <div onClick={() => loadSnippet(snippet)} className="flex-1">
                        <div className="font-medium">{snippet.name}</div>
                        <div className="text-xs text-gray-500">{snippet.language}</div>
                      </div>
                      <button
                        onClick={() => deleteSnippet(snippet.id)}
                        className="text-red-500 hover:text-red-400 text-sm"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Editor panel */}
        <div className={`${showSnippets ? 'w-1/2' : 'w-1/2'} h-full border-r border-gray-700`}>
          <div className="editor-container">
            <MonacoEditor
              language={language}
              theme="vs-dark"
              value={code}
              onChange={setCode}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                fontFamily: "'Fira Code', monospace",
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true,
              }}
              editorDidMount={handleEditorDidMount}
            />
          </div>
        </div>

        {/* Output panel */}
        <div className={`${showSnippets ? 'w-1/3' : 'w-1/2'} h-full`}>
          <div className={`output-container h-full ${isError ? 'output-error' : 'output-success'}`}>
            <pre>{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
