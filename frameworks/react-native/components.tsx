import { createContext, useContext, type ReactNode } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { themeTokens } from '../../shared/tokens.mjs'

export type Theme = 'red' | 'blue'
export const ThemeContext = createContext<Theme>('red')
export const useTokens = () => themeTokens(useContext(ThemeContext))

export function Button({ children, variant = 'primary', size = 'md', state, onPress }: {
  children: ReactNode; variant?: string; size?: string; state?: string; onPress?: () => void
}) {
  const t = useTokens()
  const primary = variant === 'primary' || variant === 'danger'
  const disabled = state === 'disabled' || state === 'loading'
  const color = primary ? t.paper : t.hover
  const background = variant === 'danger' ? t.danger : primary ? t.action : t.paper
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled, busy: state === 'loading' }}
    disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.button, {
      backgroundColor: pressed && primary ? t.hover : background,
      minHeight: size === 'lg' ? 56 : size === 'sm' ? 44 : 48,
      borderColor: variant === 'secondary' ? t.hover : 'transparent',
      opacity: disabled ? .5 : pressed ? .85 : 1,
    }]}>
    <Text style={{ color, fontSize: 15, fontWeight: '700', textAlign: 'center' }}>{children}</Text>
  </Pressable>
}

export function Badge({ children, variant = 'default', size = 'md' }: { children: ReactNode; variant?: string; size?: string }) {
  const t = useTokens()
  const colors: Record<string, [string, string]> = {
    default: [t.surface, t.muted], brand: [t.tint, t.deep], info: [t.tint, t.deep],
    warning: [t.warningTint, t.warning], success: [t.successTint, t.success], danger: [t.dangerTint, t.danger],
  }
  const [backgroundColor, color] = colors[variant] ?? colors.default
  return <Text style={{ borderRadius: 20, overflow: 'hidden', alignSelf: 'flex-start', paddingHorizontal: 9,
    paddingVertical: 5, fontSize: size === 'sm' ? 11 : 12, fontWeight: '700', color, backgroundColor }}>{children}</Text>
}

export function Card({ children, variant, header }: { children?: ReactNode; variant?: string; header?: string }) {
  const t = useTokens()
  return <View style={[styles.card, {
    backgroundColor: t.paper, borderColor: variant === 'bordered' ? t.action : t.border,
    elevation: variant === 'elevated' ? 5 : 0,
    shadowColor: t.ink, shadowOpacity: variant === 'elevated' ? .14 : 0, shadowRadius: 12,
  }]}>{header && <Heading>{header}</Heading>}{children}</View>
}

export function Alert({ children, variant = 'info', dismissible = false, onDismiss }: {
  children: ReactNode; variant?: string; dismissible?: boolean; onDismiss?: () => void
}) {
  const t = useTokens()
  const stylesByTone: Record<string, [string, string]> = {
    info: [t.tint, t.deep], success: [t.successTint, t.success], warning: [t.warningTint, t.warning], danger: [t.dangerTint, t.danger],
  }
  const [backgroundColor, color] = stylesByTone[variant] ?? stylesByTone.info
  return <View accessibilityLiveRegion="polite" style={{ backgroundColor, borderRadius: 12, padding: 14 }}>
    {typeof children === 'string' ? <Text style={{ color, fontSize: 15, lineHeight: 22 }}>{children}</Text> : children}
    {dismissible && <Button variant="ghost" onPress={onDismiss}>Dismiss</Button>}
  </View>
}

export function Input({ label, value, onChangeText, placeholder, error, state, email, multiline }: {
  label: string; value?: string; onChangeText?: (value: string) => void; placeholder?: string
  error?: string; state?: string; email?: boolean; multiline?: boolean
}) {
  const t = useTokens()
  return <View style={{ gap: 5 }}>
    <Text style={{ color: t.ink, fontWeight: '700', fontSize: 15 }}>{label}</Text>
    <TextInput value={value} accessibilityLabel={label} placeholder={placeholder} placeholderTextColor={t.muted}
      onChangeText={onChangeText} editable={state !== 'disabled'} multiline={multiline}
      autoCapitalize={email ? 'none' : 'sentences'} keyboardType={email ? 'email-address' : 'default'}
      style={{ minHeight: multiline ? 100 : 48, borderWidth: 1, borderColor: error ? t.danger : t.muted,
        borderRadius: 9, padding: 11, color: t.ink, fontSize: 16 }} />
    {!!error && <Text accessibilityLiveRegion="polite" style={{ color: t.danger }}>{error}</Text>}
  </View>
}

export function Heading({ children, large = false }: { children: ReactNode; large?: boolean }) {
  const t = useTokens()
  return <Text accessibilityRole="header" style={{ color: t.ink, fontSize: large ? 38 : 23,
    fontWeight: '800', letterSpacing: large ? -1.65 : -.6 }}>{children}</Text>
}

export function Body({ children }: { children: ReactNode }) {
  const t = useTokens()
  return <Text style={{ color: t.muted, fontSize: 16, lineHeight: 23 }}>{children}</Text>
}

export function Hero({ eyebrow, title, subtitle, children }: {
  eyebrow?: string; title: string; subtitle?: string; children?: ReactNode; variant?: string
}) {
  const t = useTokens()
  return <View style={{ backgroundColor: t.tint, borderRadius: 21, padding: 23, gap: 14 }}>
    {eyebrow && <Text style={{ color: t.hover, fontWeight: '800', fontSize: 13 }}>{eyebrow}</Text>}
    <Heading large>{title}</Heading>
    {subtitle && <Body>{subtitle}</Body>}
    {children}
  </View>
}

export function CTABanner({ title, subtitle, children, variant }: {
  title: string; subtitle?: string; children?: ReactNode; variant?: string
}) {
  const t = useTokens()
  return <View style={{ gap: 12, padding: 20, borderRadius: 16, backgroundColor: variant === 'subtle' ? t.tint : t.darkest }}>
    <Text accessibilityRole="header" style={{ fontSize: 22, fontWeight: '800', color: variant === 'subtle' ? t.ink : t.paper }}>{title}</Text>
    {subtitle && <Text style={{ fontSize: 16, color: variant === 'subtle' ? t.muted : t.tint }}>{subtitle}</Text>}
    {children}
  </View>
}

const styles = StyleSheet.create({
  button: { borderRadius: 25, paddingHorizontal: 16, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  card: { padding: 17, borderRadius: 16, borderWidth: 1, gap: 9 },
})
