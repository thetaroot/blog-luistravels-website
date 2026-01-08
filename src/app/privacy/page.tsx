'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { CONTACT_CONFIG } from '@/lib/constants'

export default function PrivacyPage() {
  const { language } = useLanguage()

  const content = {
    title: {
      en: 'Privacy Policy',
      de: 'Datenschutzerklärung'
    },
    intro: {
      en: 'Data Protection Information according to GDPR',
      de: 'Datenschutzinformationen gemäß DSGVO'
    },
    responsible: {
      en: 'Responsible Party',
      de: 'Verantwortlicher'
    },
    dataCollection: {
      en: 'Data Collection and Processing',
      de: 'Datenerhebung und -verarbeitung'
    },
    privacyFriendly: {
      en: 'This Website Does NOT Use:',
      de: 'Diese Website nutzt NICHT:'
    },
    hosting: {
      en: 'Hosting',
      de: 'Hosting'
    },
    hostingTitle: {
      en: 'GitHub Pages',
      de: 'GitHub Pages'
    },
    hostingText: {
      en: 'This website is hosted on GitHub Pages. When you visit this website, GitHub servers may automatically collect and store certain information in server log files, including:',
      de: 'Diese Website wird auf GitHub Pages gehostet. Beim Besuch dieser Website können die Server von GitHub automatisch bestimmte Informationen in Server-Logfiles erfassen und speichern, darunter:'
    },
    hostingDataTransfer: {
      en: 'Data Transfer to USA',
      de: 'Datenübermittlung in die USA'
    },
    hostingDataTransferText: {
      en: 'GitHub Pages servers are located in the USA. Data transfer is based on Standard Contractual Clauses (SCCs) approved by the EU Commission, which ensure an adequate level of data protection. GitHub commits to upholding European data protection standards when storing, processing, and managing data in the USA. Additionally, GitHub is certified under the EU-US Data Privacy Framework (DPF). The legal basis for data processing is Art. 6 para. 1 lit. f GDPR (legitimate interest in the technically error-free display and optimization of the website).',
      de: 'Die Server von GitHub Pages befinden sich in den USA. Die Datenübermittlung erfolgt auf Grundlage der Standard-Vertragsklauseln (Standard Contractual Clauses, SCCs) der EU-Kommission, die ein angemessenes Datenschutzniveau gewährleisten. GitHub verpflichtet sich damit, die europäischen Datenschutzstandards auch bei der Speicherung, Verarbeitung und Verwaltung der Daten in den USA einzuhalten. Zusätzlich verfügt GitHub über eine Zertifizierung nach dem EU-US Data Privacy Framework (DPF). Die Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der technisch fehlerfreien Darstellung und Optimierung der Website).'
    },
    localStorage: {
      en: 'Local Storage',
      de: 'Local Storage'
    },
    localStorageText: {
      en: 'This website uses the browser\'s localStorage to save your language preference and improve website performance. This data is stored exclusively in your browser and is never transmitted to external servers. You can delete this data at any time through your browser settings.',
      de: 'Diese Website nutzt den localStorage des Browsers, um Ihre Sprachpräferenz zu speichern und die Website-Performance zu verbessern. Diese Daten werden ausschließlich in Ihrem Browser gespeichert und niemals an externe Server übermittelt. Sie können diese Daten jederzeit über Ihre Browser-Einstellungen löschen.'
    },
    externalServices: {
      en: 'External Services',
      de: 'Externe Dienste'
    },
    kofi: {
      en: 'Ko-fi (Voluntary Support)',
      de: 'Ko-fi (Freiwillige Unterstützung)'
    },
    kofiText: {
      en: 'This website includes a link to Ko-fi (ko-fi.com), a third-party platform for voluntary support. When you click on this link and visit Ko-fi, their privacy policy applies. Personal data is only transmitted when you actively use Ko-fi and is not automatically collected by visiting this website.',
      de: 'Diese Website enthält einen Link zu Ko-fi (ko-fi.com), einer Drittanbieter-Plattform für freiwillige Unterstützung. Wenn Sie auf diesen Link klicken und Ko-fi besuchen, gilt deren Datenschutzerklärung. Personenbezogene Daten werden nur übermittelt, wenn Sie Ko-fi aktiv nutzen, und nicht automatisch beim Besuch dieser Website erfasst.'
    },
    socialMedia: {
      en: 'Social Media Links',
      de: 'Social Media Links'
    },
    socialMediaText: {
      en: 'This website contains links to social media platforms (Instagram, Pinterest). These are simple hyperlinks without embedded plugins. No data is transmitted to these platforms until you actively click on the links.',
      de: 'Diese Website enthält Links zu Social-Media-Plattformen (Instagram, Pinterest). Dies sind einfache Hyperlinks ohne eingebettete Plugins. Es werden keine Daten an diese Plattformen übermittelt, bis Sie aktiv auf die Links klicken.'
    },
    email: {
      en: 'Email Contact',
      de: 'E-Mail-Kontakt'
    },
    emailText: {
      en: 'If you contact us via email, your data (email address, name, message content) will be stored to process your inquiry. This data will not be shared with third parties and will be deleted after your inquiry has been fully processed.',
      de: 'Wenn Sie uns per E-Mail kontaktieren, werden Ihre Daten (E-Mail-Adresse, Name, Nachrichteninhalt) zur Bearbeitung Ihrer Anfrage gespeichert. Diese Daten werden nicht an Dritte weitergegeben und nach vollständiger Bearbeitung Ihrer Anfrage gelöscht.'
    },
    rights: {
      en: 'Your Rights',
      de: 'Ihre Rechte'
    },
    rightsText: {
      en: 'You have the right to:',
      de: 'Sie haben das Recht auf:'
    },
    rightsList: {
      en: [
        'Information about stored data (Art. 15 GDPR)',
        'Correction of incorrect data (Art. 16 GDPR)',
        'Deletion of data (Art. 17 GDPR)',
        'Restriction of processing (Art. 18 GDPR)',
        'Data portability (Art. 20 GDPR)',
        'Object to processing (Art. 21 GDPR)',
        'Withdraw consent (Art. 7 para. 3 GDPR)',
        'Lodge a complaint with a supervisory authority (Art. 77 GDPR)'
      ],
      de: [
        'Auskunft über gespeicherte Daten (Art. 15 DSGVO)',
        'Berichtigung unrichtiger Daten (Art. 16 DSGVO)',
        'Löschung von Daten (Art. 17 DSGVO)',
        'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
        'Datenübertragbarkeit (Art. 20 DSGVO)',
        'Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)',
        'Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO)',
        'Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)'
      ]
    },
    contact: {
      en: 'Contact for Privacy Matters',
      de: 'Kontakt in Datenschutzfragen'
    },
    privacyNote: {
      en: 'Privacy-Friendly Design',
      de: 'Datenschutzfreundliche Gestaltung'
    },
    privacyNoteText: {
      en: 'This website is intentionally designed to be privacy-friendly and avoids unnecessary data collection. The focus is on providing content without compromising your privacy.',
      de: 'Diese Website ist bewusst datenschutzfreundlich gestaltet und verzichtet auf unnötige Datenerhebung. Der Fokus liegt auf der Bereitstellung von Inhalten, ohne Ihre Privatsphäre zu beeinträchtigen.'
    }
  }

  const privacyFriendlyList = {
    en: [
      'Cookies (except technically necessary session cookies)',
      'Analytics tools (Google Analytics, Matomo, etc.)',
      'Tracking technologies',
      'Advertising services or retargeting pixels',
      'Social media plugins (embedded content)'
    ],
    de: [
      'Cookies (außer technisch notwendigen Session-Cookies)',
      'Analyse-Tools (Google Analytics, Matomo, etc.)',
      'Tracking-Technologien',
      'Werbedienste oder Retargeting-Pixel',
      'Social Media Plugins (eingebettete Inhalte)'
    ]
  }

  const serverLogData = {
    en: [
      'Browser type and version',
      'Operating system',
      'Referrer URL',
      'Hostname of the accessing computer',
      'Time of server request',
      'IP address'
    ],
    de: [
      'Browsertyp und -version',
      'Betriebssystem',
      'Referrer URL',
      'Hostname des zugreifenden Rechners',
      'Uhrzeit der Serveranfrage',
      'IP-Adresse'
    ]
  }

  return (
    <div className="min-h-screen bg-warm-white pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <Breadcrumbs />

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-dark mb-8">
          {content.title[language]}
        </h1>

        <div className="space-y-8 text-dark/80 leading-relaxed">

          {/* Responsible Party */}
          <section className="bg-white p-6 rounded-lg border border-dark/10">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.responsible[language]}
            </h2>
            <div className="space-y-2">
              <p className="font-semibold text-dark">Luis Amadeus Guenther</p>
              <p>Moellhoven 86D</p>
              <p>45357 Essen</p>
              <p>Deutschland</p>
              <p className="mt-4">
                <span className="font-semibold">E-Mail:</span>{' '}
                <a href={`mailto:${CONTACT_CONFIG.email}`} className="hover:underline text-dark">
                  {CONTACT_CONFIG.email}
                </a>
              </p>
            </div>
          </section>

          {/* Privacy-Friendly Design */}
          <section className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.privacyNote[language]}
            </h2>
            <p className="text-dark/70 mb-4">
              {content.privacyNoteText[language]}
            </p>

            <h3 className="text-xl font-semibold text-dark mb-3">
              {content.privacyFriendly[language]}
            </h3>
            <ul className="space-y-2">
              {privacyFriendlyList[language].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg">✗</span>
                  <span className="text-dark/70">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* GitHub Pages Hosting */}
          <section className="bg-white p-6 rounded-lg border border-dark/10">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.hosting[language]}: {content.hostingTitle[language]}
            </h2>
            <p className="text-dark/70 mb-4">
              {content.hostingText[language]}
            </p>

            <ul className="list-disc list-inside space-y-1 mb-4 text-dark/70">
              {serverLogData[language].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-dark mb-3 mt-6">
              {content.hostingDataTransfer[language]}
            </h3>
            <p className="text-dark/70">
              {content.hostingDataTransferText[language]}
            </p>
          </section>

          {/* Local Storage */}
          <section className="bg-white p-6 rounded-lg border border-dark/10">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.localStorage[language]}
            </h2>
            <p className="text-dark/70">
              {content.localStorageText[language]}
            </p>
          </section>

          {/* External Services */}
          <section className="bg-white p-6 rounded-lg border border-dark/10">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.externalServices[language]}
            </h2>

            <h3 className="text-xl font-semibold text-dark mb-3">
              {content.kofi[language]}
            </h3>
            <p className="text-dark/70 mb-6">
              {content.kofiText[language]}
            </p>

            <h3 className="text-xl font-semibold text-dark mb-3">
              {content.socialMedia[language]}
            </h3>
            <p className="text-dark/70">
              {content.socialMediaText[language]}
            </p>
          </section>

          {/* Email Contact */}
          <section className="bg-white p-6 rounded-lg border border-dark/10">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.email[language]}
            </h2>
            <p className="text-dark/70">
              {content.emailText[language]}
            </p>
          </section>

          {/* Your Rights */}
          <section className="bg-white p-6 rounded-lg border border-dark/10">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.rights[language]}
            </h2>
            <p className="text-dark/70 mb-4">
              {content.rightsText[language]}
            </p>

            <ul className="list-disc list-inside space-y-2 text-dark/70">
              {content.rightsList[language].map((right, index) => (
                <li key={index}>{right}</li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-warm-cream rounded-lg">
              <h3 className="text-lg font-semibold text-dark mb-2">
                {content.contact[language]}
              </h3>
              <p className="text-dark/70">
                E-Mail:{' '}
                <a href={`mailto:${CONTACT_CONFIG.email}`} className="hover:underline text-dark font-semibold">
                  {CONTACT_CONFIG.email}
                </a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
