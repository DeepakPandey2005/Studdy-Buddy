import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, ViewProps } from 'react-native';

interface PremiumBackgroundProps extends ViewProps {
    children: React.ReactNode;
}

export const PremiumBackground = ({ children, style, ...props }: PremiumBackgroundProps) => {
    return (
        <View style={[styles.container, style]} {...props}>
            <LinearGradient
                // Deep Indigo to Charcoal/Black gradient
                colors={['#0f172a', '#1e1b4b', '#020617']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            {/* Subtle decorative glow */}
            <View
                style={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: 200,
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    opacity: 0.5,
                }}
            />
            <View style={{ flex: 1 }}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
