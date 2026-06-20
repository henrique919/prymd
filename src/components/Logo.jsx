// Tanqo mark: a water droplet with a tick inside — waterproofed and verified.
// Single-color (uses currentColor) so it sits on the teal bar in white.
export default function Logo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 3C16 3 6 13.5 6 20a10 10 0 0 0 20 0C26 13.5 16 3 16 3Z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M16 3C16 3 6 13.5 6 20a10 10 0 0 0 20 0C26 13.5 16 3 16 3Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M11.3 19.6l3.2 3.1 6-6.6"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
