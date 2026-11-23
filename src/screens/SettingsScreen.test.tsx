import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameSettingsProvider } from '../hooks/useGameSettings';
import { ThemeProvider } from '../theme/ThemeContext';
import { RootStackScreenProps } from '../types/navigation';
import { PRIVACY_POLICY_URL, SettingsScreen } from './SettingsScreen';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
// Icon fonts aren't loadable under Jest; icons aren't what this test checks.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

describe('SettingsScreen', () => {
  it('opens the privacy policy in the browser', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    const props = { navigation: { goBack: jest.fn() }, route: { key: 'Settings', name: 'Settings' } } as unknown as RootStackScreenProps<'Settings'>;

    await render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <ThemeProvider>
          <GameSettingsProvider>
            <SettingsScreen {...props} />
          </GameSettingsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );

    await fireEvent.press(screen.getByLabelText('Privacy Policy'));
    expect(openURL).toHaveBeenCalledWith(PRIVACY_POLICY_URL);
    // Full-screen render is slow on a cold Jest cache when suites run in parallel.
  }, 15000);
});
