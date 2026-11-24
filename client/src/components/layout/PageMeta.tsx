/**
 * Per-page <title>, description and Open Graph tags. React 19 hoists these elements into
 * <head> automatically, so no extra library is needed.
 */
export interface PageMetaProps {
  /** Page name, e.g. "Features" → "Features · Accentra". Omit for the home page. */
  title?: string;
  description: string;
  /** Path for og:url, e.g. "/features". */
  path?: string;
}

const SITE_NAME = 'Accentra';

export function PageMeta({ title, description, path = '/' }: PageMetaProps) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  const url = typeof window === 'undefined' ? path : `${window.location.origin}${path}`;
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
    </>
  );
}
