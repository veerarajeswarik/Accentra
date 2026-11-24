/**
 * The "marketing" namespace is registered here, inside the lazily loaded marketing chunk,
 * so its (long) copy is not part of the main bundle the workspace loads.
 */
import i18n from '../../lib/i18n';
import marketing from '../../locales/en/marketing.json';

if (!i18n.hasResourceBundle('en', 'marketing')) {
  i18n.addResourceBundle('en', 'marketing', marketing);
}
