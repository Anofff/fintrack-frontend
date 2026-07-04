import { Link } from 'react-router-dom';

interface LandingLogoProps {
  className?: string;
}

export function LandingLogo({ className = '' }: LandingLogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-sm">₵</span>
      </div>
      <span className="text-h3 font-semibold text-primary tracking-tight">FinTrack₵</span>
    </Link>
  );
}
