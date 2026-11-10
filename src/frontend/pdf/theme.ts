import { StyleSheet } from '@react-pdf/renderer'

export const COLORS = {
  ink: '#20242A',
  inkSoft: '#5A616B',
  asphalt: '#1B1F24',
  enamel: '#FBF9F3',
  cream: '#CFC9BA',
  line: '#D8D2C2',
  yellow: '#F2C200',
  green: '#1F7A4D',
  greenSoft: '#DFF0E6',
  red: '#C1272D',
  redSoft: '#F7E2E2',
  neutralSoft: '#ECE8DC',
}

export const styles = StyleSheet.create({
  page: {
    paddingBottom: 58,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: COLORS.ink,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: COLORS.asphalt,
    paddingHorizontal: 34,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.yellow,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brand: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: COLORS.yellow,
  },
  brandSub: {
    fontSize: 8,
    color: COLORS.cream,
    marginTop: 3,
  },
  stamp: {
    borderWidth: 1,
    borderColor: '#3A414A',
    paddingVertical: 6,
    paddingHorizontal: 9,
    alignItems: 'flex-end',
  },
  stampLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 6,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#A8A294',
  },
  stampValue: {
    fontSize: 8,
    color: COLORS.enamel,
    marginTop: 2,
  },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 22,
    color: COLORS.enamel,
    marginTop: 16,
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: 9.5,
    color: COLORS.cream,
    marginTop: 6,
  },
  match: {
    fontSize: 8,
    color: COLORS.cream,
    marginTop: 10,
  },
  matchValue: {
    fontFamily: 'Helvetica-Bold',
    color: COLORS.enamel,
  },
  body: {
    paddingHorizontal: 34,
    paddingTop: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    paddingBottom: 5,
    marginBottom: 9,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  sectionNote: {
    fontSize: 7,
    color: COLORS.inkSoft,
  },
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fact: {
    width: '50%',
    paddingRight: 14,
    marginBottom: 7,
  },
  factWide: {
    width: '100%',
  },
  factLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 6,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.inkSoft,
    marginBottom: 2,
  },
  factValue: {
    fontSize: 9,
  },
  empty: {
    fontSize: 8.5,
    color: COLORS.inkSoft,
    fontStyle: 'italic',
  },
  notice: {
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.neutralSoft,
    padding: 8,
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 8,
    lineHeight: 1.4,
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.6,
    borderBottomColor: COLORS.line,
    paddingVertical: 5,
  },
  tableHeadRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ink,
    paddingBottom: 4,
    marginBottom: 1,
  },
  tableHeadCell: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 6,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: COLORS.inkSoft,
  },
  tableCell: {
    fontSize: 8,
    paddingRight: 6,
  },
  tableStrong: {
    fontFamily: 'Helvetica-Bold',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    fontSize: 7.5,
    color: COLORS.inkSoft,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 34,
    right: 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.6,
    borderTopColor: COLORS.line,
    paddingTop: 6,
    fontSize: 6.8,
    color: COLORS.inkSoft,
  },
})

export type Cell =
  | string
  | { text: string; tone?: 'active' | 'pending' | 'neutral' }

export function toneStyle(tone?: 'active' | 'pending' | 'neutral') {
  if (tone === 'active') {
    return { color: COLORS.green, fontFamily: 'Helvetica-Bold' }
  }
  if (tone === 'pending') {
    return { color: COLORS.red, fontFamily: 'Helvetica-Bold' }
  }
  if (tone === 'neutral') {
    return { color: COLORS.inkSoft, fontFamily: 'Helvetica-Bold' }
  }
  return undefined
}
