import { Sparkles } from "lucide-react";

interface SparkleIconProps {
  className?: string;
  size?: number;
}

const SparkleIcon = ({ className = "", size = 16 }: SparkleIconProps) => {
  return (
    <Sparkles
      size={size}
      className={`text-primary animate-sparkle-pulse ${className}`}
    />
  );
};

export default SparkleIcon;
