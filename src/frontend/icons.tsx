import type { ReactNode, SVGProps } from 'react'

export type IconName =
  | 'arrow'
  | 'alert'
  | 'car'
  | 'check'
  | 'clock'
  | 'download'
  | 'id'
  | 'receipt'
  | 'route'
  | 'search'
  | 'user'

const shapes: Record<IconName, ReactNode> = {
  arrow: (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 3.5 19.5h17z" />
      <path d="M12 9v4.5" />
      <circle cx="12" cy="16.8" r=".7" fill="currentColor" stroke="none" />
    </>
  ),
  car: (
    <>
      <path d="M3.5 13.2h17" />
      <path d="m5 13.2 1.5-4.1A2.2 2.2 0 0 1 8.6 7.6h6.8a2.2 2.2 0 0 1 2.1 1.5l1.5 4.1v3.6H5z" />
      <circle cx="7.8" cy="16.8" r="1.2" />
      <circle cx="16.2" cy="16.8" r="1.2" />
      <path d="M5 16.8v1.4M19 16.8v1.4" />
    </>
  ),
  check: <path d="m5 12.2 4.4 4.4L19 6.8" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.8v4.7l3 1.8" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v10.5" />
      <path d="m7 10.5 5 5 5-5" />
      <path d="M5 20h14" />
    </>
  ),
  id: (
    <>
      <rect x="3" y="5.8" width="18" height="12.4" rx="1.4" />
      <circle cx="8.8" cy="11.4" r="2.1" />
      <path d="M5.8 16.2c.4-1.6 1.5-2.4 3-2.4s2.6.8 3 2.4M14.4 10h4M14.4 14h4" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3.2h12v17.6l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8.2h6M9 12h6" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <path d="M8.2 6H13a3.2 3.2 0 0 1 0 6.4H9.8a3.2 3.2 0 0 0 0 6.4H16" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m20 20-3.8-3.8" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </>
  ),
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {shapes[name]}
    </svg>
  )
}
