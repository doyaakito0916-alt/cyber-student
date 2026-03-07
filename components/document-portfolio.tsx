"use client"

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { MyTag, StatData, Profile } from "@/types"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#e2e8f0",
    backgroundColor: "#0f0f23",
  },
  header: {
    borderBottom: "2px solid #3b82f6",
    paddingBottom: 12,
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#60a5fa",
  },
  occupation: {
    fontSize: 13,
    color: "#f472b6",
    marginTop: 2,
  },
  idText: {
    fontSize: 10,
    color: "#22d3ee",
    marginTop: 6,
  },
  levelBadge: {
    fontSize: 10,
    color: "#60a5fa",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#60a5fa",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 10,
    marginTop: 20,
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#94a3b8",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 9,
    fontWeight: "bold",
  },
  tagCommon: {
    backgroundColor: "#1e293b",
    color: "#94a3b8",
  },
  tagRare: {
    backgroundColor: "#172554",
    color: "#60a5fa",
  },
  tagEpic: {
    backgroundColor: "#2e1065",
    color: "#c084fc",
  },
  tagLegendary: {
    backgroundColor: "#422006",
    color: "#facc15",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  statItem: {
    width: "30%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #1e293b",
    backgroundColor: "#0f172a",
  },
  statLabel: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#60a5fa",
    marginTop: 2,
  },
  statBar: {
    height: 3,
    backgroundColor: "#1e293b",
    borderRadius: 2,
    marginTop: 4,
  },
  statBarFill: {
    height: 3,
    borderRadius: 2,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#475569",
    borderTop: "1px solid #1e293b",
    paddingTop: 8,
  },
})

const tagStyleMap = {
  common: styles.tagCommon,
  rare: styles.tagRare,
  epic: styles.tagEpic,
  legendary: styles.tagLegendary,
}

const barColors = {
  common: "#94a3b8",
  rare: "#60a5fa",
  epic: "#c084fc",
  legendary: "#facc15",
}

interface PortfolioDocumentProps {
  profile: Profile
  stats: StatData[]
  tags: MyTag[]
}

export function PortfolioDocument({ profile, stats, tags }: PortfolioDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.occupation}>{profile.occupation || "未設定"}</Text>
          <Text style={styles.idText}>@{profile.id}</Text>
          <Text style={styles.levelBadge}>
            Level {profile.level} | EXP {profile.exp}
          </Text>
        </View>

        {/* Bio */}
        {profile.bio && (
          <View>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bodyText}>{profile.bio}</Text>
          </View>
        )}

        {/* Stats */}
        <View>
          <Text style={styles.sectionTitle}>Ability Matrix</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <View style={styles.statBar}>
                  <View
                    style={[
                      styles.statBarFill,
                      {
                        width: `${(stat.value / stat.maxValue) * 100}%`,
                        backgroundColor: "#60a5fa",
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tags */}
        {tags.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.tagContainer}>
              {tags.map((tag, i) => (
                <Text key={i} style={[styles.tag, tagStyleMap[tag.rarity]]}>
                  {tag.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          CYBER_STUDENT Portfolio | Generated {new Date().toISOString().split("T")[0].replace(/-/g, ".")}
        </Text>
      </Page>
    </Document>
  )
}
