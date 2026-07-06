export type JsonLd = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface HomeJsonLdInput {
  threadTitles?: string[];
  threadPaths?: string[];
}

export interface MatchThreadsJsonLdInput {
  threadTitles: string[];
  threadPaths: string[];
}

export interface TransferRumorsJsonLdInput {
  threadTitles: string[];
  threadPaths: string[];
}

export interface ThreadJsonLdInput {
  title: string;
  path: string;
  authorName: string;
  datePublished: string;
  dateModified: string;
  replyCount: number;
  breadcrumbs: BreadcrumbItem[];
}
