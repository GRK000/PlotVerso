import { ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle
} from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import { useTheme } from '@/shared/theme/ThemeProvider';
import type { ThemePreference } from '@/shared/types/domain';

export function AppText({
  children,
  variant = 'body',
  color,
  style,
  numberOfLines
}: {
  children: ReactNode;
  variant?: 'title' | 'section' | 'body' | 'small' | 'label';
  color?: string;
  style?: StyleProp<TextStyle> | undefined;
  numberOfLines?: number | undefined;
}) {
  const { colors } = useTheme();
  const base = variantStyles[variant];
  return (
    <Text numberOfLines={numberOfLines} style={[{ color: color ?? colors.text }, base, style]}>
      {children}
    </Text>
  );
}

export function Screen({
  children,
  maxWidth,
  scroll = true,
  style
}: {
  children: ReactNode;
  maxWidth?: number | undefined;
  scroll?: boolean | undefined;
  style?: StyleProp<ViewStyle> | undefined;
}) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const content = (
    <View
      style={[
        styles.screenInner,
        { maxWidth: maxWidth ?? 1120, paddingHorizontal: width >= 768 ? 24 : 16 },
        style
      ]}
    >
      {children}
    </View>
  );
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> | undefined }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style
      ]}
    >
      {children}
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  icon
}: {
  title: string;
  onPress?: (() => void) | undefined;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean | undefined;
  icon?: ReactNode | undefined;
}) {
  const { colors } = useTheme();
  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'danger'
        ? colors.dangerSoft
        : variant === 'secondary'
          ? colors.surfaceMuted
          : 'transparent';
  const fg =
    variant === 'primary'
      ? colors.primaryText
      : variant === 'danger'
        ? colors.danger
        : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1, borderColor: colors.border }
      ]}
    >
      {icon}
      <AppText variant="label" color={fg}>
        {title}
      </AppText>
    </Pressable>
  );
}

export function IconButton({
  label,
  onPress,
  children
}: {
  label: string;
  onPress?: (() => void) | undefined;
  children: ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        { borderColor: colors.border, backgroundColor: colors.surface, opacity: pressed ? 0.75 : 1 }
      ]}
    >
      {children}
    </Pressable>
  );
}

export function TextField({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string | undefined }) {
  const { colors } = useTheme();
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        placeholderTextColor={colors.textSubtle}
        style={[
          styles.input,
          { borderColor: error ? colors.danger : colors.border, color: colors.text, backgroundColor: colors.surface }
        ]}
        {...props}
      />
      {error ? (
        <AppText variant="small" color={colors.danger}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

export function TextArea(props: TextInputProps & { label: string; error?: string | undefined }) {
  return <TextField {...props} multiline numberOfLines={4} style={[styles.textArea, props.style]} />;
}

export function Select({
  label,
  value,
  options,
  onChange,
  error
}: {
  label: string;
  value?: string | undefined;
  options: readonly string[];
  onChange: (value: string) => void;
  error?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        style={[styles.select, { borderColor: error ? colors.danger : colors.border, backgroundColor: colors.surface }]}
      >
        <AppText color={value ? colors.text : colors.textSubtle}>{value || 'Seleccionar'}</AppText>
        <ChevronDown size={18} color={colors.textMuted} />
      </Pressable>
      {error ? <AppText variant="small" color={colors.danger}>{error}</AppText> : null}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            {options.map((option) => (
              <Pressable
                key={option}
                style={styles.option}
                onPress={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                <AppText>{option}</AppText>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress
}: {
  label: string;
  selected?: boolean | undefined;
  onPress?: (() => void) | undefined;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.accentSoft : colors.surface,
          borderColor: selected ? colors.accent : colors.border
        }
      ]}
    >
      <AppText variant="small" color={selected ? colors.accent : colors.textMuted}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function Badge({ label, tone = 'muted' }: { label: string; tone?: 'muted' | 'success' | 'warning' | 'danger' | 'accent' }) {
  const { colors } = useTheme();
  const map = {
    muted: [colors.surfaceMuted, colors.textMuted],
    success: [colors.successSoft, colors.success],
    warning: [colors.warningSoft, colors.warning],
    danger: [colors.dangerSoft, colors.danger],
    accent: [colors.accentSoft, colors.accent]
  } as const;
  return (
    <View style={[styles.badge, { backgroundColor: map[tone][0] }]}>
      <AppText variant="small" color={map[tone][1]}>
        {label}
      </AppText>
    </View>
  );
}

export function Avatar({ url, name, size = 48 }: { url?: string | null; name: string; size?: number }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surfaceMuted }]}>
      {url ? (
        <Image source={{ uri: url }} style={{ width: size, height: size, borderRadius: size / 2 }} accessibilityLabel={name} />
      ) : (
        <AppText variant="label">{name.slice(0, 1).toUpperCase()}</AppText>
      )}
    </View>
  );
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  const { colors } = useTheme();
  return (
    <Card style={styles.state}>
      <AppText variant="section">{title}</AppText>
      {body ? <AppText color={colors.textMuted}>{body}</AppText> : null}
      {action}
    </Card>
  );
}

export function LoadingState({ label = 'Cargando' }: { label?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.state}>
      <ActivityIndicator color={colors.primary} />
      <AppText color={colors.textMuted}>{label}</AppText>
    </View>
  );
}

export function ErrorState({ title, retry }: { title: string; retry?: () => void }) {
  return <EmptyState title={title} action={retry ? <Button title="Reintentar" onPress={retry} /> : null} />;
}

export function ThemeToggle() {
  const { preference, setPreference, colors } = useTheme();
  const next: ThemePreference = preference === 'dark' ? 'light' : 'dark';
  return (
    <View style={styles.toggleRow}>
      <AppText variant="small" color={colors.textMuted}>
        {preference === 'dark' ? 'Oscuro' : preference === 'light' ? 'Claro' : 'Sistema'}
      </AppText>
      <Switch
        accessibilityLabel="Cambiar tema"
        value={preference === 'dark'}
        onValueChange={() => setPreference(next)}
        trackColor={{ false: colors.surfaceMuted, true: colors.primary }}
        thumbColor={colors.surface}
      />
    </View>
  );
}

export function BottomSheet({
  visible,
  title,
  children,
  onClose
}: {
  visible: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.bottomSheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.rowBetween}>
            <AppText variant="section">{title}</AppText>
            <IconButton label="Cerrar" onPress={onClose}>
              <X size={18} color={colors.text} />
            </IconButton>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const variantStyles = StyleSheet.create({
  title: { fontSize: 30, lineHeight: 36, fontWeight: '700' },
  section: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontSize: 15, lineHeight: 20, fontWeight: '600' }
});

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flexGrow: 1 },
  screenInner: { width: '100%', alignSelf: 'center', paddingVertical: 24, gap: 16 },
  card: { borderWidth: 1, borderRadius: 14, padding: 16, gap: 12 },
  button: {
    minHeight: 48,
    borderRadius: 999,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth
  },
  iconButton: { width: 44, height: 44, borderRadius: 999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  field: { gap: 8 },
  input: { minHeight: 48, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, fontSize: 16 },
  textArea: { minHeight: 112, paddingTop: 12, textAlignVertical: 'top' },
  select: { minHeight: 48, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chip: { minHeight: 36, borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  state: { alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 20 },
  modalSheet: { borderWidth: 1, borderRadius: 18, padding: 12, gap: 4, width: '100%', maxWidth: 420, alignSelf: 'center' },
  bottomSheet: { borderWidth: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, gap: 16, marginTop: 'auto' },
  option: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 10 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }
});
