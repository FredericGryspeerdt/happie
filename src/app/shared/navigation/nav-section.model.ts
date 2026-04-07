export interface NavSection {
  id: 'home' | 'shopping' | 'tasks';
  label: string;
  icon: string;
  route: string;
}

export const NAV_SECTIONS: readonly NavSection[] = [
  { id: 'home', label: 'Home', icon: 'home', route: '/home' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping_cart', route: '/shopping' },
  { id: 'tasks', label: 'Tasks', icon: 'check_box', route: '/tasks' },
] as const;
