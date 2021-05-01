import './qr-code-scan.scss';
import { useState, Suspense, lazy } from 'react';

export interface QrCodeScanProps {
  onScanCode: (code: string) => void;
}

const LazyQrReader = lazy(() => import('react-qr-reader'));

const QrCodeScan = ({ onScanCode }: QrCodeScanProps) => {
  const [hasCameraAccess, setHasCameraAccess] = useState(false);

  if (hasCameraAccess) {
    return <div className="qr-code-scan">
      <Suspense fallback={<div></div>}>
        <LazyQrReader className="qr-code-scan__reader" onScan={data => onScanCode(data)} onError={() => {}} showViewFinder={true}/>
      </Suspense>
    </div>
  }else {
    return <button className={"qr-code-scan qr-code-scan--inactive"} onClick={() => setHasCameraAccess(true)}>
      <span>Tap here to allow access to your camera</span>
    </button>;
  }
};

export default QrCodeScan;
