import { TonConnectUI } from '@tonconnect/ui';
import { toNano } from '@ton/core';


const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://s3.laisky.com/uploads/2024/09/connect-manifest-v2.json',
    buttonRootId: 'ton-connect'
});

tonConnectUI.onStatusChange(async (walletInfo) => {
    console.log('walletInfo', walletInfo);


    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages: [
            {
                address: "0QARnduCSjymI91urfHE_jXlnTHrmr0e4yaPubtPQkgy553b",
                amount: toNano("0.2").toString(),
            },
            {
                address: walletInfo.account.address,
                amount: toNano("0.1").toString(),
            }
        ]
    }

    const result = await tonConnectUI.sendTransaction(transaction);

    // you can use signed boc to find the transaction
    const someTxData = await myAppExplorerService.getTransaction(result.boc);
    alert('Transaction was sent successfully', someTxData);
});
