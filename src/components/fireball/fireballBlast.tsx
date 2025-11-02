import { createRoot } from 'react-dom/client';
import FireballExplosion, { type FireballProps } from './fireball';

export function fireballBlast(opts?: Partial<FireballProps>) {
  if (typeof window === 'undefined') return;
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);

  const handleDone = () => {
    root.unmount();
    host.remove();
  };

  root.render(
    <FireballExplosion
      fullscreen
      size={520}
      duration={1600}
      particles={520}
      onComplete={handleDone}
      {...opts}
    />
  );
}
