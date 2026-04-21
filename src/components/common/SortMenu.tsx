import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { strings } from '../../localization/strings';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';

type SortOption = 'name' | 'date';

interface SortMenuProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  labels?: Record<SortOption, string>;
  showSelectedValue?: boolean;
}

export function SortMenu({
  value,
  onChange,
  labels = {
    name: strings.common.sort.name,
    date: strings.common.sort.dateAdded,
  },
  showSelectedValue = false,
}: SortMenuProps): React.JSX.Element {
  const [open, setOpen] = useState(false);

  function handleSelect(nextValue: SortOption) {
    onChange(nextValue);
    setOpen(false);
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.trigger} onPress={() => setOpen(current => !current)}>
        <Text style={styles.triggerText}>
          {showSelectedValue
            ? strings.common.sort.selected(labels[value])
            : strings.common.actions.sortBy}
        </Text>
        {open ? (
          <ChevronUp color={colors.textSecondary} size={18} strokeWidth={2.3} />
        ) : (
          <ChevronDown color={colors.textSecondary} size={18} strokeWidth={2.3} />
        )}
      </Pressable>
      {open ? (
        <View style={styles.menu}>
          <Pressable style={styles.option} onPress={() => handleSelect('name')}>
            <Text style={styles.optionLabel}>{labels.name}</Text>
            {value === 'name' ? (
              <Check color={colors.primary} size={16} strokeWidth={2.4} />
            ) : null}
          </Pressable>
          <Pressable style={styles.option} onPress={() => handleSelect('date')}>
            <Text style={styles.optionLabel}>{labels.date}</Text>
            {value === 'date' ? (
              <Check color={colors.primary} size={16} strokeWidth={2.4} />
            ) : null}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    zIndex: 10,
  },
  trigger: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  triggerText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  menu: {
    ...shadows.card,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    minWidth: 148,
    overflow: 'hidden',
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  optionLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
