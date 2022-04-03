import Typography from "typography"
import { gitHubTheme } from "typography-theme-github"

const typography = new Typography(gitHubTheme)

if (process.env.NODE_ENV !== `production`) typography.injectStyles()

export const { scale, rhythm, options } = typography
export default typography
