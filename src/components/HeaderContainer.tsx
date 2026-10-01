// Performance-optimized header component
import { memo } from 'react';
import Header, { HeaderProps } from './Header';

// Memoize Header to prevent unnecessary re-renders
const HeaderContainer = memo((props: HeaderProps) => {
  return <Header {...props} />;
});

HeaderContainer.displayName = 'HeaderContainer';

export default HeaderContainer;