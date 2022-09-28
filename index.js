// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

// personal secret key replaced with demo for public git
const DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
        160,  20, 189, 212, 129, 188, 171, 124,  20, 179,  80,
         27, 166,  17, 179, 198, 234,  36, 113,  87,   0,  46,
        186, 250, 152, 137, 244,  15,  86, 127,  77,  97, 170,
         44,  57, 126, 115, 253,  11,  60,  90,  36, 135, 177,
        185, 231,  46, 155,  62, 164, 128, 225, 101,  79,  69,
        101, 154,  24,  58, 214, 219, 238, 149,  86
      ]            
);


 // Get Keypair from Secret Key
 var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

 // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();

const transferSol = async() => {
   // Connect to the Devnet
   const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
   //  console.log("Connection object is:", connection);

   // Calculate from getbalance
   const fromwalletBalance = await connection.getBalance(new PublicKey(from.publicKey));
   const calcwalleltb = fromwalletBalance / LAMPORTS_PER_SOL / 2;
   console.log("50% of the balance is :", calcwalleltb);
     
    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to.publicKey,
   //     lamports: 2
     lamports: calcwalleltb * LAMPORTS_PER_SOL
    })
    );
    // Sign transaction
    var signature = await sendAndConfirmTransaction(
      connection,
     transaction,
     [from]
    );
    console.log('Signature is ', signature);
};


const LaunchAirDrop = async() => {
    // Connect to the Devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    //  console.log("Connection object is:", connection);
    
    // Aidrop 2 SOL to Sender wallet
    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );

    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });
    console.log("Airdrop completed for the Sender account");
};

   
   
 // get balance from sender account
 const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
     //  console.log("Connection object is:", connection);

        // Make a wallet (keypair) from privateKey and get its balance
    //const myWallet = await Keypair.fromSecretKey(privateKey);
        const walletBalance = await connection.getBalance(new PublicKey(from.publicKey));
        const TowalletBalance = await connection.getBalance(new PublicKey(to.publicKey));    
 //       console.log("WalletAddr: ", from.publicKey);
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
 //       console.log("WalletAddr: ", to.publicKey);
        console.log(`to Wallet balance: ${parseInt(calcwalleltb) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

// Show the Sol Airdropped & Balance
const mainFunction = async () => {
    await getWalletBalance();
    await LaunchAirDrop();
    await getWalletBalance();
    await transferSol();
    await getWalletBalance();
}

mainFunction();