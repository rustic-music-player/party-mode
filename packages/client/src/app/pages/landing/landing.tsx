import './landing.scss';
import QrCodeScan from '../../components/qr-code-scan/qr-code-scan';

export interface LandingPageProps {
  joinParty: (code: string) => void;
}

const LandingPage = ({ joinParty }: LandingPageProps) => <div className="landing-page">
  <h1 className="landing-page__title">Join Rustic Party</h1>
  <h2 className="landing-page__subtitle">Scan QR Code</h2>
  <QrCodeScan onScanCode={joinParty}/>
  <h2 className="landing-page__subtitle">or enter Party code yourself:</h2>
  <ManualCodeInput/>
</div>;

const ManualCodeInput = ({}) => <form className="landing-page__join-form">
  <input className="landing-page__input"/>
  <button type="submit" className="landing-page__join-btn">Join</button>
</form>

export default LandingPage;
