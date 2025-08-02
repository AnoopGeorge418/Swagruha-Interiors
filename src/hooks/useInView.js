import { useRef, useState, useEffect } from 'react';

/* ONE IntersectionObserver instance for the whole app */
const sharedObserver =
  typeof window !== 'undefined'
    ? new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.__onVisible) {
              entry.target.__onVisible();
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      )
    : null;

/* Hook */
export const useInView = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || !sharedObserver) return;

    const el = ref.current;
    el.__onVisible = () => setVisible(true);
    sharedObserver.observe(el);

    return () => {
      sharedObserver.unobserve(el);
      delete el.__onVisible;
    };
  }, []);

  return [ref, visible];
};
