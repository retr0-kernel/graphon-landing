export interface ExternalLink {
  label: string;
  href: string;
  icon: string;
  isGitHub?: boolean;
}

export const GITHUB_URL = 'https://github.com/retr0-kernel/graphon' as const;

export const EXTERNAL_LINKS: readonly ExternalLink[] = [
  { label: 'GitHub',     href: GITHUB_URL,                                                                        icon: 'github',       isGitHub: true },
  { label: 'Helm Chart', href: 'https://github.com/retr0-kernel/graphon/tree/main/graphon-helm',                  icon: 'deployed_code' },
  { label: 'Docs',       href: 'https://github.com/retr0-kernel/graphon/blob/main/graphon-helm/docs/README.md',   icon: 'menu_book'     },
  { label: 'Changelog',  href: 'https://github.com/retr0-kernel/graphon/releases',                                icon: 'new_releases'  },
] as const;

export const BOTTOM_LINKS: readonly Omit<ExternalLink, 'icon' | 'isGitHub'>[] = [
  { label: 'License',  href: `${GITHUB_URL}/blob/main/LICENSE` },
  { label: 'Releases', href: `${GITHUB_URL}/releases`          },
  { label: 'Issues',   href: `${GITHUB_URL}/issues`            },
] as const;
