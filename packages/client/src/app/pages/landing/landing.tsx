import './landing.scss';
import QrCodeScan from '../../components/qr-code-scan/qr-code-scan';
import { useRef } from 'react';

export interface LandingPageProps {
  joinParty: (code: string) => void;
}

const LandingPage = ({ joinParty }: LandingPageProps) => <div className="landing-page">
  <h1 className="landing-page__title">Join Rustic Party</h1>
  <h2 className="landing-page__subtitle">Scan QR Code</h2>
  <QrCodeScan onScanCode={joinParty}/>
  <h2 className="landing-page__subtitle">or enter Party code yourself:</h2>
  <ManualCodeInput joinParty={joinParty}/>
</div>;

const ManualCodeInput = ({ joinParty }) => {
  const inputRef = useRef<HTMLInputElement>();

  return <form className="landing-page__join-form" onSubmitCapture={event => {
    event.preventDefault()
    joinParty(inputRef.current.value);
  }}>
    <input className="landing-page__input" ref={inputRef} />
    <button type="submit" className="landing-page__join-btn">Join</button>
  </form>;
}

export default LandingPage;
