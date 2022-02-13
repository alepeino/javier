import type { ThemeOverride } from '@chakra-ui/react'
import { extendTheme, theme as base } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    primary: base.colors.telegram,
  },
} as ThemeOverride)
