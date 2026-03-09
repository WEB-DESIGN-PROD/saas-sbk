import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: [{{LOCALES_ARRAY}}],
  defaultLocale: '{{DEFAULT_LANGUAGE}}',
})
