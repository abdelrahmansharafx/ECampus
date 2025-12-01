import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <LinearGradient
          colors={COLORS.gradient.grayscale}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            {__DEV__ && this.state.errorInfo && (
              <View style={styles.details}>
                <Text style={styles.detailsTitle}>Error Details:</Text>
                <Text style={styles.detailsText}>
                  {this.state.error?.stack}
                </Text>
                <Text style={styles.detailsText}>
                  {this.state.errorInfo.componentStack}
                </Text>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 24,
  },
  details: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    width: '100%',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 12,
    color: COLORS.white,
    fontFamily: 'monospace',
  },
});

export default ErrorBoundary;



