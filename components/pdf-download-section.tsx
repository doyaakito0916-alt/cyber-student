"use client"

import { PDFDownloadLink } from "@react-pdf/renderer"
import { ResumeDocument } from "@/components/document-resume"
import { PortfolioDocument } from "@/components/document-portfolio"
import { Download } from "lucide-react"
import type { Profile, MyTag, StatData } from "@/types"

interface PdfDownloadSectionProps {
  docType: "resume" | "portfolio"
  profile: Profile
  tags: MyTag[]
  stats: StatData[]
}

export function PdfDownloadSection({ docType, profile, tags, stats }: PdfDownloadSectionProps) {
  const doc =
    docType === "resume" ? (
      <ResumeDocument profile={profile} tags={tags} />
    ) : (
      <PortfolioDocument profile={profile} stats={stats} tags={tags} />
    )

  return (
    <PDFDownloadLink
      document={doc}
      fileName={`cyber-student-${docType}-${profile.id}.pdf`}
    >
      {({ loading: pdfLoading }) => (
        <button
          type="button"
          disabled={pdfLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neon-pink/50 bg-neon-pink/10 text-neon-pink text-sm font-mono hover:bg-neon-pink/20 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {pdfLoading
            ? "PDF生成中..."
            : docType === "resume"
            ? "履歴書PDFをダウンロード"
            : "ポートフォリオPDFをダウンロード"}
        </button>
      )}
    </PDFDownloadLink>
  )
}
