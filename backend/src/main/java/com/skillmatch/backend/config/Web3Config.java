package com.skillmatch.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

@Configuration
public class Web3Config {

    @Value("${web3.rpc.url:}")
    private String rpcUrl;

    @Bean
    public Web3j web3j() {
        if (rpcUrl == null || rpcUrl.isEmpty() || rpcUrl.contains("YOUR_INFURA_KEY")) {
            return null;
        }
        return Web3j.build(new HttpService(rpcUrl));
    }
}
