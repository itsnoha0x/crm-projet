package com.crm.loyalty.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "loyalty.exchange";
    public static final String QUEUE    = "tier.upgrade.queue";
    public static final String KEY      = "tier.upgraded";

    @Bean
    public TopicExchange loyaltyExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue tierUpgradedQueue() {
        return QueueBuilder.durable(QUEUE).build();
    }

    @Bean
    public Binding binding() {
        return BindingBuilder.bind(tierUpgradedQueue())
            .to(loyaltyExchange())
            .with(KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
