package com.project.directory.config;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.impl.Http2SolrClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// solr client config - added timeouts after load testing showed thread exhaustion
@Configuration
public class SolrConfig {

    @Value("${app.solr.url}")
    private String solrUrl;

    @Bean
    public SolrClient solrClient() {
        return new Http2SolrClient.Builder(solrUrl)
                .withConnectionTimeout(5000, java.util.concurrent.TimeUnit.MILLISECONDS)
                .withRequestTimeout(10000, java.util.concurrent.TimeUnit.MILLISECONDS)
                .build();
    }
}
