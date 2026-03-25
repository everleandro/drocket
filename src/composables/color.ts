import { computed, unref, type MaybeRef } from 'vue'

import { getColorContrastCssValue, getColorCssValue } from '@/utils/style'

export interface UseResolvedColorOptions {
    color?: MaybeRef<string | undefined>
    inheritedColor?: MaybeRef<string | undefined>
    colorVar?: string
    contrastVar?: string
    fallbackContrast?: string
}

export const useResolvedColor = (options: UseResolvedColorOptions) => {
    const resolvedColor = computed(() => {
        const color = unref(options.color)?.trim()
        if (color) return color

        return unref(options.inheritedColor)?.trim() || undefined
    })

    const colorStyles = computed((): Record<string, string> => {
        const result: Record<string, string> = {}

        if (!resolvedColor.value) {
            return result
        }

        if (options.colorVar) {
            const colorValue = getColorCssValue(resolvedColor.value)

            if (colorValue) {
                result[options.colorVar] = colorValue
            }
        }

        if (options.contrastVar) {
            const contrastValue = getColorContrastCssValue(resolvedColor.value, {
                fallbackContrast: options.fallbackContrast,
            })

            if (contrastValue) {
                result[options.contrastVar] = contrastValue
            }
        }

        return result
    })

    return {
        resolvedColor,
        colorStyles,
    }
}