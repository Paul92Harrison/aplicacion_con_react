// Icono de un filete con hueso, hecho en SVG para que escale sin perder calidad
function IconoFilete({ tamano = 32 }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M9 30C7 18 19 9 33 9c14 0 24 8 23 21-1 14-13 25-28 24C16 53 11 42 9 30z"
        fill="#a8293d"
      />
      <path
        d="M17 24c6-6 15-8 23-5M14 36c5 4 12 5 18 3"
        fill="none"
        stroke="#f2d7dc"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="40" cy="33" r="7" fill="#f4ece4" />
      <circle cx="40" cy="33" r="3" fill="#d9c7b8" />
    </svg>
  );
}

export default IconoFilete;
