'use client'

import { useTranslations } from 'next-intl'

export default function PrivacyPage() {
  const t = useTranslations('Privacy')
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('policy')}</h1>

      <div className="prose prose-slate max-w-none">
        <p>{t('policy1')}</p>

        <h2 className="text-2xl font-bold mt-8 mb-4 uppercase">{t('about')}</h2>
        <p></p>
        <p>{t('services')}</p>

        <h2 className="text-2xl font-bold mt-8 mb-4 uppercase">
          {t('concent')}
        </h2>
        <p>{t('policy2')}</p>
        <p>{t('policy3')}</p>
        <p>{t('acceptance')}</p>

        <h2 className="text-2xl font-bold mt-8 mb-4 uppercase">
          {t('collection')}
        </h2>
        <p>{t('policy4')}</p>

        {/* Continue with the rest of the sections following the same pattern... */}

        <h2 className="text-2xl font-bold mt-8 mb-4 uppercase">
          {t('information')}
        </h2>
        <p>{t('policy5')}</p>
        <p>{t('policy6')}</p>
      </div>
    </div>
  )
}
