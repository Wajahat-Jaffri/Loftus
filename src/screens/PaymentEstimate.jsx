import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, TouchableOpacity } from 'react-native';

const ORANGE = '#FF6C40';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const LOAN_TERMS = [10, 15, 20, 30];
const RATE_MIN = 2;
const RATE_MAX = 8;
const RATE_STEP = 0.25;

// Monthly costs other than principal & interest (colors from the Figma legend).
const FIXED_COSTS = [
  { key: 'hoa', label: 'HOA Dues', amount: 100, color: '#F5A623' },
  { key: 'condo', label: 'Condo Dues', amount: 150, color: '#E056FD' },
  { key: 'tax', label: 'Property Taxes', amount: 83, color: '#50E3C2' },
  { key: 'ins', label: 'Homeowner\u2019s Insurance', amount: 69, color: '#FF5C5C' },
  { key: 'pmi', label: 'Mortgage Insurance', amount: 43, color: '#7ED321' },
];
const PI_COLOR = '#4A90E2';

const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// Standard fixed-rate mortgage payment.
const monthlyPrincipalInterest = (loan, ratePercent, years) => {
  const n = years * 12;
  const r = ratePercent / 100 / 12;
  if (r === 0) return loan / n;
  return (loan * r) / (1 - Math.pow(1 + r, -n));
};

/* ------------------------------------------------------------------ */
/* Donut chart built from plain Views (no extra library needed).       */
/* ------------------------------------------------------------------ */
const BAR_COUNT = 144;
const START_ANGLE = -80;

const Donut = ({ segments, size = 200, thickness = 18, children }) => {
  const bars = useMemo(() => {
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    const counts = segments.map((seg) =>
      Math.max(Math.round((seg.value / total) * BAR_COUNT), 2)
    );
    const countSum = counts.reduce((a, b) => a + b, 0);
    const step = 360 / countSum;
    const barWidth = Math.ceil((Math.PI * size) / countSum) + 1;

    const out = [];
    let cursor = 0;
    segments.forEach((seg, si) => {
      // The first bar of every segment is left empty -> thin gap between colors.
      for (let k = 1; k < counts[si]; k += 1) {
        out.push({
          key: `${si}-${k}`,
          angle: START_ANGLE + (cursor + k) * step,
          color: seg.color,
          width: barWidth,
        });
      }
      cursor += counts[si];
    });
    return out;
  }, [segments, size]);

  return (
    <View style={{ width: size, height: size }}>
      {bars.map((b) => (
        <View
          key={b.key}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: size,
            height: size,
            transform: [{ rotate: `${b.angle}deg` }],
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: size / 2 - b.width / 2,
              top: 0,
              width: b.width,
              height: thickness,
              backgroundColor: b.color,
            }}
          />
        </View>
      ))}
      <View style={styles.donutCenter} pointerEvents="none">
        {children}
      </View>
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Single-thumb slider (interest rate)                                 */
/* ------------------------------------------------------------------ */
const THUMB = 21;
const TRACK_H = 12;

const SingleSlider = ({ min, max, value, step, onChange, onInteract }) => {
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const startValueRef = useRef(value);
  const latest = useRef({});
  latest.current = { min, max, value, step, onChange, onInteract };

  const usable = Math.max(width - THUMB, 1);
  const pos = ((value - min) / (max - min)) * usable;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        startValueRef.current = latest.current.value;
        latest.current.onInteract?.(true);
      },
      onPanResponderMove: (_, g) => {
        const l = latest.current;
        const span = Math.max(widthRef.current - THUMB, 1);
        const startPos = ((startValueRef.current - l.min) / (l.max - l.min)) * span;
        const p = Math.min(Math.max(startPos + g.dx, 0), span);
        const raw = l.min + (p / span) * (l.max - l.min);
        const stepped = Math.round(raw / l.step) * l.step;
        l.onChange(Math.min(Math.max(stepped, l.min), l.max));
      },
      onPanResponderRelease: () => latest.current.onInteract?.(false),
      onPanResponderTerminate: () => latest.current.onInteract?.(false),
    })
  ).current;

  return (
    <View
      style={styles.sliderContainer}
      onLayout={(e) => {
        widthRef.current = e.nativeEvent.layout.width;
        setWidth(e.nativeEvent.layout.width);
      }}
    >
      <View style={styles.sliderTrack} />
      <View style={[styles.sliderFill, { width: pos + THUMB / 2 }]} />
      <View
        {...pan.panHandlers}
        hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
        style={[styles.sliderThumb, { left: pos }]}
      />
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Payment Estimate                                                    */
/* ------------------------------------------------------------------ */
const PaymentEstimate = ({
  homePrice = 100000,
  downPaymentPercent = 20,
  onSliderInteract,
}) => {
  const [term, setTerm] = useState(30);
  const [rate, setRate] = useState(5);

  const downPayment = (homePrice * downPaymentPercent) / 100;
  const loan = homePrice - downPayment;
  const principalInterest = Math.round(monthlyPrincipalInterest(loan, rate, term));

  const legend = [
    { key: 'pi', label: 'Principal & Interest', amount: principalInterest, color: PI_COLOR },
    ...FIXED_COSTS,
  ];
  const total = legend.reduce((sum, item) => sum + item.amount, 0);

  // Clockwise order on the ring: P&I first, then the rest in reverse (as in Figma).
  const segments = useMemo(
    () => [legend[0], ...legend.slice(1).reverse()].map((l) => ({ value: l.amount, color: l.color })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [principalInterest]
  );

  const rateText = `${Number(rate.toFixed(2))}%`;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Payment Estimate</Text>

      <View style={styles.donutWrap}>
        <Donut segments={segments}>
          <Text style={styles.donutTotal}>${fmt(total)}</Text>
          <Text style={styles.donutSub}>month</Text>
        </Donut>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {legend.map((item) => (
          <View key={item.key} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
            <Text style={styles.legendAmount}>${fmt(item.amount)}</Text>
          </View>
        ))}
      </View>

      {/* Summary rows */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Down Payment</Text>
          <Text style={styles.summaryValue}>
            {downPaymentPercent}%(${fmt(downPayment)})
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Home Price</Text>
          <Text style={styles.summaryValue}>${fmt(homePrice)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Load Details</Text>
          <Text style={styles.summaryValue}>
            {term}-yr, {Number(rate.toFixed(2))}%
          </Text>
        </View>
      </View>

      {/* Loan term */}
      <View style={styles.termBlock}>
      <Text style={styles.fieldTitle}>Loan Term</Text>
      <View style={styles.termRow}>
        {LOAN_TERMS.map((t) => {
          const selected = term === t;
          return (
            <TouchableOpacity
              key={t}
              activeOpacity={0.85}
              onPress={() => setTerm(t)}
              style={[
                styles.termChip,
                selected && styles.termChipSelected,
                t === LOAN_TERMS[LOAN_TERMS.length - 1] && { marginRight: 0 },
              ]}
            >
              <Text style={[styles.termText, selected && styles.termTextSelected]}>
                {t} years
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      </View>

      {/* Interest rate */}
      <View style={styles.rateHeader}>
        <Text style={styles.fieldTitle}>Interest Rate</Text>
        <Text style={styles.rateValue}>{rateText}</Text>
      </View>
      <SingleSlider
        min={RATE_MIN}
        max={RATE_MAX}
        step={RATE_STEP}
        value={rate}
        onChange={setRate}
        onInteract={onSliderInteract}
      />
      <View style={styles.rateScale}>
        <Text style={styles.rateScaleText}>{RATE_MIN}%</Text>
        <Text style={styles.rateScaleText}>{RATE_MAX}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Card: padding 8, gap 32 between blocks (Figma frame 345 x 821)
  wrapper: {
    padding: 8,
  },
  title: {
    marginBottom: 32,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    includeFontPadding: false,
  },

  // Donut 200 x 200
  donutWrap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  donutCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutTotal: {
    fontFamily: FONT.medium,
    fontSize: 32,
    lineHeight: 44,
    color: '#202020',
    includeFontPadding: false,
  },
  donutSub: {
    marginTop: -6,
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 24,
    color: '#7A7A7A',
    includeFontPadding: false,
  },

  // Legend: rows 21 high, gap 12, dot 14 + gap 8
  legend: {
    marginBottom: 20, // + 12 from the last row = 32
  },
  legendRow: {
    height: 21,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    includeFontPadding: false,
  },
  legendAmount: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    includeFontPadding: false,
  },

  // Summary: 3 rows, gap 12
  summary: {
    marginBottom: 20, // + 12 from the last row = 32
  },
  summaryRow: {
    height: 21,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    includeFontPadding: false,
  },
  summaryValue: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    includeFontPadding: false,
  },

  // Loan term: chips 74.75 x 44, gap 10
  fieldTitle: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    includeFontPadding: false,
  },
  termBlock: {
    marginBottom: 32,
  },
  termRow: {
    marginTop: 10,
    flexDirection: 'row',
  },
  termChip: {
    flex: 1,
    height: 44,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  termChipSelected: {
    backgroundColor: ORANGE,
  },
  termText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: '#4B5563',
    includeFontPadding: false,
  },
  termTextSelected: {
    color: '#FFFFFF',
  },

  // Interest rate: header 21, slider 27 (track 12), scale labels 18
  rateHeader: {
    height: 21,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateValue: {
    fontFamily: FONT.semibold,
    fontSize: 14,
    lineHeight: 21,
    color: ORANGE,
    includeFontPadding: false,
  },
  rateScale: {
    height: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateScaleText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#4B5563',
    includeFontPadding: false,
  },

  // Slider
  sliderContainer: {
    height: 27,
  },
  sliderTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 8,
    height: TRACK_H,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 8,
    height: TRACK_H,
    borderRadius: 50,
    backgroundColor: ORANGE,
  },
  sliderThumb: {
    position: 'absolute',
    top: 3,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: ORANGE,
  },
});

export default PaymentEstimate;
