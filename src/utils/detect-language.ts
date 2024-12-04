import { franc } from 'franc-min'

/**
 * Detect the language of a given text.
 * @param text The input text to detect language for.
 * @returns ISO 639-3 language code (e.g., "cmn" for Mandarin Chinese).
 */
const detectLanguage = (text: string): string => {
  const normalizedText = text
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '') // Remove diacritics
    .replace(/[^\d\sA-Za-z\u4E00-\u9FA5]/g, '') // Keep alphanumeric and CJK characters
    .trim()

  if (normalizedText.length <= 5) {
    if (/[\u4E00-\u9FA5]/.test(normalizedText)) {
      return 'cmn'
    }
    return 'und'
  }

  return franc(normalizedText)
}

export default detectLanguage
