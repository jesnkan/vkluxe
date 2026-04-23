import React, { useState, useCallback, useRef } from 'react';
import { useMotionValue, useTransform, PanInfo } from 'motion/react';

interface SwipeConfig {
  threshold?: number;
  velocity?: number;
}

interface UseSwipeProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  config?: SwipeConfig;
}

export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  config = { threshold: 100, velocity: 0.5 }
}: UseSwipeProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const { threshold = 100, velocity: minVelocity = 0.5 } = config;

    // Check if swipe was fast enough or far enough
    const isValidSwipe = Math.abs(offset.x) > threshold || Math.abs(velocity.x) > minVelocity;

    if (isValidSwipe) {
      if (offset.x > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (offset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    // Vertical swipes
    if (Math.abs(offset.y) > threshold) {
      if (offset.y > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (offset.y < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, config]);

  return { x, y, handleDragEnd };
};

// Long press hook
interface UseLongPressProps {
  onLongPress: () => void;
  onClick?: () => void;
  duration?: number;
}

export const useLongPress = ({
  onLongPress,
  onClick,
  duration = 500
}: UseLongPressProps) => {
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const startPress = useCallback(() => {
    setIsPressing(true);
    isLongPressRef.current = false;

    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress();
      setIsPressing(false);
    }, duration);
  }, [onLongPress, duration]);

  const endPress = useCallback(() => {
    setIsPressing(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // If it wasn't a long press, treat as click
    if (!isLongPressRef.current && onClick) {
      onClick();
    }
  }, [onClick]);

  const cancelPress = useCallback(() => {
    setIsPressing(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    isPressing,
    handlers: {
      onMouseDown: startPress,
      onMouseUp: endPress,
      onMouseLeave: cancelPress,
      onTouchStart: startPress,
      onTouchEnd: endPress,
      onTouchCancel: cancelPress,
    }
  };
};

// Pull to refresh hook
interface UsePullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 100
}: UsePullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only enable pull when at top of page
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPullingRef.current) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    // Only pull down, not up
    if (diff > 0) {
      // Add resistance to pull
      const resistance = 0.5;
      setPullDistance(diff * resistance);
    }
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (!isPullingRef.current) return;

    isPullingRef.current = false;

    if (pullDistance > threshold) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }

    setPullDistance(0);
  }, [pullDistance, threshold, onRefresh]);

  return {
    isRefreshing,
    pullDistance,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }
  };
};

// Double tap hook
interface UseDoubleTapProps {
  onDoubleTap: () => void;
  onSingleTap?: () => void;
  delay?: number;
}

export const useDoubleTap = ({
  onDoubleTap,
  onSingleTap,
  delay = 300
}: UseDoubleTapProps) => {
  const [lastTap, setLastTap] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - lastTap;

    if (timeDiff < delay && lastTap !== 0) {
      // Double tap detected
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      onDoubleTap();
      setLastTap(0);
    } else {
      // Single tap - wait to see if it's a double tap
      setLastTap(now);

      if (onSingleTap) {
        timerRef.current = setTimeout(() => {
          onSingleTap();
          setLastTap(0);
        }, delay);
      }
    }
  }, [lastTap, delay, onDoubleTap, onSingleTap]);

  return handleTap;
};
