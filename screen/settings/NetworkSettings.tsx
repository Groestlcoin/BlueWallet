import React from 'react';
// import { isNotificationsCapable } from '../../blue_modules/notifications';
import ListItem from '../../components/ListItem';
import loc from '../../loc';
import { useExtendedNavigation } from '../../hooks/useExtendedNavigation';
import SafeAreaScrollView from '../../components/SafeAreaScrollView';

const NetworkSettings: React.FC = () => {
  const navigation = useExtendedNavigation();

  const navigateToElectrumSettings = () => {
    navigation.navigate('ElectrumSettings');
  };

  const navigateToLightningSettings = () => {
    navigation.navigate('LightningSettings');
  };

  const navigateToBlockExplorerSettings = () => {
    navigation.navigate('SettingsBlockExplorer');
  };

  return (
    <SafeAreaScrollView contentInsetAdjustmentBehavior="automatic" automaticallyAdjustContentInsets>
      <ListItem title={loc.settings.block_explorer} onPress={navigateToBlockExplorerSettings} testID="BlockExplorerSettings" chevron />
      <ListItem title={loc.settings.network_electrum} onPress={navigateToElectrumSettings} testID="ElectrumSettings" chevron />
      <ListItem title={loc.settings.lightning_settings} onPress={navigateToLightningSettings} testID="LightningSettings" chevron />
      {/* isNotificationsCapable && (
        <ListItem
          title={loc.settings.notifications}
          onPress={() => navigation.navigate('NotificationSettings')}
          testID="NotificationSettings"
          chevron
        />
      ) */}
    </SafeAreaScrollView>
  );
};

export default NetworkSettings;
