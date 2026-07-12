import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import type { LegalDocument } from '@/lib/legalContent';

interface LegalDocumentViewProps {
  document: LegalDocument;
}

export default function LegalDocumentView({ document }: LegalDocumentViewProps) {
  return (
    <div className="pt-20 pb-24 min-h-screen bg-surface-50">
      <div className="hero-gradient py-12 md:py-14">
        <div className="container max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 border border-white/20 px-4 py-2 rounded-full text-sm mb-4">
            <FileText className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{document.title}</h1>
          <p className="text-white/75 text-sm md:text-base">
            Effective: {document.effectiveDate} · Last updated: {document.lastUpdated}
          </p>
        </div>
      </div>

      <div className="container max-w-3xl mt-8 md:mt-10">
        <article className="bg-white rounded-2xl shadow-card border border-surface-200 p-6 md:p-10">
          {document.intro && (
            <p className="text-gray-600 leading-relaxed mb-8 pb-8 border-b border-surface-100">
              {document.intro}
            </p>
          )}

          <div className="space-y-8">
            {document.sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="text-gray-600 leading-relaxed mb-3 text-sm md:text-base">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="space-y-2 pl-5 list-disc marker:text-primary-400">
                    {section.list.map((item) => (
                      <li key={item} className="text-gray-600 leading-relaxed text-sm md:text-base">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {document.contact && (
            <div className="mt-10 pt-8 border-t border-surface-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Contact</h2>
              <div className="text-sm text-gray-600 space-y-1.5">
                <p className="font-medium text-gray-800">{document.contact.company}</p>
                <p>
                  Email:{' '}
                  <a href={`mailto:${document.contact.email}`} className="text-primary-600 hover:underline">
                    {document.contact.email}
                  </a>
                </p>
                {document.contact.whatsapp && (
                  <p>
                    WhatsApp:{' '}
                    <a
                      href={`https://wa.me/${document.contact.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {document.contact.whatsapp}
                    </a>
                  </p>
                )}
                {document.contact.address && <p>{document.contact.address}</p>}
                {document.contact.taxCode && <p>Tax code (MST): {document.contact.taxCode}</p>}
              </div>
            </div>
          )}
        </article>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          {document.slug !== 'privacy' && (
            <Link href="/privacy" className="text-gray-500 hover:text-gray-700">
              Privacy Policy
            </Link>
          )}
          {document.slug !== 'terms' && (
            <Link href="/terms" className="text-gray-500 hover:text-gray-700">
              Terms of Service
            </Link>
          )}
          {document.slug !== 'refund' && (
            <Link href="/refund" className="text-gray-500 hover:text-gray-700">
              Refund Policy
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
