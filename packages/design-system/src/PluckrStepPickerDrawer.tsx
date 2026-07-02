import React, { useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent
} from "react-native";

import { PluckrBottomDrawer } from "./primitives/BottomSheet";
import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrStepPickerDrawerProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  value: number;
  unit: string;
  step: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onClose: () => void;
};

const ITEM_HEIGHT = 36;
const VISIBLE_ROWS = 5;

export function PluckrStepPickerDrawer({
  visible,
  title,
  subtitle,
  value,
  unit,
  step,
  min,
  max,
  onChange,
  onClose
}: PluckrStepPickerDrawerProps) {
  const listRef = useRef<FlatList<number>>(null);
  const values = useMemo(() => buildValues(min, max, step), [max, min, step]);
  const decimals = step < 1 ? 1 : 0;
  const currentIndex = findClosestIndex(values, value);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timeoutId = setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: currentIndex,
        animated: false,
        viewPosition: 0.5
      });
    }, 60);

    return () => clearTimeout(timeoutId);
  }, [currentIndex, visible]);

  function handleMomentumEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const nextValue = values[Math.max(0, Math.min(values.length - 1, nextIndex))];

    if (typeof nextValue === "number") {
      onChange(nextValue);
    }
  }

  return (
    <PluckrBottomDrawer
      visible={visible}
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      scrollable={false}
      actionLabel="✓"
      onAction={onClose}
    >
      <View style={styles.wheelShell}>
        <View style={styles.selectionBand} />
        <FlatList
          ref={listRef}
          data={values}
          keyExtractor={(item) => `${item}`}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            index,
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index
          })}
          contentContainerStyle={styles.wheelContent}
          onMomentumScrollEnd={handleMomentumEnd}
          renderItem={({ item }) => {
            const selected = item === values[currentIndex];

            return (
              <Pressable
                accessibilityRole="button"
                style={styles.wheelRow}
                onPress={() => onChange(item)}
              >
                <Text style={[styles.wheelValue, selected ? styles.wheelValueActive : null]}>
                  {item.toFixed(decimals)}
                </Text>
                <Text style={[styles.wheelUnit, selected ? styles.wheelValueActive : null]}>
                  {unit}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    </PluckrBottomDrawer>
  );
}

function buildValues(min: number, max: number, step: number) {
  const values: number[] = [];
  const decimals = step < 1 ? 1 : 0;

  for (let current = min; current <= max; current += step) {
    values.push(Number(current.toFixed(decimals)));
  }

  return values;
}

function findClosestIndex(values: number[], value: number) {
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  values.forEach((candidate, index) => {
    const distance = Math.abs(candidate - value);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

const styles = StyleSheet.create({
  wheelShell: {
    height: ITEM_HEIGHT * VISIBLE_ROWS,
    borderRadius: pluckrAppTheme.radii.lg,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted,
    overflow: "hidden"
  },
  selectionBand: {
    pointerEvents: "none",
    position: "absolute",
    left: 10,
    right: 10,
    top: ITEM_HEIGHT * 2,
    height: ITEM_HEIGHT,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "rgba(255, 250, 243, 0.84)",
    zIndex: 1
  },
  wheelContent: {
    paddingVertical: ITEM_HEIGHT * 2
  },
  wheelRow: {
    height: ITEM_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: pluckrAppTheme.spacing.sm
  },
  wheelValue: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "500"
  },
  wheelUnit: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "600"
  },
  wheelValueActive: {
    color: pluckrAppTheme.colors.textPrimary,
    fontWeight: "700"
  }
});
