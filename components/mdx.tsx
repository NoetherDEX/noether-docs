import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { isValidElement, type ComponentProps, type ReactNode } from 'react';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { Steps, Step } from '@/components/steps';
import { ScrollTable } from '@/components/scroll-table';
import { Address, ContractsMeta, ContractsTable } from '@/components/contracts-table';
import { MarketsTable } from '@/components/markets-table';
import { Diagram } from '@/components/diagram';

function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement(node)) return textOf((node.props as { children?: ReactNode }).children);
  return '';
}

// Header cell texts of a markdown table, used to name its scroll container.
function headerCells(node: ReactNode, out: string[] = []): string[] {
  if (Array.isArray(node)) node.forEach((n) => headerCells(n, out));
  else if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    if (node.type === 'th') out.push(textOf(props.children).trim());
    else headerCells(props.children, out);
  }
  return out;
}

export function getMDXComponents(components?: MDXComponents) {
  // Code blocks scroll inside a `region` landmark; give each one a distinct
  // name. One counter per page render (this factory runs once per page).
  let codeIndex = 0;

  return {
    ...defaultMdxComponents,
    pre: ({ ref: _ref, ...props }: ComponentProps<'pre'>) => {
      codeIndex += 1;
      const title = typeof props.title === 'string' && props.title ? props.title : null;
      return (
        <CodeBlock {...props} viewportProps={{ 'aria-label': title ? `Code: ${title}` : `Code sample ${codeIndex}` }}>
          <Pre>{props.children}</Pre>
        </CodeBlock>
      );
    },
    table: (props: ComponentProps<'table'>) => (
      <ScrollTable {...props} label={headerCells(props.children).filter(Boolean).join(', ')} />
    ),
    Tabs,
    Tab,
    Callout,
    Cards,
    Card,
    Steps,
    Step,
    ContractsTable,
    ContractsMeta,
    Address,
    MarketsTable,
    Diagram,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
