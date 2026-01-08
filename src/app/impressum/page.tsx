'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { CONTACT_CONFIG } from '@/lib/constants'

export default function ImpressumPage() {
  const { language } = useLanguage()

  const content = {
    title: {
      en: 'Legal Notice',
      de: 'Impressum'
    },
    intro: {
      en: 'Information according to German law',
      de: 'Angaben gemäß deutschem Recht'
    },
    responsiblePerson: {
      en: 'Responsible for Content',
      de: 'Verantwortlich für den Inhalt'
    },
    contact: {
      en: 'Contact',
      de: 'Kontakt'
    },
    disclaimer: {
      en: 'Disclaimer',
      de: 'Haftungsausschluss'
    },
    privateNote: {
      en: 'Private Travel Blog',
      de: 'Privater Reiseblog'
    },
    privateText: {
      en: 'This is a private travel blog without commercial intent. The content is created as a hobby and for personal documentation. The voluntary support via Ko-fi serves to cover hosting costs and does not represent commercial activity.',
      de: 'Dies ist ein privater Reiseblog ohne gewerbliche Absicht. Die Inhalte werden als Hobby und zur persönlichen Dokumentation erstellt. Die freiwillige Unterstützung via Ko-fi dient der Deckung der Hosting-Kosten und stellt keine gewerbliche Tätigkeit dar.'
    },
    liabilityContent: {
      en: 'Liability for Content',
      de: 'Haftung für Inhalte'
    },
    liabilityContentText: {
      en: 'As a service provider, I am responsible for my own content on these pages in accordance with general laws. However, I am not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information under general laws remain unaffected.',
      de: 'Als Diensteanbieter bin ich gemäß den allgemeinen Gesetzen für eigene Inhalte auf diesen Seiten verantwortlich. Ich bin jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.'
    },
    liabilityLinks: {
      en: 'Liability for Links',
      de: 'Haftung für Links'
    },
    liabilityLinksText: {
      en: 'This website contains links to external websites over which I have no control. Therefore, I cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.',
      de: 'Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.'
    },
    copyright: {
      en: 'Copyright',
      de: 'Urheberrecht'
    },
    copyrightText: {
      en: 'All content, texts, images, and graphics on this website are protected by copyright and are the property of Luis Amadeus Guenther. Any use, reproduction, or distribution without express written permission is prohibited. Downloads and copies of this page are only permitted for private, non-commercial use.',
      de: 'Sämtliche Inhalte, Texte, Bilder und Grafiken dieser Website unterliegen dem Urheberrecht und sind Eigentum von Luis Amadeus Guenther. Jegliche Verwendung, Vervielfältigung oder Verbreitung ohne ausdrückliche schriftliche Genehmigung ist untersagt. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.'
    }
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

          {/* Responsible Person */}
          <section className="bg-white p-6 rounded-lg border border-dark/10">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.responsiblePerson[language]}
            </h2>
            <div className="space-y-2">
              <p className="font-semibold text-dark">Luis Amadeus Guenther</p>
              <p>Moellhoven 86D</p>
              <p>45357 Essen</p>
              <p>Deutschland</p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white p-6 rounded-lg border border-dark/10">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.contact[language]}
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">E-Mail:</span>{' '}
                <a href={`mailto:${CONTACT_CONFIG.email}`} className="hover:underline text-dark">
                  {CONTACT_CONFIG.email}
                </a>
              </p>
              <p>
                <span className="font-semibold">{language === 'de' ? 'Telefon' : 'Phone'}:</span>{' '}
                <a href="tel:+4917672601048" className="hover:underline text-dark">
                  +49 176 72601048
                </a>
              </p>
            </div>
          </section>

          {/* Private Blog Note */}
          <section className="bg-warm-cream p-6 rounded-lg border border-dark/10">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.privateNote[language]}
            </h2>
            <p className="text-dark/70">
              {content.privateText[language]}
            </p>
          </section>

          {/* Liability for Content */}
          <section className="bg-white p-6 rounded-lg border border-dark/10">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.liabilityContent[language]}
            </h2>
            <p className="text-dark/70">
              {content.liabilityContentText[language]}
            </p>
          </section>

          {/* Liability for Links */}
          <section className="bg-white p-6 rounded-lg border border-dark/10">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.liabilityLinks[language]}
            </h2>
            <p className="text-dark/70">
              {content.liabilityLinksText[language]}
            </p>
          </section>

          {/* Copyright */}
          <section className="bg-white p-6 rounded-lg border border-dark/10">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              {content.copyright[language]}
            </h2>
            <p className="text-dark/70">
              {content.copyrightText[language]}
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
