import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleSheet, View } from 'react-native';

interface IProps {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
}

const ImageSkeleton = ({ width, height, borderRadius = 12 }: IProps) => {
  const translateX = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 300,
        duration: 1200,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient colors={['#E1E9EE', '#F2F8FC', '#E1E9EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient} />
      </Animated.View>
    </View>
  );
};

export default ImageSkeleton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
  },
  shimmer: {
    width: 200,
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
});
