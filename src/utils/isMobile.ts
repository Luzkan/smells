export const isMobile = (currentWidth: number | undefined): boolean => (currentWidth ? currentWidth < 768 : false)
