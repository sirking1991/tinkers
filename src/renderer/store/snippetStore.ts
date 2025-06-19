import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Snippet {
  id: string;
  name: string;
  language: string;
  code: string;
  createdAt: number;
  updatedAt: number;
}

interface SnippetState {
  snippets: Snippet[];
  activeSnippetId: string | null;
  addSnippet: (name: string, language: string, code: string) => string;
  updateSnippet: (id: string, updates: Partial<Omit<Snippet, 'id' | 'createdAt'>>) => void;
  deleteSnippet: (id: string) => void;
  setActiveSnippet: (id: string | null) => void;
  getActiveSnippet: () => Snippet | undefined;
}

export const useSnippetStore = create<SnippetState>()(
  persist(
    (set, get) => ({
      snippets: [],
      activeSnippetId: null,
      
      addSnippet: (name, language, code) => {
        const id = Date.now().toString();
        const timestamp = Date.now();
        
        const newSnippet: Snippet = {
          id,
          name,
          language,
          code,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        
        set(state => ({
          snippets: [...state.snippets, newSnippet],
          activeSnippetId: id
        }));
        
        return id;
      },
      
      updateSnippet: (id, updates) => {
        set(state => ({
          snippets: state.snippets.map(snippet => 
            snippet.id === id 
              ? { 
                  ...snippet, 
                  ...updates, 
                  updatedAt: Date.now() 
                } 
              : snippet
          )
        }));
      },
      
      deleteSnippet: (id) => {
        set(state => ({
          snippets: state.snippets.filter(snippet => snippet.id !== id),
          activeSnippetId: state.activeSnippetId === id ? null : state.activeSnippetId
        }));
      },
      
      setActiveSnippet: (id) => {
        set({ activeSnippetId: id });
      },
      
      getActiveSnippet: () => {
        const { snippets, activeSnippetId } = get();
        return snippets.find(snippet => snippet.id === activeSnippetId);
      }
    }),
    {
      name: 'tinkers-snippets',
    }
  )
);
