import bowser from "bowser"

export const down = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}

export const time = (stamp) => new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
  dateStyle: "medium"
}).format(new Date(stamp))

export const ago = (stamp) => {
  if (!stamp) return "never"
  const diffs = (new Date(stamp) - new Date()) / 1000
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1]
  ]
  for (const [unit, seconds] of units) {
    if (Math.abs(diffs) >= seconds || unit === "second") return new Intl.RelativeTimeFormat("en", {
      numeric: "auto"
    }).format(Math.round(diffs / seconds), unit)
  }
}

export const guessDevice = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return
  const parser = bowser.getParser(window.navigator.userAgent)
  const br = parser.getBrowserName()
  const os = parser.getOSName()
  if (br && os) return `${br} on ${os}`
  return br || os || ""
}
