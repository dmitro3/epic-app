import { EMOJI_COUNT_REGEX } from '@/constants/regex'
import truncate from 'lodash.truncate'

export function truncateText(text: string, length: number) {
  return truncate(text, { length })
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

const EMOJI_REGEX =
  /(?![*#0-9]+)[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]/gu
export function validateTextContainsOnlyEmoji(text: string) {
  const isOnlyEmoji = text.replace(EMOJI_REGEX, '').trim().length === 0
  return isOnlyEmoji
}
export function getEmojiAmount(text: string) {
  // Firefox and IE doesn't support Segmenter
  if (!Intl.Segmenter) {
    return text.match(EMOJI_COUNT_REGEX)?.length ?? 0
  }
  return [...new Intl.Segmenter().segment(text)].length
}

export function removeDoubleSpaces(str: string) {
  const multipleSpacesRegex = /\s\s+/g
  return str.replace(multipleSpacesRegex, ' ').trim()
}

export function validateNumber(str: string) {
  return !isNaN(parseInt(str))
}

export function validateEmail(str: string) {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
  return emailRegex.test(str)
}

export function getUrlFromText(str: string) {
  const urlRegex =
    /((http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-]))/
  return urlRegex.exec(str)?.[0]
}

export const TAGS_REGEX = /#[a-zA-Z0-9_]+/g

function formatNumberToPrecision(number: number) {
  const str = number.toFixed(2)
  const [prefix, postfix] = str.split('.')
  return Number(postfix) > 0 ? str.replace(/0$/, '') : prefix
}

export function formatNumber(
  num: number | string,
  config?: { shorten?: boolean }
) {
  const { shorten } = config || {}
  let [prefix, postfix] = num.toString().split('.')

  if (shorten) {
    if (prefix.length > 9) {
      return `${formatNumberToPrecision(Number(prefix) / 1_000_000_000)}B`
    }
    if (prefix.length > 6) {
      return `${formatNumberToPrecision(Number(prefix) / 1_000_000)}M`
    }
    if (prefix.length > 3) {
      return `${formatNumberToPrecision(Number(prefix) / 1_000)}K`
    }
  }

  if (prefix.length < 4) {
    return prefix
  }
  const string = prefix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (postfix && prefix.length < 4) {
    return `${string}.${postfix}`
  }
  return string
}

export function parseJSONData<T>(data: string | null) {
  if (!data) return undefined
  try {
    return JSON.parse(data) as T
  } catch (err) {
    return undefined
  }
}

export function convertToBigInt(num: number | string) {
  try {
    return BigInt(num)
  } catch {
    return BigInt(0)
  }
}
