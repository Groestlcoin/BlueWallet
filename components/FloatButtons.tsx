import React, { forwardRef, ReactNode, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  useWindowDimensions,
  View,
  StyleProp,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './themes';
import { useIsLargeScreen } from '../hooks/useIsLargeScreen';
import { isDesktop } from '../blue_modules/environment';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LAYOUT = {
  PADDINGS: 30,
  ICON_MARGIN: 7,
  BUTTON_MARGIN: 10,
  MIN_BUTTON_WIDTH: 100,
  MIN_BUTTON_WIDTH_LARGE: 130,
  DRAWER_WIDTH: 320,
  BUTTON_HEIGHT: 52,
  CONTAINER_SIDE_MARGIN: 20,
  DEFAULT_BORDER_RADIUS: 8,
  MAX_BUTTON_FONT_SIZE: 24,
  SAFETY_MARGIN: 20,
  ANIMATION_DURATION: 300,
};

const useFloatButtonAnimation = (height: number) => {
  const slideAnimation = useRef(new Animated.Value(height)).current;
  const animatedButtonRadius = useRef(new Animated.Value(LAYOUT.DEFAULT_BORDER_RADIUS)).current;
  const animatedSingleButtonRadius = useRef(new Animated.Value(LAYOUT.BUTTON_HEIGHT / 2)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    slideAnimation.setValue(height);

    // Skip animation on desktop
    if (isDesktop) {
      slideAnimation.setValue(0);
      return;
    }

    Animated.spring(slideAnimation, {
      toValue: 0,
      useNativeDriver: true,
      speed: 100,
      bounciness: 3,
    }).start();
  }, [height, slideAnimation]);

  const configureLayoutAnimation = useCallback(() => {
    // Skip layout animation on desktop
    if (isDesktop) return;

    LayoutAnimation.configureNext({
      duration: LAYOUT.ANIMATION_DURATION,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
      },
      delete: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
    });
  }, []);

  const animateBorderRadius = useCallback(
    (buttonRadius: number, singleRadius: number, onComplete?: () => void) => {
      if (isDesktop) {
        // On desktop, apply values immediately without animation
        animatedButtonRadius.setValue(buttonRadius);
        animatedSingleButtonRadius.setValue(singleRadius);
        if (onComplete) onComplete();
        return;
      }

      setIsAnimating(true);

      Animated.parallel([
        Animated.timing(animatedButtonRadius, {
          toValue: buttonRadius,
          duration: LAYOUT.ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(animatedSingleButtonRadius, {
          toValue: singleRadius,
          duration: LAYOUT.ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false);
        if (onComplete) onComplete();
      });
    },
    [animatedButtonRadius, animatedSingleButtonRadius],
  );

  return {
    slideAnimation,
    animatedButtonRadius,
    animatedSingleButtonRadius,
    isAnimating: isDesktop ? false : isAnimating, // Never report animating state on desktop
    setIsAnimating,
    configureLayoutAnimation,
    animateBorderRadius,
  };
};

const useFloatButtonLayout = (width: number, isLargeScreen: boolean) => {
  const calculateButtonWidth = useCallback(
    (containerWidth: number, totalChildren: number): number => {
      if (containerWidth <= 0) return 0;

      const drawerOffset = isLargeScreen ? LAYOUT.DRAWER_WIDTH : 0;
      const availableWidth = width - drawerOffset - LAYOUT.CONTAINER_SIDE_MARGIN * 2;

      const contentWidth = Math.ceil(containerWidth);
      const buttonWidth = contentWidth + LAYOUT.PADDINGS * 2;
      const totalButtonWidth = buttonWidth * totalChildren;
      const totalSpacersWidth = (totalChildren - 1) * LAYOUT.BUTTON_MARGIN;
      const totalWidthNeeded = totalButtonWidth + totalSpacersWidth + LAYOUT.SAFETY_MARGIN;

      const effectiveMinButtonWidth = isLargeScreen ? LAYOUT.MIN_BUTTON_WIDTH_LARGE : LAYOUT.MIN_BUTTON_WIDTH;
      const shouldBeVertical = isLargeScreen && totalWidthNeeded > availableWidth && totalChildren > 1;

      let calculatedWidth;

      if (shouldBeVertical) {
        calculatedWidth = isLargeScreen ? availableWidth - LAYOUT.CONTAINER_SIDE_MARGIN * 2 : availableWidth;
      } else {
        if (totalWidthNeeded > availableWidth) {
          const availableWidthPerButton = (availableWidth - totalSpacersWidth) / totalChildren;
          calculatedWidth = Math.floor(availableWidthPerButton) - LAYOUT.PADDINGS * 2;
        } else {
          calculatedWidth = Math.max(contentWidth, effectiveMinButtonWidth);
        }
      }

      const effectiveMinWidth = isLargeScreen ? LAYOUT.MIN_BUTTON_WIDTH * 1.2 : LAYOUT.MIN_BUTTON_WIDTH;
      if (totalChildren === 1 && calculatedWidth < effectiveMinWidth - LAYOUT.PADDINGS * 2) {
        calculatedWidth = effectiveMinWidth - LAYOUT.PADDINGS * 2;
      }

      return Math.floor(calculatedWidth);
    },
    [width, isLargeScreen],
  );

  const calculateVisualParameters = useCallback(
    (calculatedWidth: number, totalChildren: number) => {
      const drawerOffset = isLargeScreen ? LAYOUT.DRAWER_WIDTH : 0;
      const availableWidth = width - drawerOffset - LAYOUT.CONTAINER_SIDE_MARGIN * 2;

      const buttonWidth = calculatedWidth + LAYOUT.PADDINGS * 2;
      const totalButtonWidth = buttonWidth * totalChildren;
      const totalSpacersWidth = (totalChildren - 1) * LAYOUT.BUTTON_MARGIN;
      const totalWidthNeeded = totalButtonWidth + totalSpacersWidth + LAYOUT.SAFETY_MARGIN;

      const shouldBeVertical = isLargeScreen && totalWidthNeeded > availableWidth && totalChildren > 1;

      const baseRadius = isLargeScreen
        ? Math.min(LAYOUT.BUTTON_HEIGHT / 2, calculatedWidth / 8)
        : Math.min(LAYOUT.BUTTON_HEIGHT / 2, calculatedWidth / 10);

      const buttonRadius = Math.max(LAYOUT.DEFAULT_BORDER_RADIUS, Math.floor(baseRadius));
      const singleButtonRadius = totalChildren === 1 ? LAYOUT.BUTTON_HEIGHT / 2 : buttonRadius;

      return { buttonRadius, singleButtonRadius, shouldBeVertical };
    },
    [width, isLargeScreen],
  );

  const calculateContainerHeight = useCallback((childrenCount: number, isVerticalLayout: boolean) => {
    if (!isVerticalLayout) return { height: '8%', minHeight: LAYOUT.BUTTON_HEIGHT };

    const totalButtonsHeight = childrenCount * LAYOUT.BUTTON_HEIGHT;
    const totalMarginsHeight = (childrenCount - 1) * LAYOUT.BUTTON_MARGIN;
    const calculatedHeight = totalButtonsHeight + totalMarginsHeight;

    return { height: calculatedHeight };
  }, []);

  const calculateButtonFontSize = useMemo(() => {
    const divisor = isLargeScreen ? 22 : 24;
    const baseSize = PixelRatio.roundToNearestPixel(width / divisor);
    return Math.min(LAYOUT.MAX_BUTTON_FONT_SIZE, baseSize);
  }, [width, isLargeScreen]);

  return {
    calculateButtonWidth,
    calculateVisualParameters,
    calculateContainerHeight,
    buttonFontSize: calculateButtonFontSize,
  };
};

const containerStyles = StyleSheet.create({
  root: {
    alignSelf: 'center',
    height: '8%',
    minHeight: LAYOUT.BUTTON_HEIGHT,
    marginHorizontal: LAYOUT.CONTAINER_SIDE_MARGIN,
  },
  rootAbsolute: {
    position: 'absolute',
  },
  rootInline: {},
  rootPre: {
    position: 'absolute',
    bottom: -1000,
  },
  rootPost: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  rootPostVertical: {
    flexDirection: 'column',
    overflow: 'hidden',
  },
  childWrapper: {
    width: '100%',
  },
});

const buttonStyles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    alignItems: 'center',
  },
  touchContainer: {
    width: '100%',
    height: '100%',
  },
});

const buttonContentStaticStyles = StyleSheet.create({
  root: {
    height: LAYOUT.BUTTON_HEIGHT,
    overflow: 'hidden',
  },
  marginRight: {
    marginRight: LAYOUT.BUTTON_MARGIN,
  },
  marginBottom: {
    marginBottom: LAYOUT.BUTTON_MARGIN,
  },
  textBase: {
    fontWeight: '600',
    marginLeft: LAYOUT.ICON_MARGIN,
    backgroundColor: 'transparent',
  },
});

const getButtonContentStyles = (colors: any, fontSize: number) => ({
  root: {
    ...buttonContentStaticStyles.root,
    backgroundColor: colors.buttonBackgroundColor,
  },
  text: {
    color: colors.buttonAlternativeTextColor,
    fontSize,
  },
  textDisabled: {
    color: colors.formBorder,
  },
  marginRight: buttonContentStaticStyles.marginRight,
  marginBottom: buttonContentStaticStyles.marginBottom,
  textBase: buttonContentStaticStyles.textBase,
});

interface FContainerProps {
  children: ReactNode | ReactNode[];
  inline?: boolean;
}

interface FButtonProps {
  text: string;
  icon: ReactNode;
  width?: number;
  first?: boolean;
  last?: boolean;
  singleChild?: boolean;
  isVertical?: boolean;
  borderRadius?: number | Animated.Value;
  fontSize?: number;
  isAnimating?: boolean;
  disabled?: boolean;
  testID?: string;
  onPress: () => void;
  onLongPress?: () => void;
}

interface ButtonContentProps {
  icon: ReactNode;
  text: string;
  textStyle: StyleProp<TextStyle>;
  iconStyle: StyleProp<any>;
}

interface OrientationCache {
  width: number;
  isVertical: boolean;
  buttonRadius: number;
  singleButtonRadius: number;
}

const ButtonContent = ({ icon, text, textStyle, iconStyle }: ButtonContentProps) => (
  <>
    <View style={iconStyle}>{icon}</View>
    <Text numberOfLines={1} adjustsFontSizeToFit style={textStyle}>
      {text}
    </Text>
  </>
);

export const FButton = ({
  text,
  icon,
  width,
  first,
  last,
  singleChild,
  isVertical,
  borderRadius = LAYOUT.DEFAULT_BORDER_RADIUS,
  fontSize = LAYOUT.MAX_BUTTON_FONT_SIZE,
  isAnimating = false,
  testID,
  ...props
}: FButtonProps) => {
  const { colors } = useTheme();

  const customButtonStyles = useMemo(() => getButtonContentStyles(colors, fontSize), [colors, fontSize]);

  const style: Record<string, any> = {};
  const additionalStyles = !last ? (isVertical ? customButtonStyles.marginBottom : customButtonStyles.marginRight) : {};

  if (width) {
    style.paddingHorizontal = LAYOUT.PADDINGS;
    style.width = isVertical ? '100%' : width + LAYOUT.PADDINGS * 2;
  }

  const textStyle = [customButtonStyles.textBase, props.disabled ? customButtonStyles.textDisabled : customButtonStyles.text];

  if (isAnimating && borderRadius instanceof Animated.Value) {
    return (
      <Animated.View style={[buttonStyles.root, customButtonStyles.root, style, additionalStyles, { borderRadius }]}>
        <TouchableOpacity
          accessibilityLabel={text}
          accessibilityRole="button"
          testID={testID}
          style={[buttonStyles.root, buttonStyles.touchContainer]}
          {...props}
        >
          <ButtonContent icon={icon} text={text} textStyle={textStyle} iconStyle={buttonStyles.icon} />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <TouchableOpacity
      accessibilityLabel={text}
      accessibilityRole="button"
      testID={testID}
      style={[
        buttonStyles.root,
        customButtonStyles.root,
        style,
        additionalStyles,
        { borderRadius: typeof borderRadius === 'number' ? borderRadius : LAYOUT.DEFAULT_BORDER_RADIUS },
      ]}
      {...props}
    >
      <ButtonContent icon={icon} text={text} textStyle={textStyle} iconStyle={buttonStyles.icon} />
    </TouchableOpacity>
  );
};

export const FContainer = forwardRef<View, FContainerProps>((props, ref) => {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const { isLargeScreen } = useIsLargeScreen();

  const [newWidth, setNewWidth] = useState<number | undefined>(undefined);
  const [isVertical, setIsVertical] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const [buttonBorderRadius, setButtonBorderRadius] = useState<number>(LAYOUT.DEFAULT_BORDER_RADIUS);
  const [singleButtonBorderRadius, setSingleButtonBorderRadius] = useState<number>(LAYOUT.BUTTON_HEIGHT / 2);

  const layoutWidth = useRef<number>(0);
  const layoutCalculated = useRef(false);
  const initialLayoutDone = useRef(false);
  const orientationKey = useRef<string>('');
  const calculationCache = useRef<Record<string, OrientationCache>>({});

  const bottomInsets = useMemo(
    () => ({
      bottom: insets.bottom ? insets.bottom + 10 : 30,
    }),
    [insets.bottom],
  );

  const { slideAnimation, animatedButtonRadius, animatedSingleButtonRadius, isAnimating, configureLayoutAnimation, animateBorderRadius } =
    useFloatButtonAnimation(height);

  const { calculateButtonWidth, calculateVisualParameters, calculateContainerHeight, buttonFontSize } = useFloatButtonLayout(
    width,
    isLargeScreen,
  );

  const getNormalizedOrientationKey = useCallback(() => {
    const isPortrait = height > width;
    const largerDim = Math.max(width, height);
    const smallerDim = Math.min(width, height);
    return `${largerDim}x${smallerDim}-${isPortrait ? 'portrait' : 'landscape'}-${isLargeScreen ? 'large' : 'small'}`;
  }, [width, height, isLargeScreen]);

  useEffect(() => {
    if (!layoutReady || layoutWidth.current <= 0) return;

    const normalizedKey = getNormalizedOrientationKey();
    const cachedCalculation = calculationCache.current[normalizedKey];

    if (width > 900 && Object.keys(calculationCache.current).length > 5) {
      calculationCache.current = {};
    }

    if (cachedCalculation) {
      if (cachedCalculation.isVertical !== isVertical || newWidth !== cachedCalculation.width) {
        // Only do layout animation on non-desktop
        if (!isDesktop) {
          configureLayoutAnimation();
        }

        setNewWidth(cachedCalculation.width);
        setIsVertical(cachedCalculation.isVertical);

        // Apply border radius changes (animation hook will handle desktop case)
        animateBorderRadius(cachedCalculation.buttonRadius, cachedCalculation.singleButtonRadius, () => {
          setButtonBorderRadius(cachedCalculation.buttonRadius);
          setSingleButtonBorderRadius(cachedCalculation.singleButtonRadius);
        });
      } else {
        setNewWidth(cachedCalculation.width);
        setIsVertical(cachedCalculation.isVertical);
        setButtonBorderRadius(cachedCalculation.buttonRadius);
        setSingleButtonBorderRadius(cachedCalculation.singleButtonRadius);
      }
    } else {
      const totalChildren = React.Children.toArray(props.children).filter(Boolean).length;

      const calculatedWidth = calculateButtonWidth(layoutWidth.current, totalChildren);
      const { buttonRadius, singleButtonRadius, shouldBeVertical } = calculateVisualParameters(calculatedWidth, totalChildren);

      if (shouldBeVertical !== isVertical || newWidth !== calculatedWidth) {
        // Only do layout animation on non-desktop
        if (!isDesktop) {
          configureLayoutAnimation();
        }

        setNewWidth(calculatedWidth);
        setIsVertical(shouldBeVertical);

        // Apply border radius changes (animation hook will handle desktop case)
        animateBorderRadius(buttonRadius, singleButtonRadius, () => {
          setButtonBorderRadius(buttonRadius);
          setSingleButtonBorderRadius(singleButtonRadius);
        });
      } else {
        setNewWidth(calculatedWidth);
        setIsVertical(shouldBeVertical);
        setButtonBorderRadius(buttonRadius);
        setSingleButtonBorderRadius(singleButtonRadius);
      }

      calculationCache.current[normalizedKey] = {
        width: calculatedWidth,
        isVertical: shouldBeVertical,
        buttonRadius,
        singleButtonRadius,
      };
    }

    layoutCalculated.current = true;
    if (!initialLayoutDone.current) {
      orientationKey.current = normalizedKey;
      initialLayoutDone.current = true;
    }
  }, [
    layoutReady,
    width,
    height,
    props.children,
    isLargeScreen,
    getNormalizedOrientationKey,
    calculateButtonWidth,
    calculateVisualParameters,
    configureLayoutAnimation,
    animateBorderRadius,
    isVertical,
    newWidth,
  ]);

  const onLayout = (event: { nativeEvent: { layout: { width: number } } }) => {
    const { width: currentLayoutWidth } = event.nativeEvent.layout;

    if (currentLayoutWidth > 0) {
      if (Math.abs(layoutWidth.current - currentLayoutWidth) > 2) {
        layoutWidth.current = currentLayoutWidth;
        layoutCalculated.current = false;
      }

      if (!layoutReady) {
        setLayoutReady(true);
      }
    }
  };

  const renderChild = (child: ReactNode, index: number, array: ReactNode[]): ReactNode => {
    if (typeof child === 'string') {
      return (
        <View key={index} style={[containerStyles.childWrapper, { width: newWidth }]}>
          <Text adjustsFontSizeToFit numberOfLines={1}>
            {child}
          </Text>
        </View>
      );
    }

    const isSingleChild = array.length === 1;
    const borderRadiusToUse = isSingleChild
      ? isAnimating
        ? animatedSingleButtonRadius
        : singleButtonBorderRadius
      : isAnimating
        ? animatedButtonRadius
        : buttonBorderRadius;

    return React.cloneElement(child as React.ReactElement<any>, {
      width: newWidth,
      key: index,
      first: index === 0,
      last: index === array.length - 1,
      singleChild: isSingleChild,
      isVertical,
      borderRadius: borderRadiusToUse,
      fontSize: buttonFontSize,
      isAnimating,
    });
  };

  const totalChildren = React.Children.toArray(props.children).filter(Boolean).length;
  const containerHeight = useMemo(
    () => calculateContainerHeight(totalChildren, isVertical),
    [calculateContainerHeight, totalChildren, isVertical],
  );

  const dynamicRoundStyle = useMemo(() => {
    if (totalChildren === 1) {
      return {
        borderRadius: isAnimating ? animatedSingleButtonRadius : singleButtonBorderRadius,
        overflow: 'hidden',
      };
    }
    return null;
  }, [totalChildren, singleButtonBorderRadius, isAnimating, animatedSingleButtonRadius]);

  const combinedStyles = useMemo(
    () => [
      containerStyles.root,
      props.inline ? containerStyles.rootInline : containerStyles.rootAbsolute,
      bottomInsets,
      newWidth ? (isVertical ? containerStyles.rootPostVertical : containerStyles.rootPost) : containerStyles.rootPre,
      dynamicRoundStyle,
      isVertical ? containerHeight : null,
      { transform: [{ translateY: slideAnimation }] },
    ],
    [props.inline, bottomInsets, newWidth, isVertical, dynamicRoundStyle, containerHeight, slideAnimation],
  );

  return (
    <Animated.View ref={ref} onLayout={onLayout} style={combinedStyles}>
      {newWidth && layoutReady ? React.Children.toArray(props.children).filter(Boolean).map(renderChild) : props.children}
    </Animated.View>
  );
});
