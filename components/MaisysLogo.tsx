// Affiche le logo MAISYS (icône fournie en public/Logo-Maisys.png)
export default function MaisysLogo({ size = 48 }: { size?: number }) {
  return (
    <img
      src="/favicon.ico"
      alt="MAiSYS Logo"
      width={size}
      height={size}
      style={{ borderRadius: 16, background: 'transparent' }}
    />
  );
}
