import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// ── Dev-only Babel plugin: stamps every DOM element with data-component ──────
// Shows "pages/pricing/Pricing" (or similar) in the DevTools Elements panel
// so you can instantly know which file/component owns any element.
const componentAnnotator = ({ types: t }: { types: any }) => ({
  visitor: {
    JSXOpeningElement(nodePath: any, state: any) {
      const filename: string = state.filename ?? '';

      // Only native DOM elements (lowercase tag name)
      const tagName = t.isJSXIdentifier(nodePath.node.name)
        ? (nodePath.node.name.name as string)
        : '';
      if (!tagName || tagName[0] !== tagName[0].toLowerCase()) return;

      // Skip if already annotated
      const already = nodePath.node.attributes.some(
        (a: any) =>
          t.isJSXAttribute(a) &&
          t.isJSXIdentifier(a.name) &&
          a.name.name === 'data-component',
      );
      if (already) return;

      // Relative path from project root, e.g. "pages/pricing/index"
      const rel = path
        .relative(path.join(process.cwd(), 'src'), filename)
        .replace(/\\/g, '/')
        .replace(/\.(tsx|ts|jsx|js)$/, '');

      // Walk up to find the nearest named function / arrow assigned to a variable
      let componentName = '';
      let cur = nodePath.parentPath;
      while (cur) {
        if (cur.isFunctionDeclaration() && cur.node.id?.name) {
          componentName = cur.node.id.name;
          break;
        }
        if (
          (cur.isArrowFunctionExpression() || cur.isFunctionExpression()) &&
          cur.parentPath?.isVariableDeclarator() &&
          t.isIdentifier(cur.parentPath.node.id)
        ) {
          componentName = cur.parentPath.node.id.name;
          break;
        }
        cur = cur.parentPath;
      }

      const label = componentName ? `${rel}/${componentName}` : rel;

      nodePath.node.attributes.push(
        t.jSXAttribute(
          t.jSXIdentifier('data-component'),
          t.stringLiteral(label),
        ),
      );
    },
  },
});

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Only inject annotations in development
      ...(mode === 'development' && {
        babel: { plugins: [componentAnnotator] },
      }),
    }),
  ],
  // BrowserRouter routes and generated per-route HTML must resolve assets from the domain root.
  base: '/',
  build: {
    rollupOptions: {
      output: {
        // Split rarely-changing framework code into its own long-cached chunk,
        // so app-code deploys don't invalidate the (large) React/router bundle.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}));
