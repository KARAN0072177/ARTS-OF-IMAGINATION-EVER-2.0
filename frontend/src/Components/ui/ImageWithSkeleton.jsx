import React, { useState, useEffect } from "react";

const ImageWithSkeleton = ({
  src,
  alt,
  className = "",
  imgClassName = "",
  onClick,
  onError,
  shimmerType = "dark",
  loading = "lazy",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Reset loading state if src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  // Determine which shimmer class to use
  let shimmerClass = "animate-shimmer";
  if (shimmerType === "gold") {
    shimmerClass = "animate-shimmer-gold";
  } else if (shimmerType === "purple") {
    shimmerClass = "animate-shimmer-purple";
  }

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    setError(true);
    if (onError) {
      onError(e);
    }
  };

  return (
    <div 
      className={`relative overflow-hidden bg-slate-950/40 min-h-[140px] ${className}`} 
      onClick={onClick}
      {...props}
    >
      {/* Shimmer skeleton as absolute overlay */}
      {!isLoaded && !error && (
        <div className={`absolute inset-0 z-10 w-full h-full ${shimmerClass}`} />
      )}
      
      {error ? (
        <div className="flex flex-col items-center justify-center bg-slate-900 text-slate-500 py-12 px-4 text-center min-h-[150px]">
          <span className="text-2xl mb-1">⚠️</span>
          <span className="text-xs">Failed to load</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-500 ease-in-out ${imgClassName} ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

export default ImageWithSkeleton;
