import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { BlueText } from '../../BlueComponents';
import { HDSegwitBech32Transaction, HDSegwitBech32Wallet } from '../../class';
import presentAlert from '../../components/Alert';
import SafeArea from '../../components/SafeArea';
import loc from '../../loc';
import CPFP from './CPFP';
import { StorageContext } from '../../components/Context/StorageProvider';
import { popToTop } from '../../NavigationService';
import { BlueSpacing20 } from '../../components/BlueSpacing';

export default class RBFCancel extends CPFP {
  static contextType = StorageContext;
  async componentDidMount() {
    console.log('transactions/RBFCancel - componentDidMount');
    this.setState({
      isLoading: true,
      newFeeRate: '',
      nonReplaceable: false,
    });
    await this.checkPossibilityOfRBFCancel();
  }

  async checkPossibilityOfRBFCancel() {
    if (this.state.wallet.type !== HDSegwitBech32Wallet.type) {
      return this.setState({ nonReplaceable: true, isLoading: false });
    }

    const tx = new HDSegwitBech32Transaction(null, this.state.txid, this.state.wallet);
    if (
      (await tx.isOurTransaction()) &&
      (await tx.getRemoteConfirmationsNum()) === 0 &&
      (await tx.isSequenceReplaceable()) &&
      (await tx.canCancelTx())
    ) {
      const info = await tx.getInfo();
      console.log({ info });
      return this.setState({ nonReplaceable: false, feeRate: info.feeRate + 1, isLoading: false, tx });
      // 1 gro makes a lot of difference, since sometimes because of rounding created tx's fee might be insufficient
    } else {
      return this.setState({ nonReplaceable: true, isLoading: false });
    }
  }

  async createTransaction() {
    const newFeeRate = parseInt(this.state.newFeeRate, 10);
    if (newFeeRate > this.state.feeRate) {
      /** @type {HDSegwitBech32Transaction} */
      const tx = this.state.tx;
      this.setState({ isLoading: true });
      try {
        const { tx: newTx } = await tx.createRBFcancelTx(newFeeRate);
        this.setState({ stage: 2, txhex: newTx.toHex(), newTxid: newTx.getId() });
        this.setState({ isLoading: false });
      } catch (_) {
        this.setState({ isLoading: false });
        presentAlert({ message: loc.errors.error + ': ' + _.message });
      }
    }
  }

  onSuccessBroadcast() {
    // porting metadata, if any
    this.context.txMetadata[this.state.newTxid] = this.context.txMetadata[this.state.txid] || {};

    // porting tx memo
    if (this.context.txMetadata[this.state.newTxid].memo) {
      this.context.txMetadata[this.state.newTxid].memo = 'Cancelled: ' + this.context.txMetadata[this.state.newTxid].memo;
    } else {
      this.context.txMetadata[this.state.newTxid].memo = 'Cancelled transaction';
    }
    this.context.sleep(4000).then(() => this.context.fetchAndSaveWalletTransactions(this.state.wallet.getID()));
    this.props.navigation.navigate('Success', { onDonePressed: () => popToTop(), amount: undefined });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    if (this.state.stage === 2) {
      return this.renderStage2();
    }

    if (this.state.nonReplaceable) {
      return (
        <SafeArea>
          <BlueSpacing20 />
          <BlueSpacing20 />
          <BlueSpacing20 />
          <BlueSpacing20 />
          <BlueSpacing20 />

          <BlueText h4>{loc.transactions.cancel_no}</BlueText>
        </SafeArea>
      );
    }

    return (
      <SafeArea>
        <ScrollView
          automaticallyAdjustContentInsets
          automaticallyAdjustKeyboardInsets
          automaticallyAdjustsScrollIndicatorInsets
          contentInsetAdjustmentBehavior="automatic"
        >
          {this.renderStage1(loc.transactions.cancel_explain)}
        </ScrollView>
      </SafeArea>
    );
  }
}

RBFCancel.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        txid: PropTypes.string,
        wallet: PropTypes.object,
      }),
    }),
  }),
};
