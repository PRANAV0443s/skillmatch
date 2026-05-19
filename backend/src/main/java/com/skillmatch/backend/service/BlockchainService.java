package com.skillmatch.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Utf8String;

import java.util.Arrays;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class BlockchainService {
    
    @Autowired(required = false)
    private Web3j web3j;

    @Value("${web3.contract.address:}")
    private String contractAddress;

    @Value("${web3.wallet.private.key:}")
    private String privateKey;

    public String storeResumeHash(String userAddress, String hash) {
        if (web3j == null || privateKey.isEmpty() || contractAddress.isEmpty()) {
            System.out.println("Blockchain credentials not fully configured. Simulating transaction for hash: " + hash);
            return "0xSimulatedTxHash_" + System.currentTimeMillis();
        }

        try {
            Credentials credentials = Credentials.create(privateKey);
            TransactionManager txManager = new RawTransactionManager(web3j, credentials);
            
            // Function: storeResumeHash(string _hash)
            Function function = new Function(
                    "storeResumeHash",
                    Arrays.asList(new Utf8String(hash)),
                    Collections.emptyList()
            );

            String encodedFunction = FunctionEncoder.encode(function);
            EthSendTransaction receipt = txManager.sendTransaction(
                    DefaultGasProvider.GAS_PRICE,
                    DefaultGasProvider.GAS_LIMIT,
                    contractAddress,
                    encodedFunction,
                    java.math.BigInteger.ZERO
            );

            return receipt.getTransactionHash();
        } catch (Exception e) {
            System.err.println("Error storing hash on blockchain: " + e.getMessage());
            return "Error: " + e.getMessage();
        }
    }

    public boolean verifyHash(String userAddress, String hash) {
        // In a full implementation, you would call getResumeHash(address) and compare
        // For now, if we have a real connection, we could verify. Otherwise return true for demo.
        return true;
    }
}
