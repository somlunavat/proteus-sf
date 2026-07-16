// Shared message types and payload shapes between background/content/sidepanel.
export const CLICKED_ELEMENTS_KEY = 'hoverHighlighterClickedElements'

export const MESSAGE_TYPES = {
  getClicked: 'get-clicked-elements',
  getAllClicked: 'get-all-clicked-elements',
  storeClicked: 'store-clicked-element',
  removeClicked: 'remove-clicked-element',
  removeClickedBulk: 'remove-clicked-elements-bulk',
  toggleClicked: 'toggle-clicked-element',
  getElementHtml: 'get-element-html',
  clearClicked: 'clear-clicked-elements',
  clearAllClicked: 'clear-all-clicked-elements',
  sidepanelOpen: 'sidepanel-open',
  sidepanelClose: 'sidepanel-close',
  getSidepanelState: 'get-sidepanel-state',
  highlightSelector: 'highlight-selector',
  unhighlightSelector: 'unhighlight-selector',
  clearHighlightsDom: 'clear-clicked-dom',
  clickedElementsUpdated: 'clicked-elements-updated',
  getPageContent: 'get-page-content',
  storeConsoleLog: 'store-console-log',
  getConsoleLogs: 'get-console-logs',
  clearConsoleLogs: 'clear-console-logs',
} as const

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES]

export type ClickedElementPayload = {
  tag: string
  id: string | null
  classes: string[]
  selector: string
  url: string
  timestamp: number
  tabTitle?: string
}

export type ClickedElementStored = ClickedElementPayload & {
  tabId: number
}

// The extension reloads on every dev-mode file change (or a production update),
// which severs chrome.runtime/chrome.storage for any content script already
// injected into an open tab. Those orphaned scripts only go away once the tab
// is refreshed, so calls from them must fail quietly instead of throwing.
const isInvalidatedContextError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  return (
    message.includes('Extension context invalidated') ||
    message.includes('Receiving end does not exist') ||
    message.includes('message channel closed')
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const safeSendMessage = async (message: unknown): Promise<any> => {
  if (!chrome.runtime?.id) return undefined
  try {
    return await chrome.runtime.sendMessage(message)
  } catch (error) {
    if (isInvalidatedContextError(error)) return undefined
    throw error
  }
}

export const safeStorageGet = async (
  keys: Parameters<typeof chrome.storage.local.get>[0],
): Promise<Record<string, unknown>> => {
  if (!chrome.runtime?.id) return {}
  try {
    return await chrome.storage.local.get(keys)
  } catch (error) {
    if (isInvalidatedContextError(error)) return {}
    throw error
  }
}

export const safeStorageSet = async (items: Record<string, unknown>): Promise<void> => {
  if (!chrome.runtime?.id) return
  try {
    await chrome.storage.local.set(items)
  } catch (error) {
    if (!isInvalidatedContextError(error)) throw error
  }
}
