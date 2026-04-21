# Scriptorium - Style Guide & Standards

Este documento define os padrões técnicos para o desenvolvimento do **Scriptorium**. Seguí-los garante que o código permaneça legível, seguro e fácil de manter.

## 1. Estrutura de Pastas

O código fonte reside em `/src` e é organizado por responsabilidade:

- `src/api/`: Serviços de comunicação com Supabase.
- `src/components/`: Componentes de UI (funções que retornam/gerenciam elementos DOM).
- `src/core/`: Lógica central (App, State, Config, Settings).
- `src/utils/`: Utilitários gerais (Data, Sanitização, Toast).
- `src/styles/`: CSS específico não coberto pelo Tailwind.

## 2. Nomenclatura

- **Pastas e Arquivos**: `kebab-case.js` (Ex: `text-item.js`).
- **Componentes (Funções)**: `PascalCase` (Ex: `function TextItem()`).
- **Funções e Variáveis**: `camelCase` (Ex: `const activeText = ...`).
- **Constantes**: `SCREAMING_SNAKE_CASE` (Ex: `const API_URL = ...`).

## 3. Segurança (XSS & RLS)

- **Sanitização**: Nunca renderize HTML vindo do banco sem passar pelo `DOMPurify`.
- **textContent**: Use `element.textContent` em vez de `innerHTML` para nomes, títulos e qualquer string de texto simples controlada pelo usuário.
- **RLS**: Toda lógica de segurança deve residir no banco de dados (Row Level Security). O frontend é apenas uma interface.

## 4. Componentização Funcional

Componentes devem ser funções puras que recebem dados e retornam elementos DOM ou gerenciam uma seção específica do DOM.

```javascript
/**
 * @param {Object} props
 * @returns {HTMLElement}
 */
export function CollectionItem({ id, name, icon }) {
    const el = document.createElement('a');
    el.className = '...';
    // ... lógica de montagem segura ...
    return el;
}
```

## 5. Boas Práticas

- **JSDoc**: Documente todas as funções públicas com tipos de parâmetros e retorno.
- **Tratamento de Erros**: Use `try/catch` em todas as operações de rede.
- **Mobile First**: Desenvolva pensando no layout responsivo desde o início.
- **Semântica**: Use HTML5 semântico (`<article>`, `<aside>`, `<time>`, etc).
