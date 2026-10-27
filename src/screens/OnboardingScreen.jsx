import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  BackHandler,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMAGES } from '../assets';
import { PrimaryButton, F } from '../components/AuthControls';
import OnboardingDots from '../components/OnboardingDots';

/**
 * 4 intro slides (Figma: Enter Location / Find Property / Make Offer / Take key).
 * The Welcome screen is dot 1 of 5, these slides are dots 2..5.
 *
 * Positions are measured from the bottom of the pager (= top of the dots, Figma y 666):
 *   illustration bottom = Figma y 363  -> 303 above the pager bottom
 *   text block top      = Figma y 392.5 -> 273.5 above the pager bottom
 */
const SLIDES = [
  {
    key: 'location',
    image: IMAGES.onboardLocation,
    imgW: 191,
    imgH: 186,
    shiftX: 0,
    title: 'Enter Location',
    text: 'It’s the age-old question: are you a beach person or are you a mountain person? We have listings from coast to coast.',
    textH: 165,
    textWeight: 'regular',
  },
  {
    key: 'property',
    image: IMAGES.onboardProperty,
    imgW: 194,
    imgH: 180,
    shiftX: 2.5,
    title: 'Find Property',
    text: 'Once you’ve decided, browse through our growing inventory of homes to find the one that’s right for you.',
    textH: 141,
    textWeight: 'regular',
  },
  {
    key: 'offer',
    image: IMAGES.onboardOffer,
    imgW: 213,
    imgH: 186,
    shiftX: 0,
    title: 'Make Offer',
    text: 'Found the one you like? Glance through other offers and place yours.',
    textH: 117,
    textWeight: 'regular',
  },
  {
    key: 'key',
    image: IMAGES.onboardKey,
    imgW: 213,
    imgH: 186,
    shiftX: 0,
    title: 'Take key',
    text: 'Hooray! It’s time to furniture shop, decorate, and cozy on in.',
    textH: 117,
    textWeight: 'medium',
  },
];

const Slide = ({ slide, width, height }) => (
  <View style={{ width, height }}>
    <Image
      source={slide.image}
      resizeMode="contain"
      style={{
        position: 'absolute',
        bottom: 303,
        alignSelf: 'center',
        width: slide.imgW,
        height: slide.imgH,
        transform: [{ translateX: slide.shiftX }],
      }}
    />

    <View style={[styles.textBlock, { bottom: 273.5 - slide.textH, height: slide.textH }]}>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={[styles.desc, slide.textWeight === 'medium' && { fontFamily: F.medium }]}>
        {slide.text}
      </Text>
    </View>
  </View>
);

const OnboardingScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const scrollRef = useRef(null);
  const [pagerH, setPagerH] = useState(0);
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);

  const goTo = (index, animated = true) => {
    pageRef.current = index;
    setPage(index);
    scrollRef.current?.scrollTo({ x: index * width, animated });
  };

  const handleNext = () => {
    if (page < SLIDES.length - 1) {
      goTo(page + 1);
    } else {
      navigation.replace('SignInScreen');
    }
  };

  // Android back button goes one slide back first
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (pageRef.current > 0) {
        goTo(pageRef.current - 1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const handleScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== pageRef.current) {
      pageRef.current = index;
      setPage(index);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.pager} onLayout={(e) => setPagerH(e.nativeEvent.layout.height)}>
        {pagerH > 0 && (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
          >
            {SLIDES.map((s) => (
              <Slide key={s.key} slide={s} width={width} height={pagerH} />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Figma y 666: 5 dots, the Welcome screen is the first one */}
      <OnboardingDots count={5} active={page + 1} style={styles.dots} />

      {/* Figma y 705, 345 x 56 */}
      <View style={styles.bottom}>
        <PrimaryButton label="Get Started" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  pager: { flex: 1 },
  textBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    width: 264,
    fontFamily: F.semi,
    fontSize: 24,
    lineHeight: 39,
    color: '#000000',
    textAlign: 'center',
    includeFontPadding: false,
  },
  desc: {
    marginTop: 6,
    width: 264,
    fontFamily: F.regular,
    fontSize: 18,
    lineHeight: 24,
    color: '#404040',
    textAlign: 'center',
    includeFontPadding: false,
  },
  dots: { marginBottom: 30 },
  bottom: { paddingHorizontal: 15, paddingBottom: 51 },
});

export default OnboardingScreen;
