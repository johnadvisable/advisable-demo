
import Header from './Header';

// This is a wrapper to extend Header functionality without modifying the original component
const HeaderWrapper = () => {
  // The original Header component is read-only, but we can still use it
  // Just adding this file so it's clear we need to add the menu link to the Header
  return <Header />;
};

export default HeaderWrapper;
