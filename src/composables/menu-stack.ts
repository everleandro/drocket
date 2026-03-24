type MenuStackEntry = {
    id: string
    activator: HTMLElement | null
    content: HTMLElement | null
    close: () => void
}

const STACK_BASE_Z_INDEX = 2000
const entries: MenuStackEntry[] = []

const isDescendantBranch = (ancestorId: string, candidateId: string): boolean => {
    return candidateId === ancestorId || candidateId.startsWith(`${ancestorId}--child`)
}

const isTargetWithinElement = (target: Node | null, element: HTMLElement | null): boolean => {
    return Boolean(target && element && (element === target || element.contains(target)))
}

const isTargetWithinBranch = (target: Node | null, menuId: string): boolean => {
    return entries.some((entry) => {
        if (!isDescendantBranch(menuId, entry.id)) return false

        return isTargetWithinElement(target, entry.content) || isTargetWithinElement(target, entry.activator)
    })
}

const closeMenusOutsideTarget = (target: Node | null): void => {
    const entriesToClose = [...entries]
        .filter((entry) => !isTargetWithinBranch(target, entry.id))
        .sort((left, right) => right.id.length - left.id.length)

    entriesToClose.forEach((entry) => entry.close())
}

const handlePointerDown = (event: PointerEvent): void => {
    closeMenusOutsideTarget(event.target as Node | null)
}

const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return

    const topEntry = entries.at(-1)
    if (!topEntry) return

    event.preventDefault()
    topEntry.close()
}

const syncListeners = (): void => {
    if (typeof document === 'undefined') return

    document.removeEventListener('pointerdown', handlePointerDown, true)
    document.removeEventListener('keydown', handleKeydown, true)

    if (!entries.length) return

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeydown, true)
}

const upsertEntry = (nextEntry: MenuStackEntry): void => {
    const currentIndex = entries.findIndex((entry) => entry.id === nextEntry.id)

    if (currentIndex >= 0) {
        entries.splice(currentIndex, 1)
    }

    entries.push(nextEntry)
    syncListeners()
}

const removeEntry = (menuId: string): void => {
    const currentIndex = entries.findIndex((entry) => entry.id === menuId)

    if (currentIndex >= 0) {
        entries.splice(currentIndex, 1)
    }

    syncListeners()
}

const getMenuZIndex = (menuId: string): number | null => {
    const currentIndex = entries.findIndex((entry) => entry.id === menuId)

    if (currentIndex < 0) return null

    return STACK_BASE_Z_INDEX + (currentIndex * 2) + 1
}

export const useMenuStack = () => {
    return {
        registerMenu: upsertEntry,
        unregisterMenu: removeEntry,
        getMenuZIndex,
    }
}

export default useMenuStack