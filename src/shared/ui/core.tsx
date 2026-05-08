import { ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/theme/ThemeProvider';
import type { ThemePreference } from '@/shared/types/domain';
import { sectionGradients } from '@/shared/theme/colors';

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
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bottomSpace = 104 + insets.bottom;
  const content = (
    <View
      style={[
        styles.screenInner,
        {
          maxWidth: maxWidth ?? 1120,
          paddingHorizontal: width >= 768 ? 24 : 16,
          paddingBottom: bottomSpace
        },
        style
      ]}
    >
      {children}
    </View>
  );
  return (
    <AppBackground>
      {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
    </AppBackground>
  );
}

export function AppBackground({ children }: { children: ReactNode }) {
  const { colors, resolved } = useTheme();
  const gradient =
    resolved === 'dark'
      ? `linear-gradient(145deg, ${colors.background} 0%, ${colors.background2} 48%, #0B1024 100%)`
      : `linear-gradient(145deg, ${colors.background} 0%, ${colors.background2} 52%, ${colors.background3} 100%)`;
  const blobStyle = resolved === 'dark'
    ? { width: 300, height: 300, opacity: 0.42 }
    : { width: 220, height: 220, opacity: 0.16 };
  const blurStyle = Platform.OS === 'web' ? ({ filter: 'blur(26px)' } as ViewStyle) : null;
  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background
        },
        Platform.OS === 'web' ? ({ backgroundImage: gradient } as ViewStyle) : null
      ]}
    >
      <View style={[styles.blob, styles.blobTopLeft, blobStyle, blurStyle, { backgroundColor: colors.glowPurple }]} />
      <View style={[styles.blob, styles.blobTopRight, blobStyle, blurStyle, { backgroundColor: colors.glowCyan }]} />
      <View style={[styles.blob, styles.blobBottom, blobStyle, blurStyle, { backgroundColor: colors.glowPink }]} />
      <View pointerEvents="none" style={[styles.noiseOverlay, { borderColor: colors.border }]} />
      {children}
    </View>
  );
}

export function Card({
  children,
  style,
  variant = 'default',
  accent = 'discover'
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle> | undefined;
  variant?: 'default' | 'elevated' | 'glass' | 'featured' | 'interactive';
  accent?: keyof typeof sectionGradients;
}) {
  const { colors } = useTheme();
  const gradient = sectionGradients[accent];
  const baseSurface =
    variant === 'glass' ? colors.surfaceGlass : variant === 'elevated' || variant === 'featured' ? colors.surfaceElevated : colors.surface;
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: baseSurface,
          borderColor: variant === 'featured' ? colors.borderStrong : colors.border,
          shadowColor:
            variant === 'featured'
              ? accent === 'library'
                ? colors.glowCyan
                : accent === 'profile'
                  ? colors.glowCyan
                  : colors.glowPink
              : colors.glowPurple,
          shadowOpacity: variant === 'default' ? 0.08 : 0.18,
          borderTopColor: variant === 'featured' ? gradient[0] : undefined
        },
        Platform.OS === 'web' && variant === 'interactive'
          ? ({ transitionDuration: '160ms', transitionProperty: 'transform, border-color, box-shadow' } as ViewStyle)
          : null,
        style
      ]}
    >
      {children}
    </View>
  );
}

export function GradientButton({
  title,
  onPress,
  disabled,
  icon
}: {
  title: string;
  onPress?: (() => void) | undefined;
  disabled?: boolean | undefined;
  icon?: ReactNode | undefined;
}) {
  const { colors, resolved } = useTheme();
  const from = resolved === 'dark' ? '#A855F7' : '#7C3AED';
  const to = resolved === 'dark' ? '#FF3EB5' : '#DB2777';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.button,
        styles.gradientButton,
        {
          backgroundColor: pressed ? colors.primaryBright : colors.primary,
          borderColor: colors.primaryBright,
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.98 : hovered ? 1.015 : 1 }],
          shadowColor: colors.glowPink,
          shadowOpacity: 0.36,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 }
        },
        Platform.OS === 'web'
          ? ({ backgroundImage: `linear-gradient(120deg, ${from}, ${to})` } as ViewStyle)
          : null
      ]}
    >
      {icon}
      <AppText variant="label" color={colors.primaryText}>
        {title}
      </AppText>
    </Pressable>
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
        {
          backgroundColor: pressed && variant === 'primary' ? colors.primaryHover : bg,
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
          borderColor: variant === 'primary' ? colors.primaryHover : variant === 'secondary' ? colors.borderStrong : colors.border,
          shadowColor: variant === 'primary' ? colors.glowSecondary : 'transparent',
          shadowOpacity: variant === 'primary' ? 0.28 : 0,
          shadowRadius: variant === 'primary' ? 14 : 0,
          shadowOffset: { width: 0, height: 0 },
          elevation: variant === 'primary' ? 3 : 0
        }
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
        {
          borderColor: colors.borderStrong,
          backgroundColor: colors.surfaceGlass,
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }]
        }
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
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        {...props}
        placeholderTextColor={colors.textSubtle}
        style={[
          styles.input,
          {
            borderColor: error ? colors.danger : focused ? colors.accent : colors.border,
            color: colors.text,
            backgroundColor: colors.surface,
            shadowColor: focused ? colors.glowAccent : 'transparent',
            shadowOpacity: focused ? 0.32 : 0,
            shadowRadius: focused ? 10 : 0,
            shadowOffset: { width: 0, height: 0 }
          },
          props.style
        ]}
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
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
          backgroundColor: selected ? colors.surface3 : colors.surface,
          borderColor: selected ? colors.borderStrong : colors.border
        }
      ]}
    >
      <AppText variant="small" color={selected ? colors.text : colors.textMuted}>
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
    accent: [colors.glowCyan, colors.accentBright]
  } as const;
  return (
    <View style={[styles.badge, { backgroundColor: map[tone][0], borderColor: tone === 'accent' ? colors.accent : 'transparent' }]}>
      <AppText variant="small" color={map[tone][1]}>
        {label}
      </AppText>
    </View>
  );
}

export function Avatar({ url, name, size = 48 }: { url?: string | null | undefined; name: string; size?: number }) {
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
        trackColor={{ false: colors.surfaceMuted, true: colors.secondary }}
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
  title: { fontSize: 32, lineHeight: 38, fontWeight: '700', letterSpacing: -0.2 },
  section: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.1 },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontSize: 15, lineHeight: 20, fontWeight: '600' }
});

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flexGrow: 1 },
  screenInner: { width: '100%', alignSelf: 'center', paddingVertical: 24, gap: 16 },
  blob: { position: 'absolute', borderRadius: 999 },
  blobTopLeft: { top: -115, left: -90 },
  blobTopRight: { top: -100, right: -105 },
  blobBottom: { bottom: -135, alignSelf: 'center' },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    borderWidth: StyleSheet.hairlineWidth
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 12,
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2
  },
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
  gradientButton: { overflow: 'hidden' },
  iconButton: { width: 44, height: 44, borderRadius: 999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  field: { gap: 8 },
  input: { minHeight: 50, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, fontSize: 16 },
  textArea: { minHeight: 112, paddingTop: 12, textAlignVertical: 'top' },
  select: { minHeight: 48, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chip: { minHeight: 36, borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, borderWidth: StyleSheet.hairlineWidth },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  state: { alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 20 },
  modalSheet: { borderWidth: 1, borderRadius: 18, padding: 12, gap: 4, width: '100%', maxWidth: 420, alignSelf: 'center' },
  bottomSheet: { borderWidth: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, gap: 16, marginTop: 'auto' },
  option: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 10 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }
});
