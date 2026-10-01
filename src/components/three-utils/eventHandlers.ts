
export const createScrollHandler = (
  scrollYRef: React.MutableRefObject<number>
): () => void => {
  return () => {
    scrollYRef.current = window.scrollY;
  };
};
