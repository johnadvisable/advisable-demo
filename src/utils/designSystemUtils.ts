// Design System Utilities to replace direct color usage

// Background utilities with semantic tokens
export const backgrounds = {
  primary: "bg-background",
  secondary: "bg-secondary",
  muted: "bg-muted",
  accent: "bg-accent",
  card: "bg-card",
  popover: "bg-popover",
  advisableBlue: "bg-advisable-blue",
  advisablePurple: "bg-advisable-purple",
  advisableDark: "bg-advisable-darkPurple",
  overlay: "bg-background/80",
  glass: "bg-background/50 backdrop-blur-sm",
} as const;

// Text color utilities with semantic tokens  
export const textColors = {
  primary: "text-foreground",
  secondary: "text-muted-foreground",
  accent: "text-accent-foreground",
  muted: "text-muted-foreground",
  card: "text-card-foreground",
  advisableBlue: "text-advisable-blue",
  advisablePurple: "text-advisable-purple",
  advisableDark: "text-advisable-darkPurple",
  onDark: "text-primary-foreground",
} as const;

// Border utilities with semantic tokens
export const borders = {
  default: "border-border",
  muted: "border-border/50",
  accent: "border-accent",
  advisableBlue: "border-advisable-blue",
  advisablePurple: "border-advisable-purple",
} as const;

// Shadow utilities
export const shadows = {
  sm: "shadow-sm",
  default: "shadow",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  none: "shadow-none",
} as const;

// Helper function to get design system classes
export const getDesignSystemClasses = (
  config: {
    bg?: keyof typeof backgrounds;
    text?: keyof typeof textColors;
    border?: keyof typeof borders;
    shadow?: keyof typeof shadows;
  }
) => {
  const classes = [];
  
  if (config.bg) classes.push(backgrounds[config.bg]);
  if (config.text) classes.push(textColors[config.text]);
  if (config.border) classes.push(borders[config.border]);
  if (config.shadow) classes.push(shadows[config.shadow]);
  
  return classes.join(' ');
};

// Common component patterns
export const componentPatterns = {
  card: getDesignSystemClasses({
    bg: "card",
    text: "card",
    border: "default",
    shadow: "sm",
  }),
  overlay: getDesignSystemClasses({
    bg: "overlay",
  }),
  glass: getDesignSystemClasses({
    bg: "glass",
  }),
  button: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    advisable: "bg-advisable-blue text-primary-foreground hover:bg-advisable-purple",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  },
} as const;