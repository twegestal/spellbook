import { createRoot } from 'react-dom/client';
import DamageExplosion, {
  type DamageExplosionProps,
  type DamageType,
} from './DamageExplosion';

export function spawnDamageBlast(
  type: DamageType,
  opts?: Partial<Omit<DamageExplosionProps, 'type'>>
) {
  if (typeof window === 'undefined') return;
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  const handleDone = () => {
    root.unmount();
    host.remove();
  };

  root.render(
    <DamageExplosion
      type={type}
      fullscreen
      size={520}
      duration={type === 'thunder' ? 900 : type === 'lightning' ? 1100 : 1300}
      particles={
        type === 'force'
          ? 260
          : type === 'lightning'
          ? 320
          : type === 'thunder'
          ? 300
          : 480
      }
      onComplete={handleDone}
      {...opts}
    />
  );
}
