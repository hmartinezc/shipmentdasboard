type IconName =
  | 'calculator'
  | 'fileContract'
  | 'fileInvoiceDollar'
  | 'box'
  | 'boxes'
  | 'chevronDown'
  | 'arrowUp'
  | 'arrowDown'
  | 'arrowLeft'
  | 'chevronLeft'
  | 'chevronRight'
  | 'checkCircle'
  | 'times'
  | 'exclamationCircle'
  | 'exclamationTriangle'
  | 'triangleExclamation'
  | 'circleExclamation'
  | 'user'
  | 'plane'
  | 'tag'
  | 'userTie'
  | 'calendar'
  | 'calendarWeek'
  | 'balanceScale'
  | 'exchangeAlt'
  | 'shieldAlt'
  | 'coins'
  | 'arrowTrendUp'
  | 'arrowTrendDown'
  | 'commission'
  | 'empty'
  | 'boxesStacked'
  | 'freightRates'
  | 'bothArrows'
  | 'paymentsMulti'
  | 'eye'
  | 'edit'
  | 'infoCircle'
  | 'moneyBillWave'
  | 'creditCard'
  | 'minusCircle'
  | 'percent'
  | 'chartPie'
  | 'chartLine'
  | 'trash'
  | 'dollarSign'
  | 'plus'
  | 'fileInvoice'
  | 'inbox'
  | 'timesCircle';

interface IconProps {
  name: IconName;
  className?: string;
}

const Icon = ({ name, className }: IconProps) => {
  // Forzar que todos los SVG se comporten como elementos en línea centrados
  const baseClass = className ? `${className} inline-block align-middle` : 'inline-block align-middle';
  switch (name) {
    case 'calculator':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 4v2h10V6H7zm0 4v8h10v-8H7zm2 1h2v2H9v-2zm0 3h2v2H9v-2zm4-3h2v2h-2v-2zm0 3h2v2h-2v-2z"/></svg>;
    case 'fileContract':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1 7V3.5L18.5 7H15zM8 13h8v2H8v-2zm0 4h8v2H8v-2zm0-8h5v2H8V9z"/></svg>
      );
    case 'fileInvoiceDollar':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm1 7V3.5L18.5 7H15zM12 18a3 3 0 01-3-3h2a1 1 0 101-1 3 3 0 113-3h-2a1 1 0 10-1 1 3 3 0 110 6z"/></svg>;
    case 'box':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M21 16V8a2 2 0 0 0-1.2-1.84l-6-2.67a2 2 0 0 0-1.6 0l-6 2.67A2 2 0 0 0 3 8v8a2 2 0 0 0 1.2 1.84l6 2.67a2 2 0 0 0 1.6 0l6-2.67A2 2 0 0 0 21 16zM12 4.76 18 7.5 12 10.24 6 7.5 12 4.76zM5 9.28l6 2.67v6.29l-6-2.67V9.28zM13 18.24v-6.29l6-2.67v6.29l-6 2.67z"/></svg>
      );
    case 'boxes':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M3 7l6-3 6 3-6 3-6-3zm0 6l6-3 6 3-6 3-6-3zm12-6l6-3 0 6-6 3 0-6zm0 9l6-3 0 6-6 3 0-6z"/></svg>
      );
    case 'chevronDown':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M6 9l6 6 6-6H6z"/></svg>;
    case 'arrowUp':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M12 4l6 6h-4v6h-4v-6H6l6-6z"/></svg>;
    case 'arrowDown':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M12 20l-6-6h4V8h4v6h4l-6 6z"/></svg>;
    case 'arrowLeft':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M14 7l-5 5 5 5V7z"/></svg>
      );
    case 'chevronLeft':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      );
    case 'chevronRight':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
      );
    case 'checkCircle':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 15-4-4 1.41-1.41L11 13.17l5.59-5.59L18 9l-7 8z"/></svg>
      );
    case 'times':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.7 2.88 18.3 9.18 12 2.88 5.71 4.29 4.29 10.59 10.6l6.3-6.3z"/></svg>
      );
    case 'exclamationCircle':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 14h-2v-2h2zm0-4h-2V7h2z"/></svg>;
    case 'exclamationTriangle':
    case 'triangleExclamation':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M12 4l10 16H2L12 4zm-1 6v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>;
    case 'circleExclamation':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 11h-2V7h2zm0 4h-2v-2h2z"/></svg>;
    case 'user':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.33 0-8 2.17-8 4v2h16v-2c0-1.83-3.67-4-8-4z"/></svg>
      );
    case 'plane':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9L2 14v2l8-2.5V19l-2 1.5V22l3-1 3 1v-1.5L13 19v-5.5z"/></svg>
      );
    case 'tag':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M20.59 13.41 11 3H4v7l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82zM6 8a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"/></svg>
      );
    case 'userTie':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12zm0 2c-3.87 0-7 1.79-7 4v2h14v-2c0-2.21-3.13-4-7-4zm1-6-1 2-1-2 1-1 1 1z"/></svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2zm14 8H3v10h18V10z"/></svg>
      );
    case 'calendarWeek':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14v11z"/></svg>
      );
    case 'balanceScale':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 3h2v2h4v2h-4v6h-2V7H8V5h4V3zM6 13l-3 5h6l-3-5zm12 0-3 5h6l-3-5z"/></svg>
      );
    case 'exchangeAlt':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3 7h13l-3-3 1.41-1.41L20.83 7l-6.42 4.41L13 10l3-3H3V7zm18 10H8l3 3-1.41 1.41L3.17 17l6.42-4.41L11 14l-3 3h13v-2z"/></svg>
      );
    case 'shieldAlt':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2l8 4v6c0 5-3.8 9.4-8 10-4.2-.6-8-5-8-10V6l8-4zm0 4.3L8 7.7v4.3c0 3.2 2.2 6.3 4 6.7 1.8-.4 4-3.5 4-6.7V7.7l-4-1.4z"/></svg>;
    case 'coins':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2C7 2 3 3.79 3 6s4 4 9 4 9-1.79 9-4-4-4-9-4zm0 8c-5 0-9-1.79-9-4v4c0 2.21 4 4 9 4s9-1.79 9-4V6c0 2.21-4 4-9 4zm-9 4v2c0 2.21 4 4 9 4s9-1.79 9-4v-2c0 2.21-4 4-9 4s-9-1.79-9-4z"/></svg>;
    case 'freightRates':
      // Icono exacto provisto por el usuario para Freight Rates by Weight
      return (
        <svg viewBox="0 0 640 512" fill="currentColor" className={baseClass}>
          <path d="M117.9 62.4c-16.8-5.6-25.8-23.7-20.2-40.5s23.7-25.8 40.5-20.2l113 37.7C265 15.8 290.7 0 320 0c44.2 0 80 35.8 80 80c0 3-.2 5.9-.5 8.8l122.6 40.9c16.8 5.6 25.8 23.7 20.2 40.5s-23.7 25.8-40.5 20.2L366.4 145.2c-4.5 3.2-9.3 5.9-14.4 8.2L352 480c0 17.7-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0 0-294.7c-21-9.2-37.2-27-44.2-49l-125.9-42zM200.4 288L128 163.8 55.6 288l144.9 0zM128 384C65.1 384 12.8 350 2 305.1c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C243.2 350 190.9 384 128 384zm382.8-92.2L438.4 416l144.9 0L510.8 291.8zm126 141.3C626 478 573.7 512 510.8 512s-115.2-34-126-78.9c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1z" />
        </svg>
      );
    case 'arrowTrendUp':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3 17l6-6 4 4 8-8v5h2V4h-8v2h5l-6 6-4-4-8 8z"/></svg>;
    case 'arrowTrendDown':
      // Exacto provisto por el usuario (tendencia a la baja)
      return (
        <svg viewBox="0 0 576 512" fill="currentColor" className={baseClass}>
          <path d="M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-160c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 82.7L342.6 137.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352 384 352z" />
        </svg>
      );
    case 'commission':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass}>
          <path d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-2.25 2.25a.75.75 0 0 1-1.06 0L11.5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM3 8v8h8.2a.75.75 0 0 1 .53.22l1.27 1.27 1.27-1.27a.75.75 0 0 1 .53-.22H21V8H3z" />
          <path d="M12 9.25c1.794 0 3.25 1.285 3.25 2.875h-1.7c0-.69-.69-1.25-1.55-1.25-.86 0-1.55.56-1.55 1.25 0 .69.69 1.25 1.55 1.25.47 0 .85.34.85.75 0 .41-.38.75-.85.75a3.25 3.25 0 1 1 0-6.5zm2 4.25h1.5l-2.5 2.5-2.5-2.5H12v-.75h2v.75z" />
        </svg>
      );
    case 'empty':
      // Empty state exacto provisto por el usuario (Font Awesome path)
      return (
        <svg viewBox="0 0 640 512" fill="currentColor" className={baseClass}>
          <path d="M58.9 42.1c3-6.1 9.6-9.6 16.3-8.7L320 64 564.8 33.4c6.7-.8 13.3 2.7 16.3 8.7l41.7 83.4c9 17.9-.6 39.6-19.8 45.1L439.6 217.3c-13.9 4-28.8-1.9-36.2-14.3L320 64 236.6 203c-7.4 12.4-22.3 18.3-36.2 14.3L37.1 170.6c-19.3-5.5-28.8-27.2-19.8-45.1L58.9 42.1zM321.1 128l54.9 91.4c14.9 24.8 44.6 36.6 72.5 28.6L576 211.6l0 167c0 22-15 41.2-36.4 46.6l-204.1 51c-10.2 2.6-20.9 2.6-31 0l-204.1-51C79 419.7 64 400.5 64 378.5l0-167L191.6 248c27.8 8 57.6-3.8 72.5-28.6L318.9 128l2.2 0z" />
        </svg>
      );
    case 'boxesStacked':
      // Icono de header provisto por el usuario
      return (
        <svg viewBox="0 0 576 512" fill="currentColor" className={baseClass}>
          <path d="M248 0L208 0c-26.5 0-48 21.5-48 48l0 112c0 35.3 28.7 64 64 64l128 0c35.3 0 64-28.7 64-64l0-112c0-26.5-21.5-48-48-48L328 0l0 80c0 8.8-7.2 16-16 16l-48 0c-8.8 0-16-7.2-16-16l0-80zM64 256c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l160 0c35.3 0 64-28.7 64-64l0-128c0-35.3-28.7-64-64-64l-40 0 0 80c0 8.8-7.2 16-16 16l-48 0c-8.8 0-16-7.2-16-16l0-80-40 0zM352 512l160 0c35.3 0 64-28.7 64-64l0-128c0-35.3-28.7-64-64-64l-40 0 0 80c0 8.8-7.2 16-16 16l-48 0c-8.8 0-16-7.2-16-16l0-80-40 0c-15 0-28.8 5.1-39.7 13.8c4.9 10.4 7.7 22 7.7 34.2l0 160c0 12.2-2.8 23.8-7.7 34.2C323.2 506.9 337 512 352 512z" />
        </svg>
      );
    case 'bothArrows':
      // Icono para Compra/Venta (both)
      return (
        <svg viewBox="0 0 512 512" fill="currentColor" className={baseClass}>
          <path d="M32 96l320 0 0-64c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l96 96c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-96 96c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-64L32 160c-17.7 0-32-14.3-32-32s14.3-32 32-32zM480 352c17.7 0 32 14.3 32 32s-14.3 32-32 32l-320 0 0 64c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-96-96c-6-6-9.4-14.1-9.4-22.6s3.4-16.6 9.4-22.6l96-96c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 64 320 0z" />
        </svg>
      );
    case 'paymentsMulti':
      // Icono para Pagos en vista múltiple
      return (
        <svg viewBox="0 0 576 512" fill="currentColor" className={baseClass}>
          <path d="M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-160c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 82.7L342.6 137.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352 384 352z" />
        </svg>
      );
    case 'eye':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>;
    case 'edit':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 00 0-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
    case 'infoCircle':
      // Font Awesome circle-info for clearer info symbol
      return (
        <svg viewBox="0 0 512 512" fill="currentColor" className={baseClass}>
          <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zM232 376V264c0-13.3 10.7-24 24-24s24 10.7 24 24V376c0 13.3-10.7 24-24 24s-24-10.7-24-24zm24-200c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z" />
        </svg>
      );
    case 'moneyBillWave':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M2 6c2 0 4-2 6-2s4 2 6 2 4-2 6-2v14c-2 0-4 2-6 2s-4-2-6-2-4 2-6 2V6zm8 3a3 3 0 100 6 3 3 0 000-6z"/></svg>;
    case 'creditCard':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zm0 4v8h18V9H3zm2 2h6v2H5v-2z"/></svg>;
    case 'minusCircle':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm5 11H7v-2h10v2z"/></svg>;
    case 'percent':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M17 7a3 3 0 11-3-3 3 3 0 013 3zM7 17a3 3 0 113-3 3 3 0 01-3 3zm11.07-11.07l-11 11-1.41-1.41 11-11 1.41 1.41z"/></svg>;
    case 'chartPie':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M11 2v20a10 10 0 110-20zm2 0a10 10 0 019.95 9H13V2z"/></svg>;
    case 'chartLine':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3 3h2v16h16v2H3V3zm16.59 5L15 12.59l-4-4-5.29 5.3 1.42 1.41L11 11.41l4 4 6-6-1.41-1.41z"/></svg>;
    case 'trash':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M6 7h12l-1 14H7L6 7zm5-4h2l1 2h5v2H5V5h5l1-2z"/></svg>;
    case 'dollarSign':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M11 2h2v2.09A7.001 7.001 0 0112 21a7 7 0 01-1-13.91V2zm1 6a5 5 0 100 10 5 5 0 000-10z"/></svg>;
    case 'plus':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>;
    case 'fileInvoice':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M14 2H6a2 2 0 00-2 2v16c0 1.1.9 2 2 2h12a2 2 0 002-2V8l-6-6zm1 7V3.5L18.5 7H15zM9 12h6v2H9v-2zm0 4h6v2H9v-2z"/></svg>;
    case 'inbox':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M4 4h16a2 2 0 012 2v8a6 6 0 01-6 6H10a6 6 0 01-6-6V6a2 2 0 012-2zm0 10a4 4 0 004 4h6a4 4 0 004-4V6H4v8zm5-4h6v2a2 2 0 11-4 0 2 2 0 01-2 2v-4z"/></svg>;
    case 'timesCircle':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm3.3 13.29L12 12l-3.29 3.29-1.42-1.42L10.59 10.6 7.29 7.29l1.42-1.42L12 9.18l3.29-3.31 1.42 1.42-3.31 3.31 3.31 3.29-1.42 1.41z"/></svg>;
    default:
      return null;
  }
};

export default Icon;
