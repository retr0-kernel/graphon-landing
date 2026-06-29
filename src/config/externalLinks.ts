export interface ExternalLink {
  label: string;
  href: string;
  icon: string;
  isGitHub?: boolean;
}

export const GITHUB_URL = 'https://github.com/retr0-kernel/graphon-helm' as const;

export const EXTERNAL_LINKS: readonly ExternalLink[] = [

  { label: 'Docs',       href: '/docs',                                                                         icon: 'menu_book'     },

] as const;

export const BOTTOM_LINKS: readonly Omit<ExternalLink, 'icon' | 'isGitHub'>[] = [
  { label: 'License',  href: `${GITHUB_URL}/blob/main/LICENSE` },
  { label: 'Releases', href: `${GITHUB_URL}/releases`          },
  { label: 'Issues',   href: `${GITHUB_URL}/issues`            },
] as const;
