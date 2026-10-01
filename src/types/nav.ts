
export interface NavItem {
  titleKey: string;
  href: string;
  submenu?: NavSubmenuItem[];
}

export interface NavSubmenuItem {
  titleKey: string;
  descriptionKey?: string;
  href: string;
  submenu?: NavSubmenuItem[];
}
