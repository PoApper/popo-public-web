import theme from './theme';

type PopoTheme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends PopoTheme {}
}
